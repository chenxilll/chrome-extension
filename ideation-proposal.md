# Chrome Extension Idea: TabsOFF

## Authors

Brian Lu, Boya Zeng, Chenxi Leng, Ani Petrosyan

## Problem Statement

Modern web users frequently keep numerous, cluttered tabs open for long periods, possibly to revisit later. Yet, managing these tabs and recalling to review or close them can be overwhelming. They not only consume memory on the PC but also reduce work efficiency. Currently, there's a shortage of effective tools designed for tab organization and for prompting users to address long-neglected, unused tabs.

## Target Audience

- Professionals who research or work with multiple web resources simultaneously
- Students who open multiple tabs for study materials and research papers
- Anyone who tends to keep tabs open for extended periods, planning to revisit them later

## Description

TabsOFF is a Chrome Extension that intelligently organizes open tabs by time/days unused, helping users reduce clutter and navigate between them efficiently. Additionally, it features a unique reminder system that notifies users to review tabs that have been open and unused for more than a day, encouraging a cleaner, more organized browsing experience.

## Selling Points

1. Provides categorization of tabs based on how long they’ve been opened.
2. Reminds users to review tabs that have been open but unused for over a day, helping reduce clutter and improve browser performance.
3. Offers a sleek, user-friendly interface for managing and organizing tabs, with customizable categories and reminders.
4. Saves memory and improves browser performance by encouraging the closure of unnecessary tabs.
5. Enhances productivity and focus by minimizing distractions from excessive, unused tabs.

## User Stories
1. As a student, I want to be reminded to review or close research tabs I haven't used in over a week so I can keep my study space tidy and distraction-free.
2. As a user, I want to customize the reminder timeframe to align with my personal preferences, so that the reminders are both relevant and timely.
3. As an online shopper who opens many product tabs, I want to be notified to revisit or close these tabs after a certain period, helping me make purchasing decisions faster and keeping my browser organized.
4. As a digital marketer who frequently analyzes different websites and social media platforms, I want TabsOFF to highlight tabs that I haven't interacted with in over 48 hours, prompting me to review or close them to maintain a clean workspace.
5. As an academic researcher, I often open tabs related to various research papers and resources. I want TabsOFF to automatically save the URLs of long-unused tabs to a specified document before closing them, ensuring I don't lose important references.
6. As a user concerned with privacy, I want TabsOFF to offer a feature that automatically closes tabs containing sensitive information if they've been left unattended for a certain period, helping me safeguard my personal data.
7. As a productivity enthusiast, I want to track the amount of time I spend on different websites through TabsOFF, enabling me to identify and reduce time spent on unproductive or distracting sites.
8. As a stay-at-home parent managing household tasks and online activities, I want TabsOFF to remind me to review tabs related to shopping, recipes, and family activities so that I can stay organized and efficient in managing my daily responsibilities.
9. As a professional working from home, I want TabsOFF to automatically close tabs that I haven't accessed in over 72 hours, except for those I've marked as important, so my browser stays clean and efficient without manual intervention.
10. As a financial analyst conducting research on market trends, I want TabsOFF to provide insights into my browsing habits and suggest ways to improve my tab organization so that I can make more informed investment decisions.
11. As an individual conscious about browser performance, I want TabsOFF to provide statistics on how many tabs were closed and how much memory was freed up weekly, motivating me to maintain a cleaner browser environment.
12. As a project manager constantly juggling tasks, I need TabsOFF to only remind me about non-essential tabs during my scheduled review times, so I can focus on critical work without distraction but still declutter my workspace at designated times.
13. As a user concerned about losing track of important tabs, I want the option to set specific tabs as "Do Not Close," allowing me to keep essential tabs open indefinitely without them being automatically closed by TabsOFF.
14. As someone who uses the browser for leisure reading, I'd like TabsOFF to suggest closing tabs related to articles or blogs if they've been open for more than a few days, helping me manage my leisure time more effectively.
15. As a software developer researching different technologies, I want TabsOFF to save memory and improve browser performance by encouraging the closure of unnecessary tabs so that I can work more efficiently.


## References & Inspiration
[Arc browser](https://arc.net/)

## Technical Details
### User Interface
Key Elements:
Pop-Up Dashboard: Quick overview of unused tabs categorized by the last accessed time.

Sidebar for Detailed Organization: A collapsible sidebar that categorizes tabs more extensively.

Settings Menu: For customizing reminders, categories, and extension behavior.

Notification System: Non-intrusive reminders will appear as browser notifications.


### Chrome UI/UX Elements Utilized:
Browser Action: For displaying the main dashboard through a pop-up.

Notifications: To remind users about reviewing or closing long-unused tabs.

Context Menus: Right-click menu options on tabs for quickly saving, deletion, or categorization.


### API, Libraries, and Frameworks

Chrome Tabs API: For managing and organizing browser tabs. (https://developer.chrome.com/docs/extensions/reference/api/tabs) Chrome Tabs API Documentation

Vue.js (https://vuejs.org/) or React (https://react.dev/): A progressive framework for building user interfaces. It will be used for creating the extension's UI components. Vue.js/React Documentation

Firebase (https://firebase.google.com/): For storing user preferences and tab categories in a cloud database, enabling sync across devices. Firebase Documentation

### Data Storage
TabsOFF will store data such as user preferences (reminder frequency, categories, etc.), categorized tabs, and possibly tab session snapshots for restoring. The data structure will include:

User Preferences: Key-value pairs for settings like reminder frequency and categories.

Categorized Tabs: Objects containing tab information (URL, title, last access time) categorized by the last usage time.

Tab Sessions: Arrays of tab objects for users who wish to restore previously closed sessions.

## Project Management
### Collaboration and Task Allocation
Leader: Boya- Visionary of the project, responsible for the overall direction and final decisions.

Manager: Chenxi -  In charge of project management, ensuring team collaboration and task completion.
Remaining Team Members: Ani, Brian

API, UI, storage, testing and integration, task management (kanban)

Ani: API

Brian: testing and integration

Chenxi: UI

Boya: storage

We meet in person at least once a week to work together and we will be experimenting and researching on our own time. We will use Slack to communicate and use GitHub to share code. Task management will be handled through Kanban. 

### Risks and Mitigation
Risk 1: Incompatibility with future browser updates.

Mitigation 1: Continuous integration and testing with the latest browser versions.

Risk 2: Low user adoption due to privacy concerns.

Mitigation 2: Transparent privacy policy and optional data collection features.


### Milestones and Timeline
Week 1: Set up the project repository, define the initial project structure, and start on basic UI components.

Week 2: Develop core functionalities for tab management and reminders. Implement data storage solutions.

Week 3: Polish UI/UX, integrate with the Chrome API, and begin internal testing.

Week 4: Finalize features, conduct beta testing, and prepare for launch.
