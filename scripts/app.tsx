import React, { useState, useEffect } from 'react';

const App: React.FC = () => {
  const [products, setProducts] = useState<string[]>([]);
  const [newProduct, setNewProduct] = useState('');

  useEffect(() => {
    chrome.storage.sync.get(['productList'], (result) => {
      if (result.productList) {
        setProducts(result.productList);
      }
    });
  }, []);

  const addProduct = () => {
    if (newProduct.trim() !== '') {
      const updatedProducts = [...products, newProduct];
      setProducts(updatedProducts);
      chrome.storage.sync.set({ productList: updatedProducts });
      setNewProduct('');
    }
  };

  const deleteProduct = (productToDelete: string) => {
    const updatedProducts = products.filter(product => product !== productToDelete);
    setProducts(updatedProducts);
    chrome.storage.sync.set({ productList: updatedProducts });
  };

  return (
    <div style={{ width: '400px' }}>
      <h1>PAM cart checker</h1>
      <p>Crea la tua lista di prodotti indispensabili!</p>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <input
          type="text"
          value={newProduct}
          onChange={(e) => setNewProduct(e.target.value)}
          placeholder="Add a new product"
          style={{ flexGrow: 1, marginRight: '10px' }}
        />
        <button onClick={addProduct} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.5em' }}>
          +
        </button>
      </div>
      <ul style={{ padding: 0, marginTop: '10px' }}>
        {products.map((product, index) => (
          <li
            key={index}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              background: index % 2 === 0 ? '#fafafa' : '#e8e8e8',
              padding: '5px'
            }}
          >
            <span>{product}</span>
            <button onClick={() => deleteProduct(product)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.2em' }}>
              🗑️
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default App;