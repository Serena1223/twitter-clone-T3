import { type NextPage } from "next";
import { signIn, signOut, useSession } from "next-auth/react";
import { InfiniteTweetList } from "~/components/InfiniteTweetList";
import { NextTweetForm } from "~/components/NewTweetForm";
import { api } from "~/utils/api";

const Home: NextPage = () => {
  // <> is a react thing to allow multiple elements to be here
  return (
    <>
      <header className="sticky top-0 z-10 border-b bg-white pt-2">
        <h1 className="mb-2 px-4 text-lg font-bold">home</h1>
      </header>
      <NextTweetForm />
      <RecentTweets />
    </>
  );
};

function RecentTweets() {
  // infiniteFeed.useInfiniteQuery calls .query in tweets page
  const tweets = api.tweet.infiniteFeed.useInfiniteQuery( // fetches 10 tweets AT A TIME x forever (forever scroll)
    // infinitely query takes in 2 parameters
    {}, // input for query (we defined to require 2 optional things - limit and cursor) but since we don't have any input
    { getNextPageParam: (lastPage) => lastPage.nextCursor }
  ); // options object: gets the nextcursor so we can make the next query

  return (
    <InfiniteTweetList
      tweets={tweets.data?.pages.flatMap((page) => page.tweets)} // convert all pages of tweets into 1 long list of tweets
      isError={tweets.isError} // automatically set when loading the tweets
      isLoading={tweets.isLoading} // automatically set when loading the tweets
      hasMore={tweets.hasNextPage} // ye makes sense
      fetchNewTweets={tweets.fetchNextPage} // gives next page of tweets starting at the next cursor 
    />
  );
}

export default Home;
