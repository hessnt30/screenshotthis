"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation"; // Use the router from Next.js
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/auth-context";
import { CatIcon } from "lucide-react";

function Login() {
  const { logIn, user } = useAuth(); // Get the user and logIn from the context
  const router = useRouter(); // Initialize the router

  useEffect(() => {
    // Redirect to "/servers" when a user is logged in
    if (user) {
      router.push("/");
    }
  }, [user, router]); // Run the effect when `user` or `router` changes

  return (
    <Button size={"lg"} onClick={logIn}>
      <CatIcon />
      Sign in with Google
    </Button>
  );
}

export default Login;
