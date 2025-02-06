import { UserPostsResponse } from "@/types";
import UserPost from "@/components/user-post";

interface PostListProps {
  posts: UserPostsResponse[] | [];
  likedPosts: UserPostsResponse[] | [];
}

export default function UserPostList({ posts, likedPosts }: PostListProps) {
  return (
    <div className="columns-2 md:columns-3 gap-4 max-w-4xl mx-auto">
      {posts.map((post) => (
        <div key={post.postId} className="mb-4 break-inside-avoid">
          <UserPost post={post} likedPosts={likedPosts} />
        </div>
      ))}
    </div>
  );
}
