import React, { useState, useEffect } from 'react';
import './App.css';
import { Snippet, SnippetList } from './components/SnippetList';

// Define a sample snippet for initial state when local storage is empty
const sample_snippet: Snippet = { id: 1, text: 'Sample snippet' };

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
  const handleDeleteSnippet = (id: number) => {
    // Create a new array without the deleted snippet
    const updatedSnippets = snippets.filter((snippet) => snippet.id !== id);
    // Update the state with the new array
    setSnippets(updatedSnippets);
    // Save the updated snippets to local storage
    chrome.storage.local.set({ snippets: updatedSnippets });
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