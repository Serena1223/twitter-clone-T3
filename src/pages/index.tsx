import { type NextPage } from "next";
import { signIn, signOut, useSession } from "next-auth/react";
import { NextTweetForm } from "~/components/NewTweetForm";

const Home: NextPage = () => {
  // <> is a react thing to allow multiple elements to be here
  return <>
  <header className="sticky top-0 z-10 border-b bg-white pt-2">
    <h1 className="mb-2 px-4 text-lg font-bold">home</h1>
  </header>
  <NextTweetForm/>
  </>;
};

export default Home;