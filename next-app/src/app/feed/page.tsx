"use client";
import Post from "@/components/post";
import PostList from "@/components/post-list";
import { useAuth } from "@/context/auth-context";
import {
  getAllPosts,
  getLikedPosts,
  getUserPosts,
} from "@/firebase/api/user-post-actions";
import { useEffect, useState } from "react";
import { UserPostsResponse } from "@/types";
import { useLoading } from "@/context/loading-context";

// By default, the CldImage component applies auto-format and auto-quality to all delivery URLs for optimized delivery.
export default function Page() {
  const { user } = useAuth();
  const { setIsLoading } = useLoading();
  const [posts, setPosts] = useState<UserPostsResponse[] | []>([]);
  const [likedPosts, setLikedPosts] = useState<UserPostsResponse[] | []>([]);

  useEffect(() => {
    if (!user) return;

    const fetchPosts = async () => {
      setIsLoading(true);

      const postResults = await getAllPosts();
      const likedPostResults = await getLikedPosts(user.uid);
      console.log(posts);

      setPosts(postResults);
      setLikedPosts(likedPostResults);

      setIsLoading(false);
    };

    fetchPosts();
  }, [user]);

  return <PostList posts={posts} likedPosts={likedPosts} />;
}
