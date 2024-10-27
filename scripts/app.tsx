import React, { useState } from 'react';

const App: React.FC = () => {
  const [bobo, setBobo] = useState('bobo');


  return (
    <div onClick={() => setBobo('aaaa')}>
      <h1>Supermarket Checkee</h1>
      <p>Create your list of indispensable items! {bobo}</p>
    </div>
  );
};

export default App;