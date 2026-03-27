# PAM Cart Checker

A Google Chrome extension to ensure you never forget essential items when shopping online at the PAM supermarket.

## 🛠️ How to Build and Develop

This project is built using React, TypeScript, and Webpack.

### 1. Install Dependencies
Before doing anything, make sure you have all the necessary packages installed:
```bash
npm install
```

### 2. Available Commands

We have two main commands to build the extension, depending on what you are trying to do:

#### 🟢 Fast Local Development
```bash
npm run dev
```
**What it does:** Builds the code and stays running in the background. Every time you save a `.ts` or `.tsx` file, it instantly recompiles the project. It also runs a background TypeScript checker to warn you of any code errors.
*Note: On Windows, if you stop this command (Ctrl+C) you might occasionally see an `EPERM` error. This is a harmless Windows file-locking quirk, and your code still built perfectly.*

#### 🚀 Production Build (For Publishing)
```bash
npm run build
```
**What it does:** Runs a single, highly optimized build. It minifies the code, removes comments, and disables developer maps to make the output file as tiny as possible. Run this right before you ZIP the project for the Chrome Web Store.

---

### 3. How to Load the Extension in Chrome

Once you have run either of the commands above, Webpack will generate a `public/` folder containing the compiled code.

1. Open Google Chrome.
2. Navigate to `chrome://extensions/`.
3. Toggle on **Developer mode** in the top right corner.
4. Click **Load unpacked** in the top left.
5. Select this entire project folder (`pam-cart-checker`).

### 🔄 Testing Updates
If you are running `npm run dev`:
- **Popup UI changes:** Just close and reopen the extension popup to see the changes.
- **Content script changes:** Go to `chrome://extensions/`, click the circular **Reload** icon on the extension's card, and then refresh the PAM website tab.
