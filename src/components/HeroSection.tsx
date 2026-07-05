"use client";
import { Button } from "./ui/button";
import Image from "next/image";
import DashboardImage from "../../public/dashboard.png";
import { useUser } from "@clerk/nextjs";
import Link from "next/link";

function HeroSection() {
  const { isSignedIn } = useUser();
  return (
    <div className="w-full bg-[#D7FFAB] flex flex-col gap-20 justify-center items-center">
      <div className="flex flex-col justify-center mt-30 items-center gap-5">
        <h1 className="text-3xl lg:text-4xl text-black font-bold">Manage your expense</h1>
        <h1 className="text-3xl lg:text-4xl text-orange-300 font-bold">
          Control your money
        </h1>
        <p className="text-sm text-gray-500">Start creating money and save ton of money</p>
        {isSignedIn ? (
          <Button className="bg-black text-white" size={"lg"}><Link href={"/dashboard"}>Go to Dashboard</Link></Button>
        ) : (
          <Button className="bg-black text-white" size={"lg"}><Link href={"/sign-in"}>Get Started Now</Link></Button>
        )}
      </div>
      <Image
        src={DashboardImage}
        alt="dashboard"
        height={800}
        className="rounded-xl"
      />
    </div>
  );
}

export default HeroSection;
