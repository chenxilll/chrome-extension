import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import TabsList, { TabsListProps } from './TabsList';
import { Tab } from './TabsItem';

describe('TabsList', () => {
  const mockTabs: Tab[] = [
    {
      id: 1,
      text: 'Example Tab 1\nTimestamp 1',
      url: 'http://example.com/1',
      time: 'Timestamp 1',
    },
    {
      id: 2,
      text: 'Example Tab 2\nTimestamp 2',
      url: 'http://example.com/2',
      time: 'Timestamp 2',
    },
  ];

  const onDeleteTabMock = jest.fn();

  const renderComponent = (props: Partial<TabsListProps> = {}) => {
    const defaultProps: TabsListProps = {
      title: 'Tabs',
      tabs: mockTabs,
      onDeleteTab: onDeleteTabMock,
    };
    return render(<TabsList {...defaultProps} {...props} />);
  };

  test('renders title and tab count', () => {
    const { getByText } = renderComponent();
    expect(getByText('Tabs (2)')).toBeInTheDocument();
  });

  test('renders tab list when title is clicked', () => {
    const { getByText, queryByText } = renderComponent();
    expect(queryByText('Example Tab 1')).toBeNull();
    expect(queryByText('Example Tab 2')).toBeNull();

    fireEvent.click(getByText('Tabs (2)'));

    expect(getByText('Example Tab 1')).toBeInTheDocument();
    expect(getByText('Example Tab 2')).toBeInTheDocument();
  });

  test('calls onDeleteTab when delete button of a tab is clicked', () => {
    const { getByText } = renderComponent();
    fireEvent.click(getByText('Tabs (2)'));
  
    // Find the delete button within the first tab item and click it
    const deleteButton = getByText('Delete', { selector: 'li:nth-of-type(1) button' });
    fireEvent.click(deleteButton);
  
    expect(onDeleteTabMock).toHaveBeenCalledWith(1);
  });
  
});
