// pages/stories/[id].jsx
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar';

export default function StoryDetails() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { id } = router.query;
  const [story, setStory] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');

  // Fetch story details from the backend
  const fetchStory = async () => {
    try {
      const response = await fetch(`/api/stories/${id}`);
      if (!response.ok) {
        throw new Error('Failed to fetch story');
      }
      const data = await response.json();

      // Ensure comments is a valid array
      const parsedComments = Array.isArray(data.comments)
        ? data.comments
        : JSON.parse(data.comments || '[]');

      setStory(data);
      setComments(parsedComments);
    } catch (error) {
      console.error('Error fetching story:', error);
    }
  };

  // Handle form submission for adding a new comment
  const handleAddComment = async (e) => {
    e.preventDefault();

    if (!newComment) {
      alert('Please enter a comment');
      return;
    }

    try {
      const response = await fetch(`/api/stories/${id}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: newComment,
          userId: session.user.id,
          username: session.user.name,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to add comment');
      }

      const updatedStory = await response.json();

      // Ensure comments is a valid array
      const parsedComments = Array.isArray(updatedStory.comments)
        ? updatedStory.comments
        : JSON.parse(updatedStory.comments || '[]');

      setComments(parsedComments);
      setNewComment('');
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };

  // Fetch story details when the component mounts
  useEffect(() => {
    if (id) {
      fetchStory();
    }
  }, [id]);

  // Redirect if not authenticated
  if (status === 'loading') {
    return <div>Loading...</div>;
  }

  if (!session) {
    router.push('/');
    return null;
  }

  if (!story) {
    return <div>Loading story...</div>;
  }

  return (
    <div>
      <Navbar />
      <div className="max-w-6xl px-4 py-8 mx-auto">
        {/* Story Details Section */}
        <div className="max-w-2xl p-6 mx-auto mb-8 bg-white rounded-lg shadow-lg">
          <h1 className="text-2xl font-bold">{story.title}</h1>
          <p className="mt-4 text-gray-700">{story.content}</p>
          <p className="mt-2 text-sm text-gray-500">
            By: {story.authorName} | Created: {new Date(story.createdAt).toLocaleString()}
          </p>
        </div>

        {/* Comments Section */}
        <div className="max-w-2xl p-6 mx-auto bg-white rounded-lg shadow-lg">
          <h2 className="text-xl font-bold">Comments</h2>
          <div className="mt-4 space-y-4">
            {comments.map((comment) => (
              <div key={comment.id} className="p-4 border rounded">
                <p className="text-gray-700">{comment.content}</p>
                <p className="mt-2 text-sm text-gray-500">
                  By: {comment.username} | {new Date(comment.createdAt).toLocaleString()}
                </p>
              </div>
            ))}
          </div>
          <form onSubmit={handleAddComment} className="mt-4">
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              className="w-full p-2 border rounded"
              rows="3"
              placeholder="Add a comment..."
              required
            />
            <button
              type="submit"
              className="mt-2 px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600"
            >
              Add Comment
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}