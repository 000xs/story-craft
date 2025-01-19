 import { redis } from "@/lib/redis";

export default async function handler(req, res) {
  const { id } = req.query;  
  const storyKey = `story:${id}`; 

  try {
    switch (req.method) {
      // Handle GET request (fetch a story)
      case "GET":
        const story = await redis.hgetall(storyKey);  
        // if (!story || Object.keys(story).length === 0) {
        //   return res.status(404).json({ error: "Story not found" });
        // }
        return res.status(200).json(story);

   
      
      case "PUT":
        const { title: updatedTitle, content: updatedContent } = req.body;

        // Validate input
        if (!updatedTitle && !updatedContent) {
          return res.status(400).json({ error: "No fields to update" });
        }

      
        const existingStory = await redis.hgetall(storyKey);
        // if (!existingStory || Object.keys(existingStory).length === 0) {
        //   return res.status(404).json({ error: "Story not found" });
        // }

    
        if (updatedTitle) existingStory.title = updatedTitle;
        if (updatedContent) existingStory.content = updatedContent;

    
        await redis.hset(storyKey, existingStory);

        return res.status(200).json(existingStory);

 
      case "DELETE":
 
        const storyExists = await redis.exists(storyKey);
        if (!storyExists) {
          return res.status(404).json({ error: "Story not found" });
        }

       
        await redis.del(storyKey);

        return res.status(204).end();

    
      default:
        res.setHeader("Allow", ["GET", "POST", "PUT", "DELETE"]);
        return res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  } catch (error) {
    console.error("Error in stories/[id].js:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}
