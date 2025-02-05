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
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
      {posts.map((post) => (
        <Post key={post.postId} post={post} />
      ))}
    </div>
  );
}
