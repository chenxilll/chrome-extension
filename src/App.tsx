import React, { useState, useEffect } from 'react';
import './App.css';
import { Snippet, SnippetList } from './components/SnippetList';

// Define a sample snippet for initial state when local storage is empty
const sample_snippet: Snippet = { id: 1, text: 'Sample snippet', tabId: 0, url: '', time: '' };

function App() {
  // Define the state variable for storing the list of snippets
  const [snippets, setSnippets] = useState<Snippet[]>([]);
  const [snippetsByCategory, setSnippetsByCategory] = useState<{ [key: string]: Snippet[] }>({});
  const [selectedThresholds, setSelectedThresholds] = useState<number[]>([]);

  // Define the list of thresholds and their corresponding category names
  const thresholds = [
    { threshold: 7, category: 'Over a week' },
    { threshold: 0.5, category: 'More than half a day' },
    { threshold: 20*1000/(1000 * 3600 * 24), category: 'More than 20s' },
    { threshold: 10*1000/(1000 * 3600 * 24), category: 'More than 10s' },
    { threshold: 0, category: 'Recent' }
  ];

  useEffect(() => {
    chrome.storage.local.get(['snippets', 'selectedThresholds'], (result) => {
      if (result.snippets) {
        const now = Date.now();
        const sortedSnippets: { [key: string]: Snippet[] } = {};

        result.snippets.forEach((snippet: Snippet) => {
          const daysOpened = (now - parseInt(snippet.time)) / (1000 * 3600 * 24);
          const category = getCategory(daysOpened);
          // Initialize category array if it doesn't exist
          if (!sortedSnippets[category]) {
            sortedSnippets[category] = [];
          }
          sortedSnippets[category].push(snippet);
        });
        setSnippetsByCategory(sortedSnippets);
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

  // Filter snippets based on selected thresholds
  useEffect(() => {
    const filteredSnippets: { [key: string]: Snippet[] } = {};
    for (const category in snippetsByCategory) {
      if (snippetsByCategory.hasOwnProperty(category)) {
        const thresholdIndex = thresholds.findIndex(threshold => threshold.category === category);
        if (selectedThresholds.includes(thresholdIndex)) {
          filteredSnippets[category] = snippetsByCategory[category];
        }
      }
    }
    setSnippetsByCategory(filteredSnippets);
  }, [selectedThresholds]);

  // Handler for editing a snippet
  const handleEditSnippet = (id: number, newText: string) => {
    // Create a new array with the updated snippet
    const updatedSnippets = snippets.map((snippet) =>
      snippet.id === id ? { ...snippet, text: newText } : snippet
    );
    // Update the state with the new array
    setSnippets(updatedSnippets);
    // Save the updated snippets to local storage
    chrome.storage.local.set({ snippets: updatedSnippets });
  };

  // Handler for deleting a snippet
  const handleDeleteSnippet = (id: number) => {
    // Retrieve snippets from local storage
    chrome.storage.local.get('snippets', (result) => {
      if (result.snippets) {
        // Find the snippet with the provided ID
        const snippetToDelete = result.snippets.find((snippet: Snippet) => snippet.id === id);
        if (snippetToDelete) {
          const { id: snippetId, tabId } = snippetToDelete; // Extract snippetId and tabId

          // Remove the snippet from local storage
          const updatedSnippets = result.snippets.filter((snippet: Snippet) => snippet.id !== snippetId);
          chrome.storage.local.set({ snippets: updatedSnippets }, () => {
            // After deleting from local storage, remove the associated tab
            chrome.tabs.remove(tabId, () => {
              console.log(`Tab ${tabId} removed.`);
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

  return (
    <div className="App">
      <h1>Snippet Collector</h1>
      <div>
        {thresholds.map((threshold, index) => (
          <div key={index}>
            <input
              type="checkbox"
              checked={selectedThresholds.includes(index)}
              onChange={() => handleThresholdToggle(index)}
            />
            <label>{threshold.category}</label>
          </div>
        ))}
        {Object.keys(snippetsByCategory).map(category => (
          <SnippetList
            key={category}
            title={category}
            snippets={snippetsByCategory[category]}
            onEditSnippet={handleEditSnippet}
            onDeleteSnippet={handleDeleteSnippet}
          />
        ))}
      </div>
    </div>
  );
}

export default App;
