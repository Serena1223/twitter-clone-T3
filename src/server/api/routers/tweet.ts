import { z } from "zod";

import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "~/server/api/trpc";

export const tweetRouter = createTRPCRouter({
  infiniteFeed: publicProcedure
    .input(
      z.object({
        limit: z.number().optional(),
        cursor: z.object({ id: z.string(), createdAt: z.date() }).optional(),
      })
    )
    .query(async ({ input: { limit = 10, cursor }, ctx }) => {
      // ctx has sessions and database stuff.
      const currentUserId = ctx.session?.user.id; // could be null cuz it's a public procedure

      const data = await ctx.prisma.tweet.findMany({
        take: limit + 1,
        cursor: cursor ? { createdAt_id: cursor } : undefined, // start point for cursor
        orderBy: [{ createdAt: "desc" }, { id: "desc" }], //createdAt is strict
        select: {
          // we get the tweets and now we're selecting the fields we want from the tweets
          id: true,
          content: true,
          createdAt: true,
          likes:
            currentUserId == null
              ? false
              : { where: { userId: currentUserId } }, // if likes[] is len 1 then user liked it, if len is 0 then user did not like it
          _count: { select: { likes: true } }, // _count special prisma property that gives the num (as part of the returned object) of the field you select (number of likes) (length of likes array)
          user: { select: { name: true, id: true, image: true } }, // nested query (tweet's user's properties)
        },
      });

      let nextCursor: typeof cursor | undefined;
      if (data.length > limit) {
        const nextItem = data.pop(); // also removes from original data array
        if (nextItem != null) {
          nextCursor = { id: nextItem.id, createdAt: nextItem.createdAt };
        }
      }
      return {
        tweets: data.map((tweet) => {
          // tweet represents each element in data
          return {
            id: tweet.id,
            content: tweet.content,
            createdAt: tweet.createdAt,
            likeCount: tweet._count.likes,
            user: tweet.user,
            likedByMe: tweet.likes?.length > 0,
          };
        }),
        nextCursor,
      }; // tweets is a better formated version of data
    }),

  create: protectedProcedure //must be authenticated
    .input(z.object({ content: z.string() })) // expect an object that has a content which is string
    .mutation(async ({ input: { content }, ctx }) => {
      return await ctx.prisma.tweet.create({
        // tweet.create is created by prisma based on Tweet model defined in schema
        data: {
          content,
          userId: ctx.session.user.id,
        }, // key value pairs
      }); // async await here doesn't make diff cuz we dont need to do anything after it returns
    }),
    toggleLike: protectedProcedure
    .input(z.object({ id: z.string()}))
    .mutation(async({input: {id}, ctx}) => {
      const data = {tweetId: id, userId: ctx.session.user.id};
      const existingLike = await ctx.prisma.like.findUnique({
        where: {userId_tweetId: data},
      })

      if (existingLike == null) {
        await ctx.prisma.like.create({data});
        return {addedLike: true};
      } else {
        await ctx.prisma.like.delete({where: {userId_tweetId: data}});
        return {addedLike: false};
      }
    })
});
