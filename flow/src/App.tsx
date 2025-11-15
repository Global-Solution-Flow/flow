import { Outlet } from 'react-router-dom';
import { Header } from './components/Header/Header.tsx';

function App() {
  return (

    <div className="min-h-screen bg-gray-900 text-white">
      <Header />
      <main>
        {/* O Outlet renderiza a página da rota atual (Home, Estudio, etc.) */}
        <Outlet />
      </main>
    </div>
  );
}

export default App;