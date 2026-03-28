# PAM Cart Checker

A Google Chrome extension to ensure you never forget essential items when shopping online at the PAM supermarket.

---

## 👨‍💻 How to Build and Test Locally

This project is built using React, TypeScript, and Webpack.

### 1. Install Dependencies
Before doing anything, make sure you have all the necessary packages installed:
```bash
npm install
```

### 2. Start Local Development
To actively work on the code, start the watch server:
```bash
npm run dev
```
**What it does:** Builds the code into the `public/` folder and stays running in the background. Every time you save a `.ts` or `.tsx` file, it instantly recompiles the project. It also runs a background TypeScript checker to warn you of any code errors.

### 3. Load the Extension in Chrome
1. Open Google Chrome.
2. Navigate to `chrome://extensions/`.
3. Toggle on **Developer mode** in the top right corner.
4. Click **Load unpacked** in the top left.
5. Select this entire project folder (`pam-cart-checker`).

### 🔄 Testing Updates
While `npm run dev` is running:
- **Popup UI changes:** Just close and reopen the extension popup to see the changes instantly.
- **Content script changes:** Go back to `chrome://extensions/`, click the circular **Reload** icon on your extension's card, and then refresh the PAM website tab.

---

## 🚀 How to Release to GitHub

This project is equipped with a fully automated `release-it` pipeline. You do **not** need to manually build, zip, or edit version files.

### 1. The Pre-flight Checklist
- **Git must be clean:** Ensure you have committed all your code changes to Git (`git add .` and `git commit -m "..."`).
- **Use Conventional Commits:** When committing code, try to use prefixes like `feat: added emojis` or `fix: broken button`. This allows the script to automatically extract and group your release notes!

### 2. Fire the Release
```bash
npm run release
```

### 3. Follow the Prompts
An interactive menu will appear in your terminal:
1. Select whether this is a **Patch**, **Minor**, or **Major** update using your arrow keys.
2. Confirm the automatic Git commit and Tag.
3. Confirm that you want to push to GitHub Releases.

**What happens under the hood?**
- `npm` updates the version in your `package.json`.
- A background script identical updates `manifest.json`.
- A highly optimized production build is generated.
- A clean `.zip` file of your compiled code is created.
- `CHANGELOG.md` is automatically updated with your commit notes.
- Git commits all these changes and creates a new Tag.
- The `.zip` file and release notes are **automatically uploaded** to your GitHub repository's "Releases" tab!

### 🔑 GitHub Token (First-Time Setup Only)
The very first time you run `npm run release` and confirm the GitHub upload, it will fail and ask you for a GitHub Personal Access Token. 
1. Follow the link it prints in your terminal.
2. Create a classic token with the `repo` permission scope ticked.
3. Paste the token into your terminal (or follow the setup instructions to save it to your local environment). 
4. From then on, it will push to GitHub automatically!
