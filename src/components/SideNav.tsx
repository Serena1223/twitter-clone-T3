import { signIn, signOut, useSession } from "next-auth/react";
import Link from "next/link";

export function SideNav() {
  const session = useSession(); // check current session data with user - get their information
  const user = session.data?.user; // depends on ur logged in

  return (
    <nav className="sticky top-0 px-2 py-4">
      <ul className="flex flex-col items-start gap-2 whitespace-nowrap">
        <li>
          <Link href="/">Home</Link>
        </li>
        {user != null && (
          <li>
            <Link href={`/profiles/${user.id}`}>Profile</Link>
          </li>
        )}
        {user == null ? (
            <li>
                <button onClick={() => void signIn()}>Sign In</button>
            </li>
        ) : (
            <li>
                <button onClick={() => void signOut()}>Sign Out</button>
            </li>
        )}
      </ul>
    </nav>
  );
}
