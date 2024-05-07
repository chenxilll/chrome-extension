# TabsOFF Chrome Extension

## Introduction

TabsOFF is a Chrome Extension designed to enhance productivity and efficiency for web users by organizing and managing open browser tabs. It helps users reduce clutter, improve memory usage on their PCs, and navigate open tabs more effectively.

## Installation

To install TabsOFF, follow these steps:

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/tabs-off.git
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

After building, load the unpacked extension into Chrome through the Extensions menu by enabling Developer mode and selecting 'Load unpacked extension'. Navigate to the build directory and select it.


## Chrome Extension Architecture

This project follows the Manifest V3 architecture for Chrome extensions. Key components of the architecture include:

- `manifest.json`: Defines the extension's metadata, permissions, and script configurations
- `background.js`: Runs in the background and handles events and long-running tasks
- `contentScript.js`: Injected into web pages to interact with the DOM and communicate with the background script **(not used here)**
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

## Contributing
Interested in contributing to TabsOFF? We welcome contributions of all forms. Here's how you can help:

1. Fork the repository and clone your fork.
2. Create a new branch for your feature or fix.
3. Submit a pull request with your changes.


## Credits

The initial setup of this project was based on the tutorial by [Harshita Joshi](https://github.com/Harshita-mindfire) on creating a Chrome extension with React and TypeScript. The corresponding Medium article can be found [here](https://medium.com/@tharshita13/creating-a-chrome-extension-with-react-a-step-by-step-guide-47fe9bab24a1). 

The project has been extended with additional functionality, testing setup, and documentation. The most difficult part was figuring out the right combination of packages for the testing suite (for instance, I would avoid `jest-chrome`, `mockzilla`, `mockzilla-webextension`, to name but a few).

As a base code was used this repository: https://github.com/CIS-3500/chrome-extension-react-typescript-starter
