import { UserPostsResponse } from "@/types";
import { CldImage } from "next-cloudinary";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Heart } from "lucide-react";
import Post from "./post";

interface PostListProps {
  posts: UserPostsResponse[] | [];
}

export default function PostList({ posts }: PostListProps) {
  return (
    <div className="flex flex-wrap gap-4 justify-center max-w-3xl mx-auto">
      {posts.map((post) => (
        <Post key={post.postId} post={post} />
      ))}
    </div>
  );
}
