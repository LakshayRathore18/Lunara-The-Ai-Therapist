"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";

// className is optional, allowing for custom styling when needed 
interface SignInButtonProps {
  className?: string;
}

// SignInButton component that uses the Button component from the UI library
export function SignInButton({ className }: SignInButtonProps) {
  return (
    // Using Button as a wrapper for the Link component
    // asChild prop allows the Link to be styled as a button
    <Button asChild className={className}>
      <Link href="/login">Sign In</Link>
    </Button>
  );
}