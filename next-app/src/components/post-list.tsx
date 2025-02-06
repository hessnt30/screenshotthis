import { UserPostsResponse } from "@/types";
import Post from "./post";

interface PostListProps {
  posts: UserPostsResponse[] | [];
  likedPosts: UserPostsResponse[] | [];
}

export default function PostList({ posts, likedPosts }: PostListProps) {
  return (
    <div className="columns-2 md:columns-3 gap-4 max-w-4xl mx-auto">
      {posts.map((post) => (
        <div key={post.postId} className="mb-4 break-inside-avoid">
          <Post post={post} likedPosts={likedPosts} />
        </div>
      ))}
    </div>
  );
}
