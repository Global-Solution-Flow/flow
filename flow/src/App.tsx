import { Outlet } from 'react-router-dom';
import { Header } from './components/Header/Header.tsx';

function App() {
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Header />
      <main>
        <Outlet />
      </main>
    </div>
  );
}

export default App;