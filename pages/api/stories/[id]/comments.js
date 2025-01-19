 
import { redis } from '@/lib/redis';

export default async function handler(req, res) {
  const { id } = req.query;
  const storyKey = `story:${id}`;

  try {
    switch (req.method) {
      case 'GET':
 
        const comments = await redis.hget(storyKey, 'comments');
        const parsedComments = comments ? JSON.parse(comments) : [];
        return res.status(200).json(parsedComments);

      case 'POST':
        const { content, userId, username } = req.body;

   
        if (!content || !userId || !username) {
          return res.status(400).json({ error: 'Missing required fields' });
        }

 
        const existingComments = await redis.hget(storyKey, 'comments');
        const parsedExistingComments = existingComments
          ? existingComments
          : [];

    
        const newComment = {
          id: Date.now().toString(),
          content,
          userId,
          username,
          createdAt: Date.now(),
        };
        parsedExistingComments.push(newComment);

     
        await redis.hset(storyKey, 'comments', JSON.stringify(parsedExistingComments));

        return res.status(201).json(newComment);

      default:
        res.setHeader('Allow', ['GET', 'POST']);
        return res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  } catch (error) {
    console.error('Error in stories/[id]/comments.js:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}