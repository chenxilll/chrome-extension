import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { TabsItem, Tab } from './TabsItem';

describe('TabsItem', () => {
  const mockTab: Tab = {
    id: 1,
    text: 'Example Tab\nTimestamp',
    url: 'http://example.com',
    time: 'Timestamp',
  };

  test('renders tab title and timestamp', () => {
    const onDelete = jest.fn();
    const { getByText } = render(<TabsItem tab={mockTab} onDelete={onDelete} />);
    expect(getByText('Example Tab')).toBeInTheDocument();
    expect(getByText('Timestamp')).toBeInTheDocument();
  });

  test('calls onDelete when delete button is clicked', () => {
    const onDelete = jest.fn();
    const { getByText } = render(<TabsItem tab={mockTab} onDelete={onDelete} />);
    fireEvent.click(getByText('Delete'));
    expect(onDelete).toHaveBeenCalledWith(1);
  });
});
