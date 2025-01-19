 import { redis } from "@/lib/redis";

export default async function handler(req, res) {
  try {
    switch (req.method) {
      // Handle GET request  
      case "GET":
      
        const keys = await redis.keys("story:*");
        console.log("Fetched keys:", keys);  
 
        const storyKeys = keys.filter((key) => key !== "story:next_id");
        console.log("Filtered story keys:", storyKeys);  
 
        if (!storyKeys || storyKeys.length === 0) {
          return res.status(200).json([]);
        }
 
        const stories = await Promise.all(
          storyKeys.map(async (key) => {
            const story = await redis.hgetall(key);
            console.log("Fetched story:", story);  
            return story;
          })
        );

        return res.status(200).json(stories);
 
      case "POST":
        const { title, content, authorId } = req.body;
 
        if (!title || !content || !authorId) {
          return res.status(400).json({ error: "Missing required fields" });
        }

      
        const nextId = await redis.incr("story:next_id");
        const newStoryKey = `story:${nextId}`;
 
     
        const newStory = {
          id: nextId,
          title,
          content,
          authorId,
          createdAt: Date.now(),
          votes: 0,
          comments: "[]",
        };

       
        await redis.hset(newStoryKey, newStory);

        return res.status(201).json(newStory);

   
      default:
        res.setHeader("Allow", ["GET", "POST"]);
        return res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  } catch (error) {
    console.error("Error in stories/index.js:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}
