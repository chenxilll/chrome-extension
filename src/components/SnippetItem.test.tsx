import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { SnippetItem } from './SnippetItem';

const mockSnippet = {
  id: 1,
  text: 'Sample snippet',
};

describe('SnippetItem', () => {
  it('renders snippet text', () => {
    render(<SnippetItem snippet={mockSnippet} onEdit={() => {}} onDelete={() => {}} />);
    expect(screen.getByText('Sample snippet')).toBeInTheDocument();
  });

  it('renders edit, copy, and delete buttons', () => {
    render(<SnippetItem snippet={mockSnippet} onEdit={() => {}} onDelete={() => {}} />);
    expect(screen.getByText('Edit')).toBeInTheDocument();
    expect(screen.getByText('Copy')).toBeInTheDocument();
    expect(screen.getByText('Delete')).toBeInTheDocument();
  });

  it('switches to edit mode when edit button is clicked', () => {
    render(<SnippetItem snippet={mockSnippet} onEdit={() => {}} onDelete={() => {}} />);
    fireEvent.click(screen.getByText('Edit'));
    expect(screen.getByDisplayValue('Sample snippet')).toBeInTheDocument();
    expect(screen.getByText('Save')).toBeInTheDocument();
  });

  it('calls onEdit with the updated snippet when save button is clicked', () => {
    const handleEdit = jest.fn();
    render(<SnippetItem snippet={mockSnippet} onEdit={handleEdit} onDelete={() => {}} />);
    fireEvent.click(screen.getByText('Edit'));
    fireEvent.change(screen.getByDisplayValue('Sample snippet'), {
      target: { value: 'Updated snippet' },
    });
    fireEvent.click(screen.getByText('Save'));
    expect(handleEdit).toHaveBeenCalledWith('Updated snippet');
  });

  it('copies snippet text to clipboard when copy button is clicked', () => {
    /* mock the navigator.clipboard.writeText function to avoid actually interacting
       with the clipboard during the test. */
    Object.assign(navigator, {
      clipboard: {
        writeText: jest.fn(),
      },
    });
    render(<SnippetItem snippet={mockSnippet} onEdit={() => {}} onDelete={() => {}} />);
    fireEvent.click(screen.getByText('Copy'));
    expect(navigator.clipboard.writeText).toHaveBeenCalledWith('Sample snippet');
  });

  it('calls onDelete when delete button is clicked', () => {
    const handleDelete = jest.fn();
    render(<SnippetItem snippet={mockSnippet} onEdit={() => {}} onDelete={handleDelete} />);
    fireEvent.click(screen.getByText('Delete'));
    expect(handleDelete).toHaveBeenCalled();
  });
});

