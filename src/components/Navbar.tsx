"use client";

import NavDiv from "@/styled-components/NavDiv";
import {
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
  useUser,
} from "@clerk/nextjs";
import Link from "next/link";

const PROTECTED_NAVBAR_OPTIONS = [
  {
    title: "Groups",
    href: "/groups",
  },
  {
    title: "Calendar",
    href: "/calendar",
  },
];

export default function Navbar() {
  const user = useUser();
  const renderedRoutes = user.isSignedIn ? PROTECTED_NAVBAR_OPTIONS : [];
  return (
    <header className="shadow w-[13%] h-screen flex flex-col items-center">
      <SignedOut>
        <NavDiv>
          <SignInButton />
        </NavDiv>
        <NavDiv>
          <SignUpButton />
        </NavDiv>
      </SignedOut>
      <SignedIn>
        <NavDiv>
          <UserButton />{" "}
          <div className="pl-1">{user.isLoaded && user.user?.username}</div>
        </NavDiv>
      </SignedIn>
      <SignedIn>
        {renderedRoutes.map((option) => (
          <Link href={option.href} key={option.title} className="w-full">
            <NavDiv>{option.title}</NavDiv>
          </Link>
        ))}
      </SignedIn>
    </header>
  );
}
