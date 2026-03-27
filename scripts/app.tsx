import React, { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';
import DragIndicator from '../images/drag_indicator.svg';
import Fuse from 'fuse.js';

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

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) {
      return;
    }

    const items = Array.from(products);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setProducts(items);
    chrome.storage.sync.set({ productList: items });
  };

  const getProductEmoji = (productName: string) => {
    const emojiMap: { [key: string]: string } = {
      latte: '🥛',
      uova: '🥚',
      pane: '🍞',
      formaggio: '🧀',
      pollo: '🍗',
      carne: '🥩',
      pesce: '🐟',
      mela: '🍎',
      banana: '🍌',
      arancia: '🍊',
      limone: '🍋',
      fragola: '🍓',
      pomodoro: '🍅',
      patata: '🥔',
      cipolla: '🧅',
      carota: '🥕',
      aglio: '🧄',
      insalata: '🥗',
      verdura: '🥦',
      caffè: '☕',
      tè: '🍵',
      biscotti: '🍪',
      pasta: '🍝',
      riso: '🍚',
      pizza: '🍕',
      cioccolato: '🍫',
      gelato: '🍨',
      acqua: '💧',
      vino: '🍷',
      birra: '🍺',
      succo: '🧃',
      burro: '🧈',
      olio: '🫒',
      sale: '🧂'
    };

    const emojiData = Object.keys(emojiMap).map(key => ({ itemName: key, emoji: emojiMap[key] }));
    const fuse = new Fuse(emojiData, { keys: ['itemName'], threshold: 0.3 });
    const result = fuse.search(productName);

    if (result.length > 0) {
      return result[0].item.emoji;
    }
    return '🛒'; // Default emoji
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
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="products">
          {(provided) => (
            <ul {...provided.droppableProps} ref={provided.innerRef} style={{ padding: 0, marginTop: '10px' }}>
              {products.map((product, index) => (
                <Draggable key={product} draggableId={product} index={index}>
                  {(provided) => (
                    <li
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        background: index % 2 === 0 ? '#fafafa' : '#e8e8e8',
                        padding: '5px',
                        ...provided.draggableProps.style
                      }}
                    >
                      <img src={DragIndicator} alt="drag handle" style={{ marginRight: '10px' }} />
                      <span>{product}</span>
                      <div>
                        <span style={{ marginRight: '10px' }}>{getProductEmoji(product)}</span>
                        <button onClick={() => deleteProduct(product)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.2em' }}>
                          🗑️
                        </button>
                      </div>
                    </li>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </ul>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
};

export default App;