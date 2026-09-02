import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import { registerSW } from 'virtual:pwa-register';

// Enregistrement automatique du Service Worker avec mise à jour immédiate
const updateSW = registerSW({
  onNeedRefresh() {
    console.log('Nouvelle version de Vélococos disponible. Mise à jour...');
    updateSW(true);
  },
  onOfflineReady() {
    console.log('Vélococos est 100% prêt pour une utilisation hors ligne.');
  },
});

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>
);
