import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { TabsItem } from './TabsItem';

const mockTab = {
  id: 1,
  text: 'Sample tab',
};

describe('TabsItem', () => {
  it('renders tab text', () => {
    render(<TabsItem tab={mockTab} onDelete={() => {}} />);
    expect(screen.getByText('Sample tab')).toBeInTheDocument();
  });

  it('renders edit, copy, and delete buttons', () => {
    render(<TabsItem tab={mockTab} onDelete={() => {}} />);
    expect(screen.getByText('Edit')).toBeInTheDocument();
    expect(screen.getByText('Copy')).toBeInTheDocument();
    expect(screen.getByText('Delete')).toBeInTheDocument();
  });

  it('switches to edit mode when edit button is clicked', () => {
    render(<TabsItem tab={mockTab} onDelete={() => {}} />);
    fireEvent.click(screen.getByText('Edit'));
    expect(screen.getByDisplayValue('Sample tab')).toBeInTheDocument();
    expect(screen.getByText('Save')).toBeInTheDocument();
  });

  it('copies tab text to clipboard when copy button is clicked', () => {
    /* mock the navigator.clipboard.writeText function to avoid actually interacting
       with the clipboard during the test. */
    Object.assign(navigator, {
      clipboard: {
        writeText: jest.fn(),
      },
    });
    render(<TabsItem tab={mockTab} onDelete={() => {}} />);
    fireEvent.click(screen.getByText('Copy'));
    expect(navigator.clipboard.writeText).toHaveBeenCalledWith('Sample tab');
  });

  it('calls onDelete when delete button is clicked', () => {
    const handleDelete = jest.fn();
    render(<TabsItem tab={mockTab} onDelete={handleDelete} />);
    fireEvent.click(screen.getByText('Delete'));
    expect(handleDelete).toHaveBeenCalled();
  });
});

