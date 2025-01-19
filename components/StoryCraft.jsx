import React, { useState } from 'react';
import { ThumbsUp, MessageCircle, Users, Share2, Eye, Edit } from 'lucide-react';

const StoryCraft = () => {
  const [story, setStory] = useState({
    title: "The Mysterious Forest",
    content: "# Chapter 1\n\nDeep in the heart of the ancient woods, where shadows danced between towering trees...\n\n## The Discovery\n\n*A mysterious light* flickered through the branches, casting **ethereal shadows** on the forest floor.",
    authors: ["Alice", "Bob"],
    votes: 42,
    comments: 15
  });

  const [isEditing, setIsEditing] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [newContent, setNewContent] = useState(story.content);

  const handleSave = () => {
    setStory(prev => ({
      ...prev,
      content: newContent
    }));
    setIsEditing(false);
  };

  // Simple Markdown to HTML converter
  const convertMarkdownToHtml = (markdown) => {
    let html = markdown
      // Headers
      .replace(/^# (.*$)/gm, '<h1>$1</h1>')
      .replace(/^## (.*$)/gm, '<h2>$1</h2>')
      .replace(/^### (.*$)/gm, '<h3>$1</h3>')
      // Bold
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      // Italic
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      // Lists
      .replace(/^\- (.*$)/gm, '<li>$1</li>')
      // Paragraphs
      .split('\n\n').join('</p><p>');
    
    return `<p>${html}</p>`;
  };

  const renderToolbar = () => (
    <div className="flex mb-2 space-x-2">
      <button
        className="px-3 py-1 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
        onClick={() => {
          setNewContent(prev => prev + '**Bold**');
        }}
      >
        B
      </button>
      <button
        className="px-3 py-1 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
        onClick={() => {
          setNewContent(prev => prev + '*Italic*');
        }}
      >
        I
      </button>
      <button
        className="px-3 py-1 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
        onClick={() => {
          setNewContent(prev => prev + '\n# Heading');
        }}
      >
        H1
      </button>
      <button
        className="px-3 py-1 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
        onClick={() => {
          setNewContent(prev => prev + '\n- List item');
        }}
      >
        List
      </button>
    </div>
  );

  return (
    <div className="w-full bg-white rounded-lg shadow-md">
      <div className="p-6 border-b">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">{story.title}</h1>
          <div className="flex items-center space-x-2">
            <Users className="w-4 h-4" />
            <span className="text-sm text-gray-600">
              {story.authors.join(", ")}
            </span>
          </div>
        </div>
      </div>

      <div className="p-6">
        {isEditing ? (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              {renderToolbar()}
              <button
                className="flex items-center space-x-2 text-sm font-medium text-gray-700 hover:text-gray-900"
                onClick={() => setShowPreview(!showPreview)}
              >
                {showPreview ? (
                  <>
                    <Edit className="w-4 h-4" />
                    <span>Edit</span>
                  </>
                ) : (
                  <>
                    <Eye className="w-4 h-4" />
                    <span>Preview</span>
                  </>
                )}
              </button>
            </div>

            {showPreview ? (
              <div 
                className="prose max-w-none p-4 border rounded-md min-h-[200px]"
                dangerouslySetInnerHTML={{ __html: convertMarkdownToHtml(newContent) }}
              />
            ) : (
              <textarea
                className="w-full h-48 p-2 font-mono border rounded-md"
                value={newContent}
                onChange={(e) => setNewContent(e.target.value)}
                placeholder="Write your story using Markdown..."
              />
            )}

            <div className="flex justify-end space-x-2">
              <button
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                onClick={() => setIsEditing(false)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
                onClick={handleSave}
              >
                Save Changes
              </button>
            </div>
          </div>
        ) : (
          <div
            className="prose cursor-pointer max-w-none"
            onClick={() => setIsEditing(true)}
            dangerouslySetInnerHTML={{ __html: convertMarkdownToHtml(story.content) }}
          />
        )}

        <div className="flex items-center justify-between pt-4 mt-4 border-t">
          <div className="flex space-x-4">
            <button className="flex items-center space-x-1 text-sm font-medium text-gray-700 hover:text-gray-900">
              <ThumbsUp className="w-4 h-4" />
              <span>{story.votes}</span>
            </button>
            <button className="flex items-center space-x-1 text-sm font-medium text-gray-700 hover:text-gray-900">
              <MessageCircle className="w-4 h-4" />
              <span>{story.comments}</span>
            </button>
          </div>
          <button className="text-sm font-medium text-gray-700 hover:text-gray-900">
            <Share2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default StoryCraft;