import { CldImage } from "next-cloudinary";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { UserPostsResponse } from "@/types";
import { Heart } from "lucide-react";
import { useEffect, useState } from "react";
import { likePost, unlikePost } from "@/firebase/api/user-post-actions";
import { useAuth } from "@/context/auth-context";

interface PostProps {
  post: UserPostsResponse;
  likedPosts: UserPostsResponse[] | [];
}

export default function Post({ post, likedPosts }: PostProps) {
  const { user } = useAuth();
  const [isLikedByUser, setIsLikedByUser] = useState<boolean>(false);
  const [likes, setLikes] = useState<number>(post.likes);

  useEffect(() => {
    if (likedPosts.some((likedPost) => likedPost.postId === post.postId)) {
      setIsLikedByUser(true);
    }
  }, [likedPosts, post.postId]);

  const handleLikeClicked = async (postId: string) => {
    if (!user) return;
    setIsLikedByUser(true);
    setLikes((prev) => prev + 1);

    await likePost(postId, user.uid);
  };

  const handleUnlikeClicked = async (postId: string) => {
    if (!user) return;
    setIsLikedByUser(false);
    setLikes((prev) => prev - 1);

    await unlikePost(postId, user.uid);
  };

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
          {isLikedByUser ? (
            <Heart
              fill="red"
              color="red"
              onClick={() => {
                handleUnlikeClicked(post.postId);
              }}
              className="hover:cursor-pointer"
            />
          ) : (
            <Heart
              onClick={() => {
                handleLikeClicked(post.postId);
              }}
              className="hover:cursor-pointer"
            />
          )}
          <span className="ml-1">{likes > 0 ? likes : ""}</span>
        </div>
      </div>

      {/* Footer */}
      <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/60 to-transparent p-3 text-white z-10">
        <span>{post.caption}</span>
      </div>
    </div>
  );
}
