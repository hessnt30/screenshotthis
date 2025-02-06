"use server";

import { adminDb } from "@/firebase/firebaseAdmin";
import admin from "firebase-admin";
import { UserPostsResponse, NewPost } from "@/types";
import axios from "axios";
import crypto from "crypto";
import { serverTimestamp, Timestamp } from "firebase/firestore";

const postsRef = adminDb.collection("posts"); // reference to "posts" collection

/**
 * Get all of a given user's posts
 *
 * @param uid user id of desired user to get all posts for
 * @returns array of UserPostsResponses or empty
 */
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

/**
 * Add a new post to the database with the given newPost data
 *
 * @param newPost object with all new post info
 * @returns message of success or failure
 */
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

/**
 * Delete the given post, call methods to delete image
 * from cloudinary
 *
 * @param postId the post to delete
 * @returns message of success or failure
 */
export const deletePost = async (postId: string) => {
  try {
    // Get the post document
    const postRef = postsRef.doc(postId);
    const docSnapshot = await postRef.get();

    if (!docSnapshot.exists) {
      throw new Error("Post not found.");
    }

    // Get the imageUrl from the document
    const imageUrl = docSnapshot.data()?.imageUrl;
    if (!imageUrl) {
      throw new Error("Image URL not found in the post.");
    }

    await handleDeleteImage(imageUrl); // call method to delete image on cloudinary

    await postRef.delete(); // delete from firestore

    console.log("Post deleted successfully.");
    return { success: true, imageUrl };
  } catch (error) {
    console.error("Error deleting post:", error);
    return { success: false, error: error };
  }
};

// helper for handleDeleteImage
const generateSHA1 = (data: any) => {
  const hash = crypto.createHash("sha1");
  hash.update(data);
  return hash.digest("hex");
};

// helper for handleDeleteImage
const generateSignature = (publicId: string, apiSecret: string) => {
  const timestamp = new Date().getTime();
  return `public_id=${publicId}&timestamp=${timestamp}${apiSecret}`;
};

/**
 * Delete from cloudinary the image specified by url
 *
 * @param secure_url the url of the image to be deleted
 * @returns void
 */
const handleDeleteImage = async (secure_url: string) => {
  const regex = /\/v\d+\/([^/]+)\.\w{3,4}$/;
  const getPublicIdFromUrl = (url: string) => {
    const match = url.match(regex);
    return match ? match[1] : null;
  };

  const publicId = getPublicIdFromUrl(secure_url);

  if (!publicId) return;

  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  const timestamp = new Date().getTime();
  const apiKey = process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY;
  const apiSecret = process.env.NEXT_PUBLIC_CLOUDINARY_API_SECRET || "";
  const signature = generateSHA1(generateSignature(publicId, apiSecret));
  const url = `https://api.cloudinary.com/v1_1/${cloudName}/image/destroy`;

  try {
    const response = await axios.post(url, {
      public_id: publicId,
      signature: signature,
      api_key: apiKey,
      timestamp: timestamp,
    });

    // console.error(response);
  } catch (error) {
    console.error(error);
  }
};

/**
 * Get ALL posts
 *
 * @todo figure out pagination and on-demand loading for
 *       when there is a lot of posts
 *
 * @returns array of posts, or empty
 */
export const getAllPosts = async () => {
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

/**
 * Add a user to a post's likes and increment like count by one
 *
 * @param postId post to be liked
 * @param userId user doing the liking
 */
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

/**
 * Remove the user from the post's likes and decrement by one
 *
 * @param postId post to be unliked
 * @param userId user doing the unliking
 * @returns void
 */
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

/**
 * Sum the likes across each user's post
 *
 * @param uid user to tally likes of
 * @returns the user's total likes
 */
export const getNumLikedPostsForUser = async (uid: string) => {
  try {
    const querySnapshot = await postsRef
      .where("userId", "==", uid) // Filter by userId
      .get(); // Get all posts for that user

    let totalLikes = 0;

    querySnapshot.docs.forEach((doc) => {
      const data = doc.data();
      totalLikes += data.likes || 0; // Add likes for each post, default to 0 if likes is not present
    });

    return totalLikes; // Return the sum of likes
  } catch (error) {
    console.error("Error fetching user posts:", error);
    return 0; // Return 0 in case of failure
  }
};

/**
 * Get all posts that the given user has liked
 *
 * @param uid user in question
 * @returns array of liked posts, or empty
 */
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
