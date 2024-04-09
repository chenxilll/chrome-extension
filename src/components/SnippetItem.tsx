import React, { useState } from 'react';

export interface Snippet {
  id: number;
  text: string;
  tabId: number; // Assuming tabId is part of your Snippet model now
}

// Utility function to check if text is a URL
const isUrl = (text: string) => {
  return text.startsWith('http://') || text.startsWith('https://');
};


export interface SnippetItemProps {
  snippet: Snippet;
  onEdit: (newSnippet: string) => void;
  onDelete: (tabId: number) => void;
}

export const SnippetItem: React.FC<SnippetItemProps> = ({ snippet, onEdit, onDelete }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedSnippet, setEditedSnippet] = useState(snippet.text);

  const handleUrlClick = () => {
    // Send a message to the background script to navigate to the tab
    if (isUrl(snippet.text)) {
      chrome.runtime.sendMessage({
        action: 'navigateToTab',
        tabId: snippet.tabId,
      });
    }
  };

  return (
    <li className="snippet-item">
      {isEditing ? (
        <div>
          <textarea value={editedSnippet} onChange={(e) => setEditedSnippet(e.target.value)} />
          <button onClick={() => onEdit(editedSnippet)}>Save</button>
        </div>
      ) : (
        <div>
          {isUrl(snippet.text) ? (
            <span onClick={handleUrlClick} style={{ textDecoration: 'underline', color: 'blue', cursor: 'pointer' }}>
              {snippet.text}
            </span>
          ) : (
            <span>{snippet.text}</span>
          )}
          <button onClick={() => setIsEditing(true)}>Edit</button>
          <button onClick={() => navigator.clipboard.writeText(snippet.text)}>Copy</button>
          <button onClick={() => onDelete(snippet.tabId)}>Delete</button>
        </div>
      )}
    </li>
  );
};
