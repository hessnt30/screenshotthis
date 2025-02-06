"use client";
import PostList from "@/components/post-list";
import { useAuth } from "@/context/auth-context";
import { getLikedPosts } from "@/firebase/api/user-post-actions";
import { useEffect, useState } from "react";
import { UserPostsResponse } from "@/types";
import { useLoading } from "@/context/loading-context";

// By default, the CldImage component applies auto-format and auto-quality to all delivery URLs for optimized delivery.
export default function LikedPosts() {
  const { user } = useAuth();
  const { setIsLoading } = useLoading();
  const [posts, setPosts] = useState<UserPostsResponse[] | []>([]);

  useEffect(() => {
    if (!user) return;

    const fetchPosts = async () => {
      setIsLoading(true);

      const postResults = await getLikedPosts(user.uid);
      console.log(posts);

      setPosts(postResults);
      setIsLoading(false);
    };

    fetchPosts();
  }, [user]);

  return <PostList posts={posts} likedPosts={posts} />;
}
