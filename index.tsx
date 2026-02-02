
import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import { setupMockBridge } from './MockElectron';

// Initialize mocks before rendering
setupMockBridge();

const container = document.getElementById('root');
if (container) {
  const root = createRoot(container);
  root.render(<App />);
}
