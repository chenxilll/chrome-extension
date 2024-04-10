let tabIdToDelete = "";
let windowIdToDelete = "";

// This function is called when the extension is installed or updated
chrome.runtime.onInstalled.addListener(() => {
  // Create a context menu item
  chrome.contextMenus.create({
    id: 'captureSnippet',
    title: 'Capture Snippet',
    contexts: ['selection'],
  });
});

// This function is called when a context menu item is clicked
chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === 'captureSnippet') {
    const selectedText = info.selectionText;

    // Retrieve the existing snippets from chrome.storage.local
    chrome.storage.local.get({ snippets: [] }, (result) => {
      const snippets = result.snippets;

      // Create a new snippet object with a unique ID, the selected text, and tab/window IDs
      const newSnippet = {
        id: Date.now(),
        text: selectedText,
        tabId: tab.id, // Associate the snippet with the tab it was created in
        windowId: tab.windowId, // Associate the snippet with the window it was created in
        time: Date.now(),
        url: tab.url,
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

chrome.tabs.onCreated.addListener((tab) => {
  chrome.storage.local.get({ snippets: [] }, (result) => {
    const snippets = result.snippets;

    const currentDate = new Date();
    const readableDate = currentDate.toLocaleString();

    const newSnippet = {
      id: Date.now(),
      text: `${tab.url}\nCreated at: ${readableDate}`,
      tabId: tab.id,
      windowId: tab.windowId,
      time: Date.now(),
      url: tab.url,
    };

    snippets.push(newSnippet);

    chrome.storage.local.set({ snippets }, () => {
      console.log('Snippet saved with tab and window IDs');
    });
  });
});

chrome.tabs.onActivated.addListener(activeInfo => {
  const tabId = activeInfo.tabId;
  const currentTime = new Date();

  chrome.storage.local.get({ snippets: [] }, (result) => {
    let snippets = result.snippets;
    snippets.sort((a, b) => a.time - b.time);
    const index = snippets.findIndex(snippet => snippet.id === tabIdToDelete);
    if (index !== -1) {
      snippets.splice(index, 1);
    }

    chrome.tabs.get(tabId, tab => {
      if (chrome.runtime.lastError || !tab) {
        console.error(chrome.runtime.lastError ? chrome.runtime.lastError.message : "Tab not found");
        return;
      }

      let found = snippets.find(snippet => snippet.tabId === tabId);

      if (found) {
        found.text = `${tab.title}\nActivated at: ${currentTime.toLocaleString()}`;
        found.time = Date.now();
      } else {
        snippets.push({
          id: tabId,
          text: `${tab.title}\nActivated at: ${currentTime.toLocaleString()}`,
          tabId: tabId,
          windowId: activeInfo.windowId,
          time: Date.now(),
          url: tab.url,
        });
      }

      chrome.storage.local.set({ snippets }, () => {
        console.log(`Tab ${tabId} activated and time updated.`);
      });
    });
  });
});

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete' && tab.title) {
    const currentTime = new Date();

    chrome.storage.local.get({ snippets: [] }, (result) => {
      let snippets = result.snippets;
      snippets.sort((a, b) => a.time - b.time);
      let found = snippets.find(snippet => snippet.tabId === tabId);

      const snippetText = `${tab.title}\nUpdated at: ${currentTime.toLocaleString()}`;

      if (found) {
        found.text = snippetText;
      } else {
        snippets.push({
          id: tabId,
          text: snippetText,
          tabId: tabId,
          windowId: tab.windowId,
          time: Date.now(),
          url: tab.url,
        });
      }

      chrome.storage.local.set({ snippets }, () => {
        console.log(`Tab ${tabId} updated and time updated.`);
      });
    });
  }
});

chrome.tabs.onRemoved.addListener(tabId => {
  tabIdToDelete = tabId;
  chrome.storage.local.get({ snippets: [] }, (result) => {
    let snippets = result.snippets;
    const index = snippets.findIndex(snippet => snippet.tabId === tabId);
    if (index !== -1) {
      snippets.splice(index, 1);
      chrome.storage.local.set({ snippets }, () => {
        console.log(`Tab ${tabId} removed and corresponding entry deleted.`);
      });
    }
  });
});

// This function handles window removal
chrome.windows.onRemoved.addListener(windowId => {
  windowIdToDelete = windowId;
  chrome.storage.local.get({ snippets: [] }, (result) => {
    let snippets = result.snippets;
    snippets = snippets.filter(snippet => snippet.windowId !== windowId);
    chrome.storage.local.set({ snippets }, () => {
      console.log(`All snippets associated with window ${windowId} removed.`);
    });
  });
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'navigateToTab' && message.tabId) {
    chrome.tabs.update(message.tabId, { active: true }, (tab) => {
      // Focus the window of the tab as well
      if (tab) {
        chrome.windows.update(tab.windowId, { focused: true });
      }
    });
  }
});
