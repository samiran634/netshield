# Hate Speech Detection Extension - README

## Overview
This repository contains the source code for the **Hate Speech Detection Chrome Extension**. The extension uses AI to analyze and detect hate speech in YouTube comments in real-time.

## Table of Contents
- [Clone the Repository](#clone-the-repository)
- [Run the MVP Locally](#run-the-mvp-locally)
- [Load the Unpacked Extension](#load-the-unpacked-extension)
- [Project Structure](#project-structure)
- [Troubleshooting](#troubleshooting)
- [Contributing](#contributing)
- [License](#license)

---

## Clone the Repository

1. Open **GitHub** and navigate to the repository page.
2. Click the **Code** button and copy the repository URL.
3. Open a terminal or command prompt and run the following command:
   ```sh
   git clone https://github.com/samiran634/netshield.git
   ```
4. Change into the project directory:
   ```sh
   cd netshield
   ```

---

## Run the MVP Locally

The Minimum Viable Product (MVP) includes a simple **web-based demonstration** of how the AI detection works. To run it locally:

### Install Dependencies
1. Ensure you have **Node.js** installed. If not, download it from [nodejs.org](https://nodejs.org/).
2. Navigate to the project directory and install dependencies:
   ```sh
   npm install
   ```

### Start the Development Server
3. Run the following command to start the local server:
   ```sh
   npm run dev
   ```
4. Open a browser and go to **http://localhost:5173** to see the MVP in action.

---

## Load the Unpacked Extension

To test the **Chrome Extension** locally:

1. Open **Google Chrome** and go to `chrome://extensions/`.
2. Enable **Developer Mode** (toggle in the top-right corner).
3. Click **Load unpacked** and select the `extension/` folder from the cloned repository.
4. The extension will be added to Chrome.
5. Open YouTube and check if the extension detects and correctly flags comments.

---

## Project Structure
```
.
├── extension/            # Chrome Extension Source Code
│   └── extension.zip     #contains all the file needed to upload in chrome extension section 
│
├── mvp-demo/             # Web-based demonstration
│   ├── src/              # React/JavaScript frontend
│   ├── public/           # Static assets
│   ├── package.json      # Dependencies and scripts
│   └── index.js in index.html          # Entry point for the web demo
│
├── README.md             # Project documentation
└── .gitignore            # Files to ignore in GitHub
```

---

## Troubleshooting

### Issue: Extension Not Loading
✅ Make sure the `manifest.json` file is valid.
✅ Check Chrome Console (`Ctrl + Shift + J`) for errors.
✅ Reload the extension from `chrome://extensions/`.

### Issue: MVP Not Running
✅ Ensure **Node.js** and **npm** are installed.
✅ Run `npm install` before starting the server.
✅ If using a different port, change `http://localhost:3000` accordingly.

---

## License
This project is licensed under the **MIT License**.

---

Hope this will give a clear picture of our git reposetory

