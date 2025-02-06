import { CldImage } from "next-cloudinary";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { UserPostsResponse } from "@/types";
import { Heart, Trash2 } from "lucide-react"; // Import trash icon
import { useEffect, useState } from "react";
import { likePost, unlikePost } from "@/firebase/api/user-post-actions";
import { useAuth } from "@/context/auth-context";
import { deletePost } from "@/firebase/api/user-post-actions"; // Assuming you have the deletePost function
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "./ui/alert-dialog";

interface PostProps {
  post: UserPostsResponse;
  likedPosts: UserPostsResponse[] | [];
}

export default function UserPost({ post, likedPosts }: PostProps) {
  const { user } = useAuth();
  const [isLikedByUser, setIsLikedByUser] = useState<boolean>(false);
  const [likes, setLikes] = useState<number>(post.likes);
  const [showDeleteButton, setShowDeleteButton] = useState<boolean>(false);

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

  const handleDeleteClicked = async (postId: string) => {
    await deletePost(postId);
  };

  return (
    <div
      className="relative w-full bg-muted-foreground overflow-hidden"
      onMouseEnter={() => setShowDeleteButton(true)}
      onMouseLeave={() => setShowDeleteButton(false)}
    >
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

      {/* Delete button (trash can) */}
      {showDeleteButton && (
        <AlertDialog>
          <AlertDialogTrigger>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 p-3 bg-black/60 text-white rounded-full hover:bg-red-500 cursor-pointer">
              <Trash2 size={24} />
            </div>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete your
                post.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={() => handleDeleteClicked(post.postId)}
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </div>
  );
}
