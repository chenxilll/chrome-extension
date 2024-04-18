import React, { useState } from 'react';
import { Tab, TabsItem } from './TabsItem';

export type { Tab } from './TabsItem';

export interface TabsListProps {
  title?: string;
  tabs: Tab[];
  onDeleteTab: (id: number) => void;
}

export const TabsList: React.FC<TabsListProps> = ({
  title,
  tabs,
  onDeleteTab,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div>
      {title && (
        <h2 onClick={() => setIsOpen(!isOpen)} style={{ cursor: 'pointer' }}>
          {title} ({tabs.length})
        </h2>
      )}
      {isOpen && (
        <ul className="tabs-list">
          {tabs.map(tab => (
            <TabsItem
              key={tab.id}
              tab={tab}
              onDelete={() => onDeleteTab(tab.id)}
            />
          ))}
        </ul>
      )}
    </div>
  );
};

export default TabsList;