import { useIsMobile } from "@/app/lib/hooks/use-is-mobile";
import Link from "next/link";

export const Logo = ({ className = "w-8 h-8" }) => {
  const isMobile = useIsMobile();
  return (
    <Link href="/">
      <div className={`flex items-center gap-2 ${isMobile ? "mr-11" : ""}`}>
        <div className="p-1.5">
          <svg
            className={className}
            viewBox="0 0 64 64"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle
              cx="32"
              cy="32"
              r="30"
              className="fill-gray-900 stroke-gray-800"
              strokeWidth="2"
            />

            <path
              d="M20 16V48"
              stroke="url(#grad)"
              strokeWidth="4"
              strokeLinecap="round"
            />
            <path
              d="M20 32L40 16"
              stroke="url(#grad)"
              strokeWidth="4"
              strokeLinecap="round"
            />
            <path
              d="M20 32L42 48"
              stroke="url(#grad)"
              strokeWidth="4"
              strokeLinecap="round"
            />

            <path
              d="M14 34 C22 28, 30 40, 38 30 C44 24, 50 28, 56 26"
              stroke="#6366f1"
              strokeWidth="2.5"
              strokeLinecap="round"
              opacity="0.9"
            />

            <defs>
              <linearGradient id="grad" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#6366f1" />
                <stop offset="100%" stopColor="#a78bfa" />
              </linearGradient>
            </defs>
          </svg>
        </div>
        <span className="text-xl font-bold bg-gradient-to-r from-indigo-400 to-indigo-600 bg-clip-text text-transparent">
          KeyBoom
        </span>
      </div>
    </Link>
  );
};
