'use client'
import { useIsMobile } from "@/app/lib/hooks/use-is-mobile";
import { Zap } from "lucide-react";
import Link from "next/link";

export const Logo = () => {
  const isMobile = useIsMobile();
  return (
    <Link href="/">
      <div className={`flex items-center gap-2 ${isMobile ? "mr-11" : ""}`}>
        <div className="">
          <Zap className="w-6 h-6 text-indigo-400" />
        </div>
        <span className="text-xl font-bold bg-gradient-to-r from-indigo-400 to-indigo-600 bg-clip-text text-transparent">
          KeyBoom
        </span>
      </div>
    </Link>
  );
};
