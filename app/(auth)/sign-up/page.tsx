import Link from "next/link";
import { SignUpForm } from "@/components/forms/SignUpForm";

export default function SignUpPage() {
  return (
    <div className="w-full max-w-md rounded-xl bg-white p-8 shadow-lg">
      <div className="mb-6 text-center">
        <h1 className="text-2xl font-semibold text-slate-900">
          Create your account
        </h1>
        <p className="mt-2 text-sm text-slate-600">
          Start building momentum toward your 2025 goals.
        </p>
      </div>
      <SignUpForm />
      <p className="mt-6 text-center text-sm text-slate-600">
        Already have an account?{" "}
        <Link href="/sign-in" className="font-medium text-slate-900">
          Sign in instead
        </Link>
      </p>
    </div>
  );
}
