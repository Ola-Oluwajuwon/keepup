import Link from "next/link";
import { SignInForm } from "@/components/forms/SignInForm";

export default function SignInPage() {
  return (
    <div className="w-full max-w-md rounded-xl bg-white p-8 shadow-lg">
      <div className="mb-6 text-center">
        <h1 className="text-2xl font-semibold text-slate-900">Welcome back</h1>
        <p className="mt-2 text-sm text-slate-600">
          Sign in to pick up where you left off.
        </p>
      </div>
      <SignInForm />
      <p className="mt-6 text-center text-sm text-slate-600">
        New to KeepUp?{" "}
        <Link href="/auth/sign-up" className="font-medium text-slate-900">
          Create an account
        </Link>
      </p>
    </div>
  );
}
