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

  const toggleList = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div>
      {title && (
        <div onClick={toggleList} style={{ cursor: 'pointer', position: 'relative' }}>
          <h2 onClick={toggleList} style={{ cursor: 'pointer' }}>
            {title} ({tabs.length})
            <span className={`dropdown-indicator ${isOpen ? 'open' : ''}`}></span>
          </h2>
        </div>
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