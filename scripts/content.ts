import Fuse from 'fuse.js';

const PAM_CART_CHECKER_ID = 'pam-cart-checker';

const cart = document.querySelector('#cart');
if (cart) {
    cart.addEventListener('click', async () => {
        await onCartOpen();
    });
}

const onCartOpen = async () => {
    console.log('cart was opened!');

    const scrollCart = document.querySelector('.scroll-cart');
    if (scrollCart) {
        // delete old list container
        const pamCartChecker = document.querySelector('#' + PAM_CART_CHECKER_ID);
        if (pamCartChecker) {
            pamCartChecker.remove();
        }

        // get missing products list
        const missingProds = await getMissingProducts(scrollCart);

        // create new list container
        const div = document.createElement('div');
        div.id = PAM_CART_CHECKER_ID;
        div.style.background = missingProds.length ? '#f00' : '#009600';
        div.style.color = '#fff';
        div.style.padding = '25px';
        if (missingProds.length) {
            const p = document.createElement('p');
            p.textContent = 'ATTENZIONE, i seguenti prodotti mancano nel tuo carrello:';
            const ul = document.createElement('ul');
            ul.style.padding = '0 20px';
            missingProds.forEach(prod => {
                const li = document.createElement('li');
                li.textContent = prod;
                ul.appendChild(li);
            });
            div.appendChild(p);
            div.appendChild(ul);
        }
        else {
            div.append('TUTTO OK: non ti manca alcun prodotto importante nel tuo carrello!');
        }

        scrollCart.prepend(div);
    }
};

const getMissingProducts = async (scrollCart: Element) => {
    const data = await chrome.storage.sync.get(['productList']);
    const requiredProducts: string[] = data.productList || [];

    const cartProds = [...Array.from(scrollCart.querySelectorAll('.cart-prod-name a'))].map(el => el.textContent?.trim() ?? '');

    const fuse = new Fuse(cartProds, {
        includeScore: true,
        threshold: 0.4, // Matches decently well even with slightly different spellings or plurals
        ignoreLocation: true // Search anywhere in the cart string
    });

    let missingProds: string[] = [];

    for (const prod of requiredProducts) {
        const results = fuse.search(prod);
        // If we don't find any results with a decent score, it's missing
        if (results.length === 0) {
            missingProds.push(prod);
        }
    }

    return missingProds;
};

// --- INJECTION LOGIC ---

// Factory function to create a stateful button
const createActionBtn = (productName: string, requiredProducts: string[]) => {
    const btn = document.createElement('button');
    btn.className = 'pam-action-btn'; // Use a class, as there could be multiple on screen
    btn.style.marginTop = '10px';
    btn.style.padding = '8px 16px';
    btn.style.border = 'none';
    btn.style.borderRadius = '4px';
    btn.style.cursor = 'pointer';
    btn.style.fontWeight = 'bold';
    btn.style.transition = 'background-color 0.2s';
    btn.style.width = '100%';

    const setButtonState = (isAdded: boolean) => {
        if (isAdded) {
            btn.textContent = '➖ Rimuovi dal cart checker';
            btn.style.backgroundColor = '#dc3545';
            btn.style.color = '#fff';
            btn.onmouseover = () => btn.style.backgroundColor = '#c82333';
            btn.onmouseout = () => btn.style.backgroundColor = '#dc3545';
        } else {
            btn.textContent = '➕ Aggiungi al cart checker';
            btn.style.backgroundColor = '#0056b3';
            btn.style.color = '#fff';
            btn.onmouseover = () => btn.style.backgroundColor = '#004494';
            btn.onmouseout = () => btn.style.backgroundColor = '#0056b3';
        }
    };

    let isAdded = requiredProducts.includes(productName);
    setButtonState(isAdded);

    // Click handler
    btn.onclick = async (e) => {
        e.preventDefault(); // Stop links from firing if inside an <a> tag
        e.stopPropagation();

        btn.disabled = true; // Prevent double clicks
        
        // Always fetch fresh data exactly on click to ensure sync across multiple tabs
        const data = await chrome.storage.sync.get(['productList']);
        let freshProducts: string[] = data.productList || [];
        const currentlyAdded = freshProducts.includes(productName);

        if (currentlyAdded) {
            freshProducts = freshProducts.filter(p => p !== productName);
            await chrome.storage.sync.set({ productList: freshProducts });
            
            btn.textContent = '✔ Rimosso dalla lista';
            btn.style.backgroundColor = '#009600';
            btn.onmouseover = null;
            btn.onmouseout = null;
            
            setTimeout(() => {
                setButtonState(false);
                btn.disabled = false;
            }, 2000);
        } else {
            freshProducts.push(productName);
            await chrome.storage.sync.set({ productList: freshProducts });
            
            btn.textContent = '✔ Aggiunto alla lista';
            btn.style.backgroundColor = '#009600';
            btn.onmouseover = null;
            btn.onmouseout = null;
            
            setTimeout(() => {
                setButtonState(true);
                btn.disabled = false;
            }, 2000);
        }
    };

    return btn;
};

// 1. Single Product Popup Injector
const injectSingleProductBtn = (requiredProducts: string[]) => {
    // Look for the product info container and its header
    const productInfo = document.querySelector('.popup-product-info');
    if (!productInfo) return;

    // Skip if button already exists in this popup
    if (productInfo.querySelector('.pam-action-btn')) return;

    const titleEl = productInfo.querySelector('h2');
    if (!titleEl) return;

    const productName = titleEl.textContent?.trim();
    if (!productName) return;

    const btn = createActionBtn(productName, requiredProducts);
    
    // Insert the button right after the product title
    titleEl.parentNode?.insertBefore(btn, titleEl.nextSibling);
};

// 2. Product Catalog List Injector
const injectListButtons = (requiredProducts: string[]) => {
    const listItems = document.querySelectorAll('.product-list .list-item');
    if (listItems.length === 0) return;

    listItems.forEach(item => {
        // Skip if button already exists in this specific card
        if (item.querySelector('.pam-action-btn')) return;

        // Use the exact selector provided by the user
        const titleEl = item.querySelector('.product-info h3[itemprop="name"]');
        if (!titleEl) return;

        const productName = titleEl.textContent?.trim();
        if (!productName) return;

        const bottomInfo = item.querySelector('.product-info-bottom');
        if (!bottomInfo) return;

        const btn = createActionBtn(productName, requiredProducts);
        
        // Override default popup styles to make it smaller and fit the card layout
        btn.style.width = 'calc(100% - 20px)';
        btn.style.margin = '5px 10px 10px 10px';
        btn.style.padding = '4px 8px';
        btn.style.fontSize = '12px';
        
        // Append right AFTER the bottomInfo container so it doesn't break their flex layout!
        bottomInfo.parentNode?.insertBefore(btn, bottomInfo.nextSibling);
    });
};

// --- MUTATION OBSERVER ---

// State lock to prevent spamming Chrome Storage API on rapid DOM changes
let isUpdating = false;

const runInjectors = async () => {
    if (isUpdating) return;
    isUpdating = true;

    try {
        // Fetch list exactly ONCE per DOM mutation batch
        const data = await chrome.storage.sync.get(['productList']);
        const requiredProducts: string[] = data.productList || [];

        injectSingleProductBtn(requiredProducts);
        injectListButtons(requiredProducts);
    } finally {
        isUpdating = false;
    }
};

const observer = new MutationObserver(() => {
    runInjectors();
});

// Start observing the entire document body
observer.observe(document.body, { childList: true, subtree: true });

// Run once immediately on page load
runInjectors();