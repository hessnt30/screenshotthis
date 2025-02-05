"use server";

// Create a reference to the cities collection
import { adminDb } from "@/firebase/firebaseAdmin";
import { UserPostsResponse, NewPost } from "@/types";
import { Timestamp } from "firebase/firestore";

const postsRef = adminDb.collection("posts");

// Get all of a user's posts
export const getUserPosts = async (uid: string) => {
  try {
    const querySnapshot = await postsRef.where("userId", "==", uid).get();

    const posts: UserPostsResponse[] = querySnapshot.docs.map((doc) => {
      const data = doc.data();

      // Convert Firestore Timestamp to Date object
      const createdAt =
        data.createdAt instanceof Timestamp ? data.createdAt.toDate() : null;

      return {
        postId: doc.id,
        ...data,
        createdAt,
      } as UserPostsResponse;
    });

    return posts;
  } catch (error) {
    console.error("Error fetching user posts:", error);
    return []; // Return empty array in case of failure
  }
};

// Create a new post
export const createPost = async (newPost: NewPost) => {
  try {
    // Ensure the newPost object has the necessary fields
    if (!newPost.userId || !newPost.imageUrl || !newPost.caption) {
      throw new Error("Missing required post fields.");
    }

    // Add timestamp (optional)
    const postWithTimestamp = {
      ...newPost,
    };

    // Add the post to Firestore
    const docRef = await postsRef.add(postWithTimestamp);

    return { success: true, postId: docRef.id };
  } catch (error) {
    console.error("Error creating post:", error);
    return { success: false, error: error };
  }
};

// Get all posts
export const getAllPosts = async (uid: string) => {
  try {
    const querySnapshot = await postsRef.get();

    const posts: UserPostsResponse[] = querySnapshot.docs.map((doc) => {
      const data = doc.data();

      // Convert Firestore Timestamp to Date object
      const createdAt =
        data.createdAt instanceof Timestamp ? data.createdAt.toDate() : null;

      return {
        postId: doc.id,
        ...data,
        createdAt,
      } as UserPostsResponse;
    });

    return posts;
  } catch (error) {
    console.error("Error fetching user posts:", error);
    return []; // Return empty array in case of failure
  }
};
