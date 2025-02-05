import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Login from "@/components/google-login";

function LoginPage() {
  return (
    <div className="flex min-h-screen justify-center items-center w-full p-6">
      <Card>
        <CardHeader>
          <CardTitle>Sign In to ScreenshotThis</CardTitle>
        </CardHeader>
        <CardContent className="max-w-md">
          ScreenshotThis requires you to sign in to save your information
          regarding your posts and likes.
        </CardContent>
        <CardFooter className="flex justify-end">
          <Login />
        </CardFooter>
      </Card>
    </div>
  );
}

export default LoginPage;
