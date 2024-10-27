const PAM_CART_CHECKER_ID = 'pam-cart-checker';

type Product = {
    name: string;
};



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

const getMissingProducts = (scrollCart: Element) => {
    const requiredProducts: Product[] = [{ name: 'carletto' }];
    const cartProds = [...Array.from(scrollCart.querySelectorAll('.cart-prod-name a'))].map(el => el.textContent?.toLowerCase()?.trim() ?? '');

    let missingProds: Product[] = [];

    for (const prod of requiredProducts) {
        if (cartProds.find(cartProd => cartProd.includes(prod.name)) === undefined) {
            missingProds.push(prod);
        }
    }

    return missingProds;
};