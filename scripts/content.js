"use strict";
const PAM_CART_CHECKER_ID = 'pam-cart-checker';
const cart = document.querySelector('#cart');
if (cart) {
    cart.addEventListener('click', () => {
        onCartOpen();
    });
}
const onCartOpen = () => {
    console.log('cart was opened!');
    const scrollCart = document.querySelector('.scroll-cart');
    if (scrollCart) {
        // delete old list container
        const pamCartChecker = document.querySelector('#' + PAM_CART_CHECKER_ID);
        if (pamCartChecker) {
            pamCartChecker.remove();
        }
        // get missing products list
        const missingProds = getMissingProducts(scrollCart);
        // create new list container
        const div = document.createElement('div');
        div.id = PAM_CART_CHECKER_ID;
        div.style.background = missingProds.length ? '#f00' : '#009600';
        div.style.color = '#fff';
        div.style.padding = '25px';
        if (missingProds.length) {
            missingProds.map(prod => div.append('ATTENZIONE: ti manca ' + prod.name));
        }
        else {
            div.append('TUTTO OK: non ti manca alcun prodotto importante nel tuo carrello!');
        }
        scrollCart.prepend(div);
    }
};
const getMissingProducts = (scrollCart) => {
    const requiredProducts = [{ name: 'carletto' }];
    const cartProds = [...scrollCart.querySelectorAll('.cart-prod-name a')].map(el => { var _a, _b, _c; return (_c = (_b = (_a = el.textContent) === null || _a === void 0 ? void 0 : _a.toLowerCase()) === null || _b === void 0 ? void 0 : _b.trim()) !== null && _c !== void 0 ? _c : ''; });
    let missingProds = [];
    for (const prod of requiredProducts) {
        if (cartProds.find(cartProd => cartProd.includes(prod.name)) === undefined) {
            missingProds.push(prod);
        }
    }
    return missingProds;
};
