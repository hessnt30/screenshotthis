"use client";
import Post from "@/components/post";
import PostList from "@/components/post-list";
import { useAuth } from "@/context/auth-context";
import { getAllPosts, getUserPosts } from "@/firebase/api/user-post-actions";
import { useEffect, useState } from "react";
import { UserPostsResponse } from "@/types";

// By default, the CldImage component applies auto-format and auto-quality to all delivery URLs for optimized delivery.
export default function Page() {
  const { user } = useAuth();
  const [posts, setPosts] = useState<UserPostsResponse[] | []>([]);

  useEffect(() => {
    if (!user) return;

    const fetchPosts = async () => {
      const postResults = await getAllPosts(user.uid);
      console.log(posts);

      setPosts(postResults);
    };

    fetchPosts();
  }, [user]);

  return <PostList posts={posts} />;
}
