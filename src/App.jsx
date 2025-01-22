import React from 'react';
import Canvas from './components/Canvas';
import Toolbar from './components/Toolbar';

function App() {
  return (
    <div className="w-screen h-screen overflow-hidden bg-gray-50">
      <Toolbar />
      <Canvas />
    </div>
  );
}

export default App;