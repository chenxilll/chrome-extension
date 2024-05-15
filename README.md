# TabsOFF Chrome Extension

## Introduction

TabsOFF is a Chrome Extension designed to enhance productivity and efficiency for web users by organizing and managing open browser tabs. It helps users reduce clutter, improve memory usage on their PCs, and navigate open tabs more effectively.

Landing Page: https://github.com/Brian-program/TabsOFF-Landing-Page
Development Team: Ani Petrosyan, Boya Zeng, Brian Lu, Chenxi Leng

## Screenshots

TabsOFF provides an intuitive interface to help users manage browser tabs efficiently. Here are screenshots demonstrating its key features:

### Popup Interface

![Popup Interface](/screenshot-popup-interface.png)

The Popup interface allows users to quickly sort tabs based on how long they've been open. Options include sorting tabs that have been open for more than a week, more than half a day, more than 20 seconds, or more than 10 seconds. This feature is instrumental in managing tab clutter and improving browser performance.

### Tab Management

![Tab Management](/screenshot-tab-management.png)

Tabs are organized and displayed according to the duration they have been open. The interface updates dynamically as new tabs meet the time criteria set by the user, making it easy to track and manage extensive browsing sessions.

## Video Demonstration
Watch our video demonstrating TabsOFF's features and benefits: https://www.youtube.com/watch?v=pb-IMMrBP1I

## Installation

To install TabsOFF, follow these steps:

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/chrome-extension.git
   ```
   
2. Navigate to the project directory:
   ```bash
   cd chrome-extension
   ```

4. Install the necessary packages:
   ```bash
   npm install
   ```

## Usage
To build the extension, run:
   ```bash
   npm run build
   ```

Load the extension in Chrome:

1. **Open Chrome:** Navigate to `chrome://extensions` in your Chrome browser.

2. **Enable Developer Mode:** Toggle on the 'Developer mode' at the top-right of the Extensions page.

3. **Load Extension:**
   - Click on `Load unpacked`.
   - Select the `dist` directory from the project folder

## Chrome Extension Architecture

This project follows the Manifest V3 architecture for Chrome extensions. Key components of the architecture include:

- `manifest.json`: Defines the extension's metadata, permissions, and script configurations
- `background.js`: Manages Chrome events, such as tab creation, update, activation, and removal, and integrates context menu interactions, while persisting tab information in local storage
- `contentScript.js`: Injects into web pages to capture user-selected text via mouse events and communicates this data to the background script for processing and storage
- `App.tsx`: Manages state, handles user interactions, and dynamically organizes browser tabs into categories based on user-defined thresholds
- Popup window: Displays the extension's user interface when the extension icon is clicked


## Testing

The project includes a comprehensive testing setup using Jest, Sinon, and sinon-chrome. The tests cover various aspects of the extension, including component rendering, user interactions, and mocking of Chrome APIs.

To run the tests:

```bash
npm run test
```

To generate a coverage report:

```bash
npm run coverage
```

## Reporting Issues
If you encounter any issues or bugs, please report them by opening an issue on our GitHub repository. Provide detailed information about the problem, including steps to reproduce it, screenshots, and any relevant error messages.

## Contributing
Interested in contributing to TabsOFF? We welcome contributions of all forms. Here's how you can help:

1. Fork the repository and clone your fork.
2. Create a new branch for your feature or fix.
3. Submit a pull request with your changes.


## Credits

The initial setup of this project was based on the tutorial by [Harshita Joshi](https://github.com/Harshita-mindfire) on creating a Chrome extension with React and TypeScript. The corresponding Medium article can be found [here](https://medium.com/@tharshita13/creating-a-chrome-extension-with-react-a-step-by-step-guide-47fe9bab24a1). 

The project has been extended with additional functionality, testing setup, and documentation. The most difficult part was figuring out the right combination of packages for the testing suite (for instance, I would avoid `jest-chrome`, `mockzilla`, `mockzilla-webextension`, to name but a few).

As a base code was used this repository: https://github.com/CIS-3500/chrome-extension-react-typescript-starter
