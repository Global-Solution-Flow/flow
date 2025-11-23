import { Link } from 'react-router-dom';
import logo from '../../assets/logo-fluxo.jpg';

export function Header() {
  return (
    <header className="w-full bg-gray-800 p-4 shadow-md">
      <nav className="flex items-center justify-between px-6">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3">
          <img src={logo} alt="Flow Logo" className="h-10 w-10 rounded-full" />
          <span className="text-2xl font-bold text-white">Flow</span>
        </Link>

        {/* Links de Navegação */}
        <div className="flex gap-6">
          <Link
            to="/"
            className="text-gray-300 hover:text-blue-400 transition-colors"
          >
            Home
          </Link>
          <Link
            to="/estudio"
            className="text-gray-300 hover:text-blue-400 transition-colors"
          >
            Estúdio
          </Link>
          <Link
            to="/integrantes"
            className="text-gray-300 hover:text-blue-400 transition-colors"
          >
            Integrantes
          </Link>
        </div>
      </nav>
    </header>
  );
}