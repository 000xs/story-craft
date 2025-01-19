import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ThumbsUp, MessageCircle, Share2, Bookmark, Plus } from "lucide-react";

export default function Dashboard() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [stories, setStories] = useState([]);
    const [newStory, setNewStory] = useState({ title: "", content: "" });
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const fetchStories = async () => {
        try {
            const response = await fetch("/api/stories");
            if (!response.ok) throw new Error("Failed to fetch stories");
            const data = await response.json();
            setStories(data);
        } catch (error) {
            alert("Failed to fetch stories. Please try again later.");
        }
    };

    const handleVote = async (storyId) => {
        try {
            const response = await fetch(`/api/stories/${storyId}/vote`, {
                method: "POST",
            });
            if (!response.ok) throw new Error("Failed to vote");

            const updatedStory = await response.json();
            setStories((prevStories) =>
                prevStories.map((story) =>
                    story.id === storyId ? { ...story, votes: updatedStory.votes } : story
                )
            );

            alert("Your vote has been recorded!");
        } catch (error) {
            alert("Failed to vote. Please try again.");
        }
    };

    const handleCreateStory = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch("/api/stories", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    ...newStory,
                    authorId: session.user.id,
                    authorName: session.user.name,
                    authorImage: session.user.image,
                }),
            });

            if (!response.ok) throw new Error("Failed to create story");

            const createdStory = await response.json();
            setStories((prev) => [createdStory, ...prev]);
            setNewStory({ title: "", content: "" });
            setIsDialogOpen(false);

            alert("Your story has been published!");
        } catch (error) {
            alert("Failed to create story. Please try again.");
        }
    };

    useEffect(() => {
        if (session) {
            fetchStories();
        }
    }, [session]);

    if (status === "loading") {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="w-16 h-16 border-4 border-t-blue-500 border-b-blue-500 rounded-full animate-spin"></div>
            </div>
        );
    }

    if (!session) {
        router.push("/");
        return null;
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
                <div className="container flex items-center justify-between h-16 px-4 mx-auto">
                    <h1 className="text-2xl font-bold">Wall of Stories</h1>
                    <button
                        onClick={() => setIsDialogOpen(true)}
                        className="flex items-center gap-2 px-4 py-2 text-white bg-blue-500 rounded-md hover:bg-blue-600"
                    >
                        <Plus className="w-4 h-4" />
                        Share Your Story
                    </button>
                </div>
            </header>

            {/* Main Content */}
            <main className="container px-4 py-8 mx-auto">
                <div className="overflow-y-auto h-[calc(100vh-8rem)]">
                    <div className="grid gap-6">
                        {stories.length === 0 ? (
                            <div className="flex flex-col items-center justify-center p-6 bg-white border rounded-lg shadow-sm">
                                <p className="text-lg text-gray-500">No stories yet. Be the first to share!</p>
                            </div>
                        ) : (
                            stories.map((story) => (
                                <Link href={`/stories/${story.id} `} key={story.id} className="p-6 bg-white border rounded-lg shadow-sm">
                                    {/* Story Header */}
                                    <div className="flex items-center gap-4">
                                        <img
                                            src={story.authorImage}
                                            alt={story.authorName}
                                            className="w-10 h-10 rounded-full"
                                        />
                                        <div>
                                            <h2 className="text-xl font-semibold">{story.title}</h2>
                                            <p className="text-sm text-gray-500">
                                                By {story.authorName} • {new Date(story.createdAt).toLocaleDateString()}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Story Content */}
                                    <p className="mt-4 text-gray-700">{story.content}</p>

                                    {/* Story Footer */}
                                    <div className="flex items-center justify-between mt-6">
                                        <div className="flex gap-6">
                                            <button
                                                onClick={() => handleVote(story.id)}
                                                className="flex items-center gap-2 text-gray-500 hover:text-blue-500"
                                            >
                                                <ThumbsUp className="w-4 h-4" />
                                                <span>{story.votes}</span>
                                            </button>
                                            <Link href={`/stories/${story.id}`}>
                                                <button className="flex items-center gap-2 text-gray-500 hover:text-blue-500">
                                                    <MessageCircle className="w-4 h-4" />
                                                    <span>{story.comments?.length || 0}</span>
                                                </button>
                                            </Link>
                                        </div>
                                        <div className="flex gap-2">
                                            <button className="text-gray-500 hover:text-blue-500">
                                                <Share2 className="w-4 h-4" />
                                            </button>
                                            <button className="text-gray-500 hover:text-blue-500">
                                                <Bookmark className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                </Link>
                            ))
                        )}
                    </div>
                </div>
            </main>

            {/* Create Story Dialog */}
            {isDialogOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
                    <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-lg">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-xl font-bold">Create a New Story</h2>
                            <button
                                onClick={() => setIsDialogOpen(false)}
                                className="text-gray-500 hover:text-gray-700"
                            >
                                &times;
                            </button>
                        </div>
                        <form onSubmit={handleCreateStory} className="space-y-4">
                            <input
                                type="text"
                                placeholder="Story Title"
                                value={newStory.title}
                                onChange={(e) => setNewStory({ ...newStory, title: e.target.value })}
                                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            />
                            <textarea
                                placeholder="Share your story..."
                                value={newStory.content}
                                onChange={(e) => setNewStory({ ...newStory, content: e.target.value })}
                                className="w-full px-4 py-2 border rounded-md min-h-[200px] focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            />
                            <button
                                type="submit"
                                className="w-full px-4 py-2 text-white bg-blue-500 rounded-md hover:bg-blue-600"
                            >
                                Publish Story
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}