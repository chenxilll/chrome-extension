import React, { useState } from 'react';

export interface Tab {
  id: number;
  text: string;
  url: string;
  tabId: number;
  time: string;
}

export interface TabsItemProps {
  tab: Tab;
  onDelete: (tabId: number) => void;
}

export const TabsItem: React.FC<TabsItemProps> = ({ tab, onDelete }) => {
  const [title, timestamp] = tab.text.split('\n');

  const handleUrlClick = () => {
    chrome.runtime.sendMessage({
      action: 'navigateToTab',
      tabId: tab.tabId,
    });
  };

  return (
    <li className="tab-item">
      <div>
        <span onClick={handleUrlClick} className="tab-title">
          {title}
        </span>
        <div className="tab-timestamp">{timestamp}</div>
      </div>
      <button onClick={() => onDelete(tab.tabId)}>Delete</button>
    </li>
  );
};
