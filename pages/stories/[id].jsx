import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import { ArrowLeft, Send } from "lucide-react";
import Link from "next/link";

export async function getStaticPaths() {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "story-craft-coral.vercel.app";
  const response = await fetch(`${apiUrl}/api/stories`);
  const stories = await response.json();

  // Generate paths for all stories
  const paths = stories.map((story) => ({
    params: { id: story.id.toString() },
  }));

  return {
    paths,
    fallback: "blocking", // Generate pages on-demand if not found
  };
}

export async function getStaticProps({ params }) {
  // Fetch the story data for the given ID
  const response = await fetch(`${apiUrl}/api/stories/${params.id}`);
  const story = await response.json();

  if (!story) {
    return {
      notFound: true, // Return a 404 page if the story doesn't exist
    };
  }

  return {
    props: {
      story,
    },
    revalidate: 60, // Revalidate the page every 60 seconds
  };
}

export default function StoryDetail({ story }) {
  const { data: session } = useSession();
  const router = useRouter();
  const [newComment, setNewComment] = useState("");

  const handleComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
      const response = await fetch(`/api/stories/${story.id}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: newComment, userId: session.user.id, username: session.user.name }),
      });

      if (!response.ok) throw new Error("Failed to post comment");

      const comment = await response.json();
      setStory((prev) => ({
        ...prev,
        comments: [...prev.comments, comment],
      }));
      setNewComment("");
      alert("Your comment has been posted!");
    } catch (error) {
      alert("Failed to post comment. Please try again.");
    }
  };

  if (router.isFallback) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-16 h-16 border-4 border-t-blue-500 border-b-blue-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!story) {
    return (
      <div className="container py-8">
        <div className="flex flex-col items-center justify-center p-6 bg-white border rounded-lg shadow-sm">
          <p className="text-lg text-gray-500">Story not found</p>
          <Link href="/dashboard">
            <button className="mt-4 text-blue-500 hover:underline">Return to Dashboard</button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
        <div className="container flex items-center h-16 px-4 mx-auto">
          <Link href="/dashboard">
            <button className="flex items-center gap-2 text-gray-700 hover:text-blue-500">
              <ArrowLeft className="w-4 h-4" />
              Back to Dashboard
            </button>
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="container max-w-3xl px-4 py-8 mx-auto">
        <div className="p-6 bg-white border rounded-lg shadow-sm">
          {/* Story Header */}
          <div className="flex items-center gap-4">
            <img
              src={story.authorImage}
              alt={story.authorName}
              className="w-10 h-10 rounded-full"
            />
            <div>
              <h1 className="text-2xl font-bold">{story.title}</h1>
              <p className="text-sm text-gray-500">
                By {story.authorName} • {new Date(story.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>

          {/* Story Content */}
          <p className="mt-4 text-lg leading-relaxed text-gray-700">{story.content}</p>

          {/* Comments Section */}
          <div className="mt-8">
            <h2 className="mb-4 text-xl font-bold">Comments</h2>
            <form onSubmit={handleComment} className="flex gap-2 mb-6">
              <textarea
                placeholder="Add a comment..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows="3"
              />
              <button
                type="submit"
                className="flex items-center justify-center w-10 h-10 text-white bg-blue-500 rounded-lg hover:bg-blue-600"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>

            <div className="space-y-4">
              {story.comments?.length === 0 ? (
                <p className="text-center text-gray-500">No comments yet. Be the first to comment!</p>
              ) : (
                story.comments?.map((comment) => (
                  <div key={comment.id} className="flex gap-4 p-4 border rounded-lg">
                    <img
                      src={comment.authorImage || "/default-user.png"}
                      alt={comment.authorName}
                      className="w-8 h-8 rounded-full"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-semibold">{comment.authorName}</p>
                        <span className="text-sm text-gray-500">
                          {new Date(comment.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="mt-1 text-gray-700">{comment.content}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}