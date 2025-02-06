"use client";
import UserPostList from "@/components/user-post-list";
import { useAuth } from "@/context/auth-context";
import {
  getLikedPosts,
  getNumLikedPostsForUser,
  getUserPosts,
} from "@/firebase/api/user-post-actions";
import { useEffect, useState } from "react";
import { UserPostsResponse } from "@/types";
import { useLoading } from "@/context/loading-context";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardHeader } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

// By default, the CldImage component applies auto-format and auto-quality to all delivery URLs for optimized delivery.
export default function Profile() {
  const { user } = useAuth();
  const { setIsLoading } = useLoading();
  const [posts, setPosts] = useState<UserPostsResponse[] | []>([]);
  const [likedPosts, setLikedPosts] = useState<UserPostsResponse[] | []>([]);
  const [totalLikes, setTotalLikes] = useState<number>(0);

  useEffect(() => {
    if (!user) return;

    const fetchPosts = async () => {
      setIsLoading(true);

      const userPostResults = await getUserPosts(user.uid);
      const postResults = await getLikedPosts(user.uid);
      const totalLikesResults = await getNumLikedPostsForUser(user.uid);
      console.log(posts);

      setPosts(userPostResults);
      setLikedPosts(postResults);
      setTotalLikes(totalLikesResults);
      setIsLoading(false);
    };

    fetchPosts();
  }, [user]);

  return (
    <div className="flex flex-col">
      <Card className="p-2 mb-8">
        <CardHeader className="flex flex-row gap-2 items-center">
          <Avatar className="h-12 w-12">
            {user?.photoURL && <AvatarImage src={user?.photoURL} />}
            <AvatarFallback className="rounded-lg">
              {user?.displayName
                ? user.displayName.slice(0).toUpperCase()
                : "NA"}
            </AvatarFallback>
          </Avatar>
          <div className="grid flex-1 text-left text-sm leading-tight">
            <span className="truncate font-semibold text-lg">
              {user?.displayName}
            </span>
            <span className="truncate">{user?.email}</span>
          </div>

          <div className="flex gap-6">
            <div className="flex flex-col items-center">
              <Label>Posts</Label>
              <p>{posts.length}</p>
            </div>
            <div className="flex flex-col items-center">
              <Label>Likes</Label>
              <p>{totalLikes}</p>
            </div>
          </div>
        </CardHeader>
      </Card>

      <UserPostList posts={posts} likedPosts={likedPosts} />
    </div>
  );
}
