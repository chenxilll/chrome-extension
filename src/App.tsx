import React, { useState, useEffect } from 'react';
import './App.css';
import { Tab, TabsList } from './components/TabsList';
import { tabs } from 'sinon-chrome';


function App() {
  // Define the state variable for storing the list of tabs
  // const [tabs, setTabs] = useState<Tab[]>([]);
  const [tabsByCategory, setTabsByCategory] = useState<{ [key: string]: Tab[] }>({});
  const [fullTabsByCategory, setFullTabsByCategory] = useState<{ [key: string]: Tab[] }>({});
  const [selectedThresholds, setSelectedThresholds] = useState<number[]>([0, 1, 2, 3, 4]);

  const [isSwitchOn, setIsSwitchOn] = useState(false);

  const toggleSwitch = () => {
    setIsSwitchOn(!isSwitchOn);
  };

  // Define the list of thresholds and their corresponding category names
  const thresholds = [
    { threshold: 0, category: 'Recent' },
    { threshold: 0.5, category: 'More than half a day' },
    { threshold: 1, category: 'More than a day' },
    { threshold: 3, category: 'More than 3 days' },
    { threshold: 7, category: 'More than a week' }
  ];

  useEffect(() => {
    chrome.storage.local.get(['tabs', 'selectedThresholds'], (result) => {
      cleanupMissingTabs();
      if (result.tabs) {
        const now = Date.now();
        const sortedTabs: { [key: string]: Tab[] } = {};

        result.tabs.forEach((tab: Tab) => {
          const daysOpened = (now - parseInt(tab.time)) / (1000 * 3600 * 24);
          const category = getCategory(daysOpened);
          // Initialize category array if it doesn't exist
          if (!sortedTabs[category]) {
            sortedTabs[category] = [];
          }
          sortedTabs[category].push(tab);
        });
        setFullTabsByCategory(sortedTabs);
      }
      if (result.selectedThresholds) {
        setSelectedThresholds(result.selectedThresholds);
      }
    });
  }, []);

  useEffect(() => {
    chrome.storage.local.set({ selectedThresholds });
  }, [selectedThresholds]);

  // Function to determine category based on the number of days
  const getCategory = (days: number): string => {
    for (const { threshold, category } of thresholds) {
      if (days > threshold) {
        return category;
      }
    }
    // Default category if no threshold matches
    return 'Unknown';
  };

  // Filter tabs based on selected thresholds
  useEffect(() => {
    const filteredTabs: { [key: string]: Tab[] } = {};
    for (const { threshold, category } of thresholds) {
      if (fullTabsByCategory.hasOwnProperty(category)) {
        const thresholdIndex = thresholds.findIndex(threshold => threshold.category === category);
        if (selectedThresholds.includes(thresholdIndex)) {
          filteredTabs[category] = fullTabsByCategory[category];
        }
      }
    }
    setTabsByCategory(filteredTabs);
  }, [selectedThresholds, fullTabsByCategory]);

  // Handler for deleting a tab
  const handleDeleteTab = (id: number) => {
    // Retrieve tabs from local storage
    chrome.storage.local.get('tabs', (result) => {
      if (result.tabs) {
        // Find the tab with the provided ID
        const tabToDelete = result.tabs.find((tab: Tab) => tab.id === id);
        if (tabToDelete) {
          const { id: mainId, tabId } = tabToDelete; // Extract mainId and tabId

          // Remove the tab from local storage
          const updatedTabs = result.tabs.filter((tab: Tab) => tab.id !== mainId);
          chrome.storage.local.set({ tabs: updatedTabs }, () => {
            // After deleting from local storage, remove the associated tab
            chrome.tabs.remove(id, () => {
              console.log(`Tab ${id} removed.`);
              // Update tabsByCategory state after deletion
              const updatedTabsByCategory = { ...tabsByCategory };
              for (const category in updatedTabsByCategory) {
                if (updatedTabsByCategory.hasOwnProperty(category)) {
                  updatedTabsByCategory[category] = updatedTabsByCategory[category].filter(tab => tab.id !== mainId);
                  if (updatedTabsByCategory[category].length === 0) {
                    delete updatedTabsByCategory[category];
                  }
                }
              }
              setFullTabsByCategory(updatedTabsByCategory);
            });
          });
        }
      }
    });
  };


  // Handler for toggling selected thresholds
  const handleThresholdToggle = (thresholdIndex: number) => {
    const updatedThresholds = [...selectedThresholds];
    const index = updatedThresholds.indexOf(thresholdIndex);
    if (index === -1) {
      updatedThresholds.push(thresholdIndex);
    } else {
      updatedThresholds.splice(index, 1);
    }
    setSelectedThresholds(updatedThresholds);
  };

  // Function to remove missing tabs
  const cleanupMissingTabs = () => {
    chrome.tabs.query({}, (currentTabs: any[]) => {
      const currentTabIds = currentTabs.map(tab => tab.id);

      chrome.storage.local.get('tabs', (result: { tabs?: Tab[] }) => {
        if (result.tabs) {
          const updatedTabs = result.tabs.filter((tab: Tab) => currentTabIds.includes(tab.id));
          chrome.storage.local.set({ tabs: updatedTabs }, () => {
            console.log("Tabs in local storage updated after cleanup.");
          });
        }
      });
    });
  };


  return (
    <div className="App">
      <div className="logo-container" onClick={toggleSwitch}>
        <span className="logo-text">Tabs</span>
        <svg className="logo-svg" viewBox="0 0 100 60" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <filter id="shadow" x="-50%" y="-50%" width="200%" height="200%">
              <feDropShadow dx="0" dy="4" stdDeviation="3" floodColor="#000000" floodOpacity="0.3" />
            </filter>
          </defs>
          <rect x="0" y="25" width="60" height="30" rx="15" fill={isSwitchOn ? "#4CAF50" : "#f44336"} />
          <circle cx={isSwitchOn ? "45" : "15"} cy="40" r="12" fill="#FFF" />
        </svg>
      </div>
      <div>
        {thresholds.map((threshold, index) => (
          <button
            key={index}
            className={selectedThresholds.includes(index) ? 'threshold-button selected' : 'threshold-button'}
            onClick={() => handleThresholdToggle(index)}
          >
            {threshold.category}
          </button>
        ))}
        {Object.keys(tabsByCategory).map(category => (
          <TabsList
            key={category}
            title={category}
            tabs={tabsByCategory[category]}
            onDeleteTab={handleDeleteTab}
          />
        ))}
      </div>
    </div>
  );
}

export default App;
