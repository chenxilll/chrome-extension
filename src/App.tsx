import React, { useState, useEffect } from 'react';
import './App.css';
import { Snippet, SnippetList } from './components/SnippetList';

// Define a sample snippet for initial state when local storage is empty
const sample_snippet: Snippet = { id: 1, text: 'Sample snippet', tabId: 0, url: '', time: '' };

function App() {
  // Define the state variable for storing the list of snippets
// Define the state variable for storing the list of snippets
const [snippets, setSnippets] = useState<Snippet[]>([]);
const [snippetsByCategory, setSnippetsByCategory] = useState<{ [key: string]: Snippet[] }>({});

// Define the list of thresholds and their corresponding category names
const thresholds = [
  { threshold: 7, category: 'Over a week' },
  { threshold: 0.5, category: 'More than half a day' },
  { threshold: 10*1000/(1000 * 3600 * 24), category: 'More than 10s' },
  { threshold: 0, category: 'Less than half a day' }
];

useEffect(() => {
  chrome.storage.local.get('snippets', (result) => {
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
  });
}, []);

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


  return (
    <div className="App">
      <h1>Snippet Collector</h1>
      <div>
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