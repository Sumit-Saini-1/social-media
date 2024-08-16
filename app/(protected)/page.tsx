"use client";
import Post, { IPost } from "@/components/post";
import { useContext, useEffect, useState } from "react";
import { getSession } from "next-auth/react";
import UserContext from "@/context/user/userContext";

/**
 * Renders the Home component which displays the Instagram homepage.
 *
 * @return {JSX.Element} The Home component.
 */
export default function Home(): JSX.Element {
  const [posts, setPosts] = useState<IPost[]>([]);

  function revomePost(id: string) {
    setPosts(posts.filter(post => post.postId !== id));
  }
  useEffect(() => {
    fetch("/api/posts").then(res => res.json()).then(json => { setPosts(json) });
  }, [])
  return (
    <div className="sm:w-full pt-2 flex flex-col gap-2 items-center h-full overflow-y-scroll ">

      {
        posts.map((post) => (
          <Post key={post.postId}
            postId={post.postId}
            username={post.username}
            profile={post.profile}
            image={post.image}
            likes={post.likes}
            comments={post.comments}
            time={post.time}
            caption={post.caption}
            removePost={revomePost}
            likedBy={post.likedBy}
          />
        ))
      }
    </div>
  );
}
