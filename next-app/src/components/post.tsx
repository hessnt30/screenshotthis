import { CldImage } from "next-cloudinary";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { UserPostsResponse } from "@/types";
import { Heart } from "lucide-react";

interface PostProps {
  post: UserPostsResponse;
}

export default function Post({ post }: PostProps) {
  return (
    <div className={`relative w-full bg-muted-foreground overflow-hidden`}>
      {/* Image */}
      <CldImage
        src={post.imageUrl}
        alt="Preview"
        width={post.width > 1000 ? post.width * 0.3 : post.width}
        height={post.height > 1000 ? post.height * 0.3 : post.height}
      />

      {/* Header */}
      <div className="absolute top-0 left-0 w-full bg-gradient-to-b from-black/60 to-transparent p-1 flex justify-between text-white z-10">
        <div className="flex flex-row items-center">
          <Avatar>
            <AvatarImage
              src={`https://lh3.googleusercontent.com/a/${post.userId}s96-c`}
            />
            <AvatarFallback className="text-foreground">
              {post.username.slice(0, 1).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <span className="ml-1">{post.username}</span>
        </div>
        <div className="flex flex-row items-center">
          <Heart />
          <span className="ml-1">{post.likes > 0 ? post.likes : ""}</span>
        </div>
      </div>

      {/* Footer */}
      <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/60 to-transparent p-3 text-white z-10">
        <span>{post.caption}</span>
      </div>
    </div>
  );
}
