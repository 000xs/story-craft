// pages/api/stories/[id]/vote.js
import { redis } from '@/lib/redis';

export default async function handler(req, res) {
  const { id } = req.query;
  const storyKey = `story:${id}`;

  if (req.method === 'POST') {
    
    const newVotes = await redis.hincrby(storyKey, 'votes', 1);

    return res.json({ votes: newVotes });
  }

  res.setHeader('Allow', ['POST']);
  return res.status(405).end(`Method ${req.method} Not Allowed`);
}