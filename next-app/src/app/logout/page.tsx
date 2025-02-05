"use client";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CatIcon } from "lucide-react";
import { useAuth } from "@/context/auth-context";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

function LogoutPage() {
  const { logOut, user } = useAuth(); // Get the user and logIn from the context
  const router = useRouter(); // Initialize the router

  useEffect(() => {
    // Redirect to "/" when a user is logged out
    if (!user) {
      router.push("/");
    }
  }, [user, router]); // Run the effect when `user` or `router` changes

  return (
    <div className="flex min-h-screen bg-background justify-center items-center w-full p-6">
      <Card>
        <CardHeader className="text-white">
          <CardTitle>Logout of ScreenshotThis</CardTitle>
        </CardHeader>
        <CardContent className="max-w-md">
          You will need to sign back in to see your posts and likes.
        </CardContent>
        <CardFooter className="flex justify-end">
          <Button size={"lg"} onClick={logOut}>
            <CatIcon />
            Logout
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}

export default LogoutPage;
