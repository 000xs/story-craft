// lib/realtimeUpdates.js
import { Redis } from "@upstash/redis";

// Initialize Redis client for Pub/Sub
const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

/**
 * Subscribe to updates for a specific story.
 * @param {string} storyId - The ID of the story to subscribe to.
 * @param {function} callback - The function to call when an update is received.
 * @returns {function} A function to unsubscribe from the channel.
 */
export const subscribeToStoryUpdates = (storyId, callback) => {
  const channel = `story:${storyId}:updates`; // Redis channel for the story

  // Create a duplicate Redis client for subscriptions
  const subscriptionClient = redis.duplicate();

  // Subscribe to the channel
  subscriptionClient.subscribe(channel, (err) => {
    if (err) {
      console.error("Failed to subscribe to channel:", err);
      return;
    }
    console.log(`Subscribed to channel: ${channel}`);
  });

  // Handle incoming messages
  subscriptionClient.on("message", (channel, message) => {
    try {
      const update = JSON.parse(message); // Parse the message as JSON
      callback(update); // Call the callback with the update
    } catch (error) {
      console.error("Failed to parse message:", error);
    }
  });

  // Return a function to unsubscribe
  return () => {
    subscriptionClient.unsubscribe(channel);
    subscriptionClient.quit();
    console.log(`Unsubscribed from channel: ${channel}`);
  };
};

/**
 * Publish an update to a specific story's channel.
 * @param {string} storyId - The ID of the story to publish the update for.
 * @param {object} update - The update to publish (e.g., new comment, vote, or edit).
 */
export const publishStoryUpdate = async (storyId, update) => {
  const channel = `story:${storyId}:updates`; // Redis channel for the story

  try {
    // Publish the update to the channel
    await redis.publish(channel, JSON.stringify(update));
    console.log(`Published update to channel: ${channel}`);
  } catch (error) {
    console.error("Failed to publish update:", error);
  }
};
