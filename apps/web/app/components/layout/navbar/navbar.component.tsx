"use client";
import { useState } from "react";
import { Menu, X, Zap } from "lucide-react";
import { Button } from "../../ui";
import { navLinks } from "./navbar.constant";
import { useRouter } from "next/navigation";

export const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);

  const { push } = useRouter();

  const handleRedirect = (path: string) => {
    push(path);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-gray-900/80 backdrop-blur-md border-b border-gray-800">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => handleRedirect("/")}
          >
            <div className="p-1.5 bg-indigo-500/10 rounded-lg">
              <Zap className="w-5 h-5 text-indigo-400" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-indigo-400 to-indigo-600 bg-clip-text text-transparent">
              KeyBoom
            </span>
          </div>

          <div className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="text-gray-300 hover:text-white transition-colors text-sm"
              >
                {link.name}
              </a>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleRedirect("/login")}
            >
              ورود
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={() => handleRedirect("/register")}
            >
              شروع رایگان
            </Button>
          </div>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-gray-300"
            aria-label="منو"
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden mt-4 pt-4 border-t border-gray-800 flex flex-col gap-3">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="text-gray-300 hover:text-white py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                {link.name}
              </a>
            ))}
            <div className="flex gap-3 pt-2">
              <Button
                variant="outline"
                size="sm"
                className="flex-1"
                onClick={() => handleRedirect("/login")}
              >
                ورود
              </Button>
              <Button variant="primary" size="sm" className="flex-1">
                شروع
              </Button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};
