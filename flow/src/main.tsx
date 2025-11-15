import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import './index.css';


import App from './App.tsx';
import { Home } from './pages/Home/Home.tsx';
import { Estudio } from './pages/Estudio/Estudio.tsx';
import { Integrantes } from './pages/Integrantes/Integrantes.tsx';

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      { path: '/', element: <Home /> },
      { path: '/estudio', element: <Estudio /> },
      { path: '/integrantes', element: <Integrantes /> },
    ],
  },
]);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
);