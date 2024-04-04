import React, { useState } from 'react';

export interface Snippet {
  id: number;
  text: string;
}

export interface SnippetItemProps {
  snippet: Snippet;
  onEdit: (newSnippet: string) => void;
  onDelete: () => void;
}

export const SnippetItem: React.FC<SnippetItemProps> = ({ snippet, onEdit, onDelete }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedSnippet, setEditedSnippet] = useState(snippet.text);

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleSaveClick = () => {
    onEdit(editedSnippet);
    setIsEditing(false);
  };

  const handleCopyClick = () => {
    navigator.clipboard.writeText(snippet.text);
  };

  return (
    <li className="snippet-item">
      {isEditing ? (
        <div>
          <textarea
            value={editedSnippet}
            onChange={(e) => setEditedSnippet(e.target.value)}
          />
          <button onClick={handleSaveClick}>Save</button>
        </div>
      ) : (
        <div>
          <span>{snippet.text}</span>
          <button onClick={handleEditClick}>Edit</button>
          <button onClick={handleCopyClick}>Copy</button>
          <button onClick={onDelete}>Delete</button>
        </div>
      )}
    </li>
  );
};
