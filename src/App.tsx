// src/App.tsx
import React from 'react';
import { ReactFlowProvider } from 'reactflow';
import OrganizationChart from './components/OrganizationChart';
import './App.css';

const App: React.FC = () => {
  return (
    <div className="app">
      <header className="app-header">
        <h1>組織図マップ</h1>
      </header>
      <main className="app-main">
        <ReactFlowProvider>
          <OrganizationChart />
        </ReactFlowProvider>
      </main>
    </div>
  );
};

export default App;
