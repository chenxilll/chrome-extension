import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { SnippetList } from './SnippetList';
import { Snippet } from './SnippetItem';

describe('SnippetList', () => {
  const sampleSnippets: Snippet[] = [
    { id: 1, text: 'First snippet' },
    { id: 2, text: 'Second snippet' },
  ];

  it('renders a list of snippets', () => {
    render(<SnippetList snippets={sampleSnippets} onEditSnippet={() => {}} onDeleteSnippet={() => {}} />);
    expect(screen.getByText('First snippet')).toBeInTheDocument();
    expect(screen.getByText('Second snippet')).toBeInTheDocument();
  });

  it('calls onEditSnippet when an edit action is performed on a snippet', () => {
    const handleEditSnippet = jest.fn();
    render(<SnippetList snippets={sampleSnippets} onEditSnippet={handleEditSnippet} onDeleteSnippet={() => {}} />);

    // Simulate edit action on the first snippet
    fireEvent.click(screen.getAllByText('Edit')[0]);
    fireEvent.change(screen.getByDisplayValue('First snippet'), {
      target: { value: 'Updated first snippet' },
    });
    fireEvent.click(screen.getByText('Save'));

    expect(handleEditSnippet).toHaveBeenCalledWith(sampleSnippets[0].id, 'Updated first snippet');
  });

  it('calls onDeleteSnippet when a delete action is performed on a snippet', () => {
    const handleDeleteSnippet = jest.fn();
    render(<SnippetList snippets={sampleSnippets} onEditSnippet={() => {}} onDeleteSnippet={handleDeleteSnippet} />);

    // Simulate delete action on the second snippet
    fireEvent.click(screen.getAllByText('Delete')[1]);

    expect(handleDeleteSnippet).toHaveBeenCalledWith(sampleSnippets[1].id);
  });
});
