import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { TabsList } from './TabsList';
import { Tab } from './TabsItem';

describe('TabsList', () => {
  const sampletabs: Tab[] = [
    { id: 1, text: 'First tab' },
    { id: 2, text: 'Second tab' },
  ];

  it('renders a list of tabs', () => {
    render(<TabsList tabs={sampletabs} onDeleteTab={() => {}} />);
    expect(screen.getByText('First tab')).toBeInTheDocument();
    expect(screen.getByText('Second tab')).toBeInTheDocument();
  });

  it('calls onEditTab when an edit action is performed on a tab', () => {
    const handleEditTab = jest.fn();
    render(<TabsList tabs={sampletabs} onDeleteTab={() => {}} />);

    // Simulate edit action on the first tab
    fireEvent.click(screen.getAllByText('Edit')[0]);
    fireEvent.change(screen.getByDisplayValue('First tab'), {
      target: { value: 'Updated first tab' },
    });
    fireEvent.click(screen.getByText('Save'));

    expect(handleEditTab).toHaveBeenCalledWith(sampletabs[0].id, 'Updated first tab');
  });

  it('calls onDeleteTab when a delete action is performed on a tab', () => {
    const handleDeleteTab = jest.fn();
    render(<TabsList tabs={sampletabs} onDeleteTab={handleDeleteTab} />);

    // Simulate delete action on the second tab
    fireEvent.click(screen.getAllByText('Delete')[1]);

    expect(handleDeleteTab).toHaveBeenCalledWith(sampletabs[1].id);
  });
});
