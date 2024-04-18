let tabIdToDelete = "";
let windowIdToDelete = "";

// This function is called when the extension is installed or updated
chrome.runtime.onInstalled.addListener(() => {
  // Create a context menu item
  chrome.contextMenus.create({
    id: 'captureTab',
    title: 'Capture Tab',
    contexts: ['selection'],
  });
});

// This function is called when a context menu item is clicked
chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === 'captureTab') {
    const selectedText = info.selectionText;

    // Retrieve the existing tabs from chrome.storage.local
    chrome.storage.local.get({ tabs: [] }, (result) => {
      const tabs = result.tabs;

      // Create a new tab object with a unique ID, the selected text, and tab/window IDs
      const newTab = {
        id: Date.now(),
        text: selectedText,
        tabId: tab.id, // Associate the tab with the tab it was created in
        windowId: tab.windowId, // Associate the tab with the window it was created in
        time: Date.now(),
        url: tab.url,
      };

      // Add the new tab to the array of tabs
      tabs.push(newTab);

      // Save the updated array of tabs to chrome.storage.local
      chrome.storage.local.set({ tabs }, () => {
        console.log('Tab saved');
      });
    });
  }
});

chrome.tabs.onCreated.addListener((tab) => {
  chrome.storage.local.get({ tabs: [] }, (result) => {
    const tabs = result.tabs;

    const currentDate = new Date();
    const readableDate = currentDate.toLocaleString();

    const newTab = {
      id: Date.now(),
      text: `${tab.url}\nCreated at: ${readableDate}`,
      tabId: tab.id,
      windowId: tab.windowId,
      time: Date.now(),
      url: tab.url,
    };

    tabs.push(newTab);

    chrome.storage.local.set({ tabs }, () => {
      console.log('Tab saved with tab and window IDs');
    });
  });
});

chrome.tabs.onActivated.addListener(activeInfo => {
  const tabId = activeInfo.tabId;
  const currentTime = new Date();

  chrome.storage.local.get({ tabs: [] }, (result) => {
    let tabs = result.tabs;
    tabs.sort((a, b) => a.time - b.time);
    const index = tabs.findIndex(tab => tab.id === tabIdToDelete);
    if (index !== -1) {
      tabs.splice(index, 1);
    }

    chrome.tabs.get(tabId, tab => {
      if (chrome.runtime.lastError || !tab) {
        console.error(chrome.runtime.lastError ? chrome.runtime.lastError.message : "Tab not found");
        return;
      }

      let found = tabs.find(tab => tab.tabId === tabId);

      if (found) {
        found.text = `${tab.title}\nActivated at: ${currentTime.toLocaleString()}`;
        found.time = Date.now();
      } else {
        tabs.push({
          id: tabId,
          text: `${tab.title}\nActivated at: ${currentTime.toLocaleString()}`,
          tabId: tabId,
          windowId: activeInfo.windowId,
          time: Date.now(),
          url: tab.url,
        });
      }

      chrome.storage.local.set({ tabs }, () => {
        console.log(`Tab ${tabId} activated and time updated.`);
      });
    });
  });
});

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete' && tab.title) {
    const currentTime = new Date();

    chrome.storage.local.get({ tabs: [] }, (result) => {
      let tabs = result.tabs;
      tabs.sort((a, b) => a.time - b.time);
      let found = tabs.find(tab => tab.tabId === tabId);

      const tabText = `${tab.title}\nUpdated at: ${currentTime.toLocaleString()}`;

      if (found) {
        found.text = tabText;
      } else {
        tabs.push({
          id: tabId,
          text: tabText,
          tabId: tabId,
          windowId: tab.windowId,
          time: Date.now(),
          url: tab.url,
        });
      }

      chrome.storage.local.set({ tabs }, () => {
        console.log(`Tab ${tabId} updated and time updated.`);
      });
    });
  }
});

chrome.tabs.onRemoved.addListener(tabId => {
  tabIdToDelete = tabId;
  chrome.storage.local.get({ tabs: [] }, (result) => {
    let tabs = result.tabs;
    const index = tabs.findIndex(tab => tab.tabId === tabId);
    if (index !== -1) {
      tabs.splice(index, 1);
      chrome.storage.local.set({ tabs }, () => {
        console.log(`Tab ${tabId} removed and corresponding entry deleted.`);
      });
    }
  });
});

// This function handles window removal
chrome.windows.onRemoved.addListener(windowId => {
  windowIdToDelete = windowId;
  chrome.storage.local.get({ tabs: [] }, (result) => {
    let tabs = result.tabs;
    tabs = tabs.filter(tab => tab.windowId !== windowId);
    chrome.storage.local.set({ tabs }, () => {
      console.log(`All tabs associated with window ${windowId} removed.`);
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
