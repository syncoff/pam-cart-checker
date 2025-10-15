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

    const cartProds = [...Array.from(scrollCart.querySelectorAll('.cart-prod-name a'))].map(el => el.textContent?.toLowerCase()?.trim() ?? '');

    let missingProds: string[] = [];

    for (const prod of requiredProducts) {
        if (cartProds.find(cartProd => cartProd.includes(prod.toLowerCase())) === undefined) {
            missingProds.push(prod);
        }
    }

    return missingProds;
};