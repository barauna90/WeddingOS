
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';

console.log("WeddingOS: Inicializando sistema...");

const rootElement = document.getElementById('root');

if (!rootElement) {
  console.error("ERRO CRÍTICO: Elemento #root não encontrado.");
} else {
  try {
    const root = ReactDOM.createRoot(rootElement);
    root.render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );
    console.log("WeddingOS: Montagem concluída com sucesso.");
  } catch (error) {
    console.error("Erro fatal durante a montagem do React:", error);
    const display = document.getElementById('error-display');
    if (display) {
      display.style.display = 'block';
      display.innerHTML += `<p>Falha na renderização: ${error.message}</p>`;
    }
  }
}
