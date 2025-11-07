"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useMemo, useState } from "react";

import { signOut } from "@/lib/auth";

import { Button } from "./Button";

export function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const [isLoading, setIsLoading] = useState(false);

  const isAuthRoute = useMemo(() => {
    if (!pathname) return false;
    return pathname.startsWith("/sign-in") || pathname.startsWith("/sign-up");
  }, [pathname]);

  const handleSignOut = async () => {
    try {
      setIsLoading(true);
      await signOut();
      router.push("/sign-in");
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <header className="border-b border-slate-200 bg-white">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
        <Link href="/" className="text-lg font-semibold text-slate-900">
          KeepUp
        </Link>
        {isAuthRoute ? null : (
          <nav className="flex items-center gap-4 text-sm font-medium text-slate-600">
            <Link href="/dashboard" className="hover:text-slate-900">
              Dashboard
            </Link>
            <Link href="/sign-in" className="hover:text-slate-900">
              Sign in
            </Link>
            <Button
              variant="secondary"
              onClick={handleSignOut}
              isLoading={isLoading}
              loadingText="Signing out..."
            >
              Sign out
            </Button>
          </nav>
        )}
      </div>
    </header>
  );
}
