import { Link } from 'react-router-dom';

export function Home() {
  return (
    <div className="min-h-[calc(100vh-80px)] bg-gray-900 text-white flex flex-col items-center justify-center p-8 text-center">
      <div className="max-w-3xl">
        <h1 className="text-5xl md:text-6xl font-extrabold mb-6 bg-linear-to-r from-blue-700 to-blue-400 bg-clip-text text-transparent animate-pulse">
          Flow
        </h1>
        <h2 className="text-2xl md:text-3xl font-semibold mb-4 text-gray-200">
          Otimização Industrial 4.0
        </h2>
        
        <p className="text-lg text-gray-400 mb-10 leading-relaxed max-w-2xl mx-auto">
          Simule, analise e revolucione sua linha de produção com Inteligência Artificial.
          Conecte máquinas, identifique gargalos e aumente a eficiência em tempo real.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link 
            to="/estudio" 
            className="px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-lg shadow-lg transition-all transform hover:scale-105 flex items-center justify-center gap-2"
          >
            <span>🚀</span> Começar Agora
          </Link>
          
          <Link 
            to="/integrantes" 
            className="px-8 py-4 bg-gray-800 border border-gray-700 hover:bg-gray-700 text-gray-300 font-bold rounded-lg transition-colors"
          >
            Sobre a Equipe
          </Link>
        </div>
      </div>
    </div>
  );
}