// This function is called when the extension is installed or updated
chrome.runtime.onInstalled.addListener(() => {
  // Create a context menu item
  // See: https://developer.chrome.com/docs/extensions/reference/api/contextMenus#method-create
  chrome.contextMenus.create({
    id: 'captureSnippet', // Unique identifier for the context menu item
    title: 'Capture Snippet', // Text to be displayed in the context menu
    contexts: ['selection'], // Show the context menu item only when text is selected
  });
});

// This function is called when a context menu item is clicked
// See: https://developer.chrome.com/docs/extensions/reference/api/contextMenus#event-onClicked
chrome.contextMenus.onClicked.addListener((info, tab) => {
  // Check if the clicked menu item is 'captureSnippet'
  if (info.menuItemId === 'captureSnippet') {
    const selectedText = info.selectionText; // Get the selected text

    // Retrieve the existing snippets from chrome.storage.local
    chrome.storage.local.get({ snippets: [] }, (result) => {
      const snippets = result.snippets;

      // Create a new snippet object with a unique ID and the selected text
      const newSnippet = {
        id: Date.now(),
        text: selectedText,
      };

      // Add the new snippet to the array of snippets
      snippets.push(newSnippet);

      // Save the updated array of snippets to chrome.storage.local
      chrome.storage.local.set({ snippets }, () => {
        console.log('Snippet saved');
      });
    });
  }
});

// chrome.tabs.onCreated.addListener((tab) => {
//   // Check if the clicked menu item is 'captureSnippet'

//   // Retrieve the existing snippets from chrome.storage.local
//   chrome.storage.local.get({ snippets: [] }, (result) => {
//     const snippets = result.snippets;

//     // Create a new snippet object with a unique ID and the selected text
//     const newSnippet = {
//       id: Date.now(),
//       text: Date.now(),
//     };

//     // Add the new snippet to the array of snippets
//     snippets.push(newSnippet);

//     // Save the updated array of snippets to chrome.storage.local
//     chrome.storage.local.set({ snippets }, () => {
//       console.log('Snippet saved');
//     });
//   });
// });


chrome.tabs.onCreated.addListener((tab) => {
  // Retrieve the existing snippets from chrome.storage.local
  chrome.storage.local.get({ snippets: [] }, (result) => {
    const snippets = result.snippets;

    // Get the current date and time in a readable format
    const currentDate = new Date(); // Create a Date object from the current timestamp
    const readableDate = currentDate.toLocaleString(); // Convert to a readable format

    // Create a new snippet object with a unique ID and the readable date
    const newSnippet = {
      id: Date.now(),
      text: readableDate, // Use the readable date instead of the timestamp
    };

    // Add the new snippet to the array of snippets
    snippets.push(newSnippet);

    // Save the updated array of snippets to chrome.storage.local
    chrome.storage.local.set({ snippets }, () => {
      console.log('Snippet saved with readable date');
    });
  });
});

chrome.tabs.onActivated.addListener(activeInfo => {
  const tabId = activeInfo.tabId;
  const currentTime = new Date();

  chrome.storage.local.get({snippets: []}, (result) => {
    let snippets = result.snippets;
    let found = snippets.find(snippet => snippet.id === tabId);

    if (found) {
      found.text = `Activated at: ${currentTime.toLocaleString()}`;
    } else {
      snippets.push({
        id: tabId,
        text: `Activated at: ${currentTime.toLocaleString()}`
      });
    }

    chrome.storage.local.set({snippets}, () => {
      console.log(`Tab ${tabId} activated and time updated.`);
    });
  });
});

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete') {
    const currentTime = new Date();

    chrome.storage.local.get({ snippets: [] }, (result) => {
      let snippets = result.snippets;
      let found = snippets.find(snippet => snippet.id === tabId);

      if (found) {
        found.text = `Updated at: ${currentTime.toLocaleString()}`;
      } else {
        snippets.push({
          id: tabId,
          text: `Updated at: ${currentTime.toLocaleString()}`
        });
      }

      chrome.storage.local.set({ snippets }, () => {
        console.log(`Tab ${tabId} updated and time updated.`);
      });
    });
  }
});
