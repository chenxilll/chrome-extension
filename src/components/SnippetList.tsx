import React from 'react';
import { Snippet, SnippetItem } from './SnippetItem';

export type { Snippet } from './SnippetItem';

export interface SnippetListProps {
  snippets: Snippet[];
  onEditSnippet: (id: number, newSnippet: string) => void;
  onDeleteSnippet: (id: number) => void;
}

export const SnippetList: React.FC<SnippetListProps> = ({
  snippets,
  onEditSnippet,
  onDeleteSnippet,
}) => {
  return (
    <ul className="snippet-list">
      {snippets.map((snippet) => (
        <SnippetItem
          key={snippet.id}
          snippet={snippet}
          onEdit={(newSnippet) => onEditSnippet(snippet.id, newSnippet)}
          onDelete={() => onDeleteSnippet(snippet.id)}
        />
      ))}
    </ul>
  );
};

export default SnippetList;