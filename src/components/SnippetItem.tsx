import React, { useState } from 'react';

export interface Snippet {
  id: number;
  text: string;
  url: string;
  tabId: number; // Assuming tabId is part of your Snippet model now
  time: string;
}

export interface SnippetItemProps {
  snippet: Snippet;
  onEdit: (newSnippet: string) => void;
  onDelete: (tabId: number) => void;
}

export const SnippetItem: React.FC<SnippetItemProps> = ({ snippet, onEdit, onDelete }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedSnippet, setEditedSnippet] = useState(snippet.text);

  const [title, timestamp] = snippet.text.split('\n');

  const handleUrlClick = () => {
    chrome.runtime.sendMessage({
      action: 'navigateToTab',
      tabId: snippet.tabId,
    });
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
          <span onClick={handleUrlClick} style={{ textDecoration: 'underline', color: 'blue', cursor: 'pointer' }}>
            {title}
          </span>
          <div>{timestamp}</div>
          <button onClick={() => setIsEditing(true)}>Edit</button>
          <button onClick={() => navigator.clipboard.writeText(snippet.text)}>Copy</button>
          <button onClick={() => onDelete(snippet.tabId)}>Delete</button>
        </div>
      )}
    </li>
  );
};
