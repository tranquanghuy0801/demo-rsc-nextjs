import { Params } from "next/dist/shared/lib/router/utils/route-matcher";
import { Suspense } from "react";

async function fetchBlogPost(id: string) {
  const res = await fetch("https://jsonplaceholder.typicode.com/posts");

  if (!res.ok) {
    throw new Error("Error occurred when fetching posts");
  }
  const posts = await res.json();

  for (let post of posts) {
    if (post.id == id) {
      return post;
    }
  }
}

async function fetchComments(id: string) {
  const res = await fetch("https://jsonplaceholder.typicode.com/comments");

  if (!res.ok) {
    throw new Error("Error occurred when fetching comments");
  }
  return res.json();
}

export async function BlogPost({ promise }: { promise: Promise<Params> }) {
  const post = await promise;

  return (
    <>
      <h1 className="text-2xl font-bold text-center">{post.title}</h1>
      <p className="text-lg">{post.body}</p>
    </>
  );
}

export async function Comments({ promise }: { promise: Promise<Params> }) {
  const comments = await promise;
  return (
    <>
      <ul>
        {comments.map((item: any) => (
          <li key={item.id}>
            <h3>{item.name}</h3>
            <p>{item.email}</p>
            <p>{item.body}</p>
          </li>
        ))}
      </ul>
    </>
  );
}

export default async function Post({ params }: Params): Promise<JSX.Element> {
  const postPromise = fetchBlogPost(params.slug);
  const commentsPromise = fetchComments(params.slug);

  return (
    <div className="flex flex-col max-w-7xl p-10 space-y-10">
      <BlogPost promise={postPromise} />
      <h2 className="text-xl">Comments</h2>
      <Suspense fallback={<div>Loading Comments..</div>}>
        <Comments promise={commentsPromise} />
      </Suspense>
      <div></div>
    </div>
  );
}
