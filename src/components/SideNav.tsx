import { signIn, signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { VscAccount, VscHome, VscSignIn, VscSignOut } from "react-icons/vsc";

export function SideNav() {
  const session = useSession(); // check current session data with user - get their information
  const user = session.data?.user; // depends on ur logged in

  return (
    <nav className="sticky top-0 px-2 py-4">
      <ul className="flex flex-col items-start gap-2 whitespace-nowrap">
        <li>
          <Link href="/">
          <span className="flex items-center gap-4">
            <VscHome className="h-8 w-8"/>
            <span className="hidden text-lg md:inline">Home</span>
          </span>
          </Link>
        </li>
        {user != null && (
          <li>
            <Link href={`/profiles/${user.id}`}>
            <span className="flex items-center gap-4">
            <VscAccount className="h-8 w-8"/>
            <span className="hidden text-lg md:inline">Profile</span>
            </span>
            </Link>
          </li>
        )}
        {user == null ? (
            <li>
                <button onClick={() => void signIn()}>
                  <span className="flex items-center gap-4">
                  <VscSignIn className="h-8 w-8 fill-green-700" />
                  <span className="hidden text-lg md:inline text-green-700">Log In</span>
                  </span>
                </button>
            </li>
        ) : (
            <li>
                <button onClick={() => void signOut()}>
                  <span className="flex items-center gap-4">
                  <VscSignOut className="h-8 w-8  fill-red-500"/>
                  <span className="hidden text-lg md:inline text-red-500">Log Out</span>
                  </span>
                </button>
            </li>
        )}
      </ul>
    </nav>
  );
}
