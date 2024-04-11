import React, { useState } from 'react';
import { Snippet, SnippetItem } from './SnippetItem';

export type { Snippet } from './SnippetItem';

export interface SnippetListProps {
  title?: string;
  snippets: Snippet[];
  onEditSnippet: (id: number, newSnippet: string) => void;
  onDeleteSnippet: (id: number) => void;
}

export const SnippetList: React.FC<SnippetListProps> = ({
  title,
  snippets,
  onEditSnippet,
  onDeleteSnippet,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div>
      {title && (
        <h2 onClick={() => setIsOpen(!isOpen)} style={{ cursor: 'pointer' }}>
          {title} ({snippets.length})
        </h2>
      )}
      {isOpen && (
        <ul className="snippet-list">
          {snippets.map(snippet => (
            <SnippetItem
              key={snippet.id}
              snippet={snippet}
              onEdit={(newSnippet) => onEditSnippet(snippet.id, newSnippet)}
              onDelete={() => onDeleteSnippet(snippet.id)}
            />
          ))}
        </ul>
      )}
    </div>
  );
};

export default SnippetList;