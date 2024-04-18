// This function is called when the user releases the mouse button (mouseup event)
document.addEventListener('mouseup', function (e) {
  // Get the selected text and remove any leading/trailing whitespace
  const selectedText = window.getSelection().toString().trim();

  // Check if any text is selected
  if (selectedText.length > 0) {
    // Send a message to the background script with the selected text
    chrome.runtime.sendMessage(
      { action: 'saveTab', data: selectedText },
      (response) => {
        // Log the response status from the background script
        console.log(response.status);
      }
    );
  }
});