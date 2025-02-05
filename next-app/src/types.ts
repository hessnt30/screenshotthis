import { Timestamp } from "firebase/firestore";

export interface UserPostsResponse {
  postId: string;
  challengeId: string;
  createdAt: Timestamp | null;
  imageUrl: string;
  likes: number;
  userId: string;
  username: string;
  caption?: string;
}

export interface NewPost {
  challengeId: string;
  createdAt: Timestamp | null;
  imageUrl: string;
  likes: number;
  userId: string;
  username: string | undefined;
  caption?: string;
}
