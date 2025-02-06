"use server";

import { adminDb } from "@/firebase/firebaseAdmin";
import admin from "firebase-admin";
import { UserPostsResponse, NewPost } from "@/types";
import { serverTimestamp, Timestamp } from "firebase/firestore";

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
    if (!newPost.userId || !newPost.imageUrl) {
      throw new Error("Missing required post fields.");
    }

    // Add timestamp (optional)
    const postWithTimestamp = {
      ...newPost,
      createdAt: Timestamp.now().toDate().toLocaleTimeString("en-US"),
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

// Like a post
export const likePost = async (postId: string, userId: string) => {
  try {
    const postRef = adminDb.collection("posts").doc(postId);
    const likesRef = postRef.collection("likes");

    // Add a new like document for this user
    await likesRef.add({
      userId: userId,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    await postRef.update({
      likes: admin.firestore.FieldValue.increment(1),
    });

    console.log("Post liked successfully.");
  } catch (error) {
    console.error("Error liking post:", error);
  }
};

// Unlike a post
export const unlikePost = async (postId: string, userId: string) => {
  try {
    const postRef = adminDb.collection("posts").doc(postId);
    const likesRef = postRef.collection("likes");

    // Find the like document for this user
    const userLikeQuerySnapshot = await likesRef
      .where("userId", "==", userId)
      .limit(1) // Limit to 1 as a user can only like a post once
      .get();

    // Check if the like document exists
    if (userLikeQuerySnapshot.empty) {
      console.log("User has not liked this post.");
      return;
    }

    // Get the like document ID
    const likeDocId = userLikeQuerySnapshot.docs[0].id;

    // Delete the like document
    await likesRef.doc(likeDocId).delete();

    // Decrement the likes field in the post document
    await postRef.update({
      likes: admin.firestore.FieldValue.increment(-1),
    });

    console.log("Post unliked successfully.");
  } catch (error) {
    console.error("Error unliking post:", error);
  }
};

// Get all posts liked by a user
export const getLikedPosts = async (uid: string) => {
  try {
    const querySnapshot = await postsRef.get();

    // Filter posts liked by the user
    const likedPosts = await Promise.all(
      querySnapshot.docs.map(async (doc) => {
        const postId = doc.id;
        const likesRef = doc.ref.collection("likes");
        const likesSnapshot = await likesRef.where("userId", "==", uid).get();

        if (!likesSnapshot.empty) {
          // Convert post data into your UserPostsResponse format
          const data = doc.data();
          const createdAt =
            data.createdAt instanceof Timestamp
              ? data.createdAt.toDate()
              : null;

          return {
            postId: doc.id,
            ...data,
            createdAt,
          } as UserPostsResponse;
        }

        return null;
      })
    );

    // Filter out null values (posts that weren't liked by the user)
    return likedPosts.filter((post) => post !== null);
  } catch (error) {
    console.error("Error fetching liked posts:", error);
    return []; // Return empty array in case of failure
  }
};
