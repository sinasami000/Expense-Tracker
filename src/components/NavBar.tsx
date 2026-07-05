"use client";

import Image from "next/image";
import { Button } from "./ui/button";
import { UserButton, useUser } from "@clerk/nextjs";
import Link from "next/link";

function NavBar() {
  // const { data: session } = useSession();
  const { isSignedIn } = useUser();
  return (
    <div className="flex bg-white w-full p-6 items-center justify-between border shadow-sm">
      <Image src={"/logo.png"} width={160} height={100} alt="logo" />
      {isSignedIn ? (
        <UserButton />
      ) : (
        <Button className="bg-black text-white" size={"lg"}><Link href={"/sign-in"}>Get Started</Link></Button>
      )}
    </div>
  );
}

export default NavBar;
