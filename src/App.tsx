import React, { useState, useEffect } from 'react';
import './App.css';
import { Snippet, SnippetList } from './components/SnippetList';

// Define a sample snippet for initial state when local storage is empty
const sample_snippet: Snippet = { id: 1, text: 'Sample snippet', tabId: 0};

function App() {
  // Define the state variable for storing the list of snippets
  const [snippets, setSnippets] = useState<Snippet[]>([]);

  // Use useEffect to load snippets from local storage when the component mounts
  useEffect(() => {
    chrome.storage.local.get('snippets', (result) => {
      if (result.snippets === undefined) {
        // If 'snippets' key doesn't exist in local storage, set the initial state with the sample snippet
        setSnippets([sample_snippet]);
      } else {
        // If 'snippets' key exists in local storage, set the state with the stored snippets
        result.snippets.sort((a: any, b: any) => a.time - b.time);
        setSnippets(result.snippets);
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
      {/* Render the SnippetList component with the snippets and event handlers */}
      <SnippetList
        snippets={snippets}
        onEditSnippet={handleEditSnippet}
        onDeleteSnippet={handleDeleteSnippet}
      />
    </div>
  );
}

export default App;