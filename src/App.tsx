import React, { useState, useEffect } from 'react';
import './App.css';
import { Snippet, SnippetList } from './components/SnippetList';

// Define a sample snippet for initial state when local storage is empty
const sample_snippet: Snippet = { id: 1, text: 'Sample snippet', tabId: 0, url: '', time: '' };

function App() {
  // Define the state variable for storing the list of snippets
  const [snippets, setSnippets] = useState<Snippet[]>([]);
  const [snippetsByCategory, setSnippetsByCategory] = useState<{
    overWeek: Snippet[];
    threeToSevenDays: Snippet[];
    lessThanThreeDays: Snippet[];
  }>({ overWeek: [], threeToSevenDays: [], lessThanThreeDays: [] });

  useEffect(() => {
    chrome.storage.local.get('snippets', (result) => {
      if (result.snippets) {
        const now = Date.now();
        const sortedSnippets: {
          overWeek: Snippet[];
          threeToSevenDays: Snippet[];
          lessThanThreeDays: Snippet[];
        } = {
          overWeek: [],
          threeToSevenDays: [],
          lessThanThreeDays: []
        };
        result.snippets.forEach((snippet: Snippet) => {
          const daysOpened = (now - parseInt(snippet.time)) / (1000 * 3600 * 24);
          if (daysOpened > 7) {
            sortedSnippets.overWeek.push(snippet);
          } else if (daysOpened > 0.5) {
            sortedSnippets.threeToSevenDays.push(snippet);
          } else {
            sortedSnippets.lessThanThreeDays.push(snippet);
          }
        });
        setSnippetsByCategory(sortedSnippets);
      }
    });
  }, []);

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
    // Find the snippet with the provided ID
    const snippetToDelete = snippets.find((snippet) => snippet.id === id);
    if (snippetToDelete) {
      const { id: snippetId, tabId } = snippetToDelete; // Extract snippetId and tabId
      // Remove the tab associated with the snippet
      chrome.tabs.remove(tabId, () => {
        console.log(`Tab ${tabId} removed.`);
      });

      // Create a new array without the deleted snippet
      const updatedSnippets = snippets.filter((snippet) => snippet.id !== snippetId);
      // Update the state with the new array
      setSnippets(updatedSnippets);
      // Save the updated snippets to local storage
      chrome.storage.local.set({ snippets: updatedSnippets });
    }
  };

  return (
    <div className="App">
      <h1>Snippet Collector</h1>
      <div>
        <SnippetList
          title="More Than 7 Days"
          snippets={snippetsByCategory.overWeek}
          onEditSnippet={handleEditSnippet}
          onDeleteSnippet={handleDeleteSnippet}
        />
        <SnippetList
          title="More Than Half a Day"
          snippets={snippetsByCategory.threeToSevenDays}
          onEditSnippet={handleEditSnippet}
          onDeleteSnippet={handleDeleteSnippet}
        />
        <SnippetList
          title="Less Than Half a Day"
          snippets={snippetsByCategory.lessThanThreeDays}
          onEditSnippet={handleEditSnippet}
          onDeleteSnippet={handleDeleteSnippet}
        />
      </div>
    </div>
  );
}

export default App;