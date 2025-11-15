// Preencha com seus dados e do seu parceiro!
const INTEGRANTES = [
  {
    nome: 'Gabriel Bebé Silva',
    rm: 'RM562012',
    turma: '1TDSPO',
    fotoUrl: 'https://github.com/Gabriel24701.png',
    githubUrl: 'https://github.com/Gabriel24701',
    linkedinUrl: 'https://www.linkedin.com/in/gabriel-bebé-298815238/',
  },
  {
    nome: 'Pedro Ferreira Gomes',
    rm: 'RM565824',
    turma: '1TDSPO',
    fotoUrl: 'https://github.com/Ferreira2120.png',
    githubUrl: 'https://github.com/Ferreira2120',
    linkedinUrl: 'https://www.linkedin.com/in/pedro-ferreira-a762532bb/',
  },
];

export function Integrantes() {
  return (
    <div className="p-8 max-w-6xl mx-auto">
      <h1 className="text-4xl font-bold mb-8 text-center">
        Equipe do Projeto Flow
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {INTEGRANTES.map((dev) => (
          <div
            key={dev.rm}
            className="bg-gray-800 p-6 rounded-lg flex flex-col items-center shadow-lg"
          >
            <img
              src={dev.fotoUrl}
              alt={dev.nome}
              className="w-32 h-32 rounded-full mb-4 border-4 border-blue-400"
            />
            <h2 className="text-2xl font-bold">{dev.nome}</h2>
            <p className="text-lg text-blue-300">
              {dev.rm} | {dev.turma}
            </p>
            <div className="flex gap-4 mt-6">
              <a
                href={dev.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-blue-400"
              >
                GitHub
              </a>
              <a
                href={dev.linkedinUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-blue-400"
              >
                LinkedIn
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}