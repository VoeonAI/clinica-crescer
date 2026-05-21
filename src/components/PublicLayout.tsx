import React from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { SEOHead } from './SEOHead';
import { MedicalClinicSchema } from './Schemas';

const PublicLayout: React.FC = () => {
  const location = useLocation();

  const navItems = [
    { path: '/', label: 'Início' },
    { path: '/sobre', label: 'Sobre' },
    { path: '/equipe', label: 'Equipe' },
    { path: '/como-saber-se-meu-filho-precisa-de-ajuda', label: 'Precisa de Ajuda?' },
    { path: '/avaliacao-neuropsicologica', label: 'Avaliação' },
    { path: '/terapia-aba', label: 'Terapia ABA' },
    { path: '/blog', label: 'Blog' },
  ];

  const currentPath = location.pathname;

  return (
    <div className="min-h-screen bg-background">
      <SEOHead />
      <MedicalClinicSchema />

      {/* Header */}
      <header className="border-b bg-white">
        <div className="container mx-auto px-4">
          <nav className="flex items-center justify-between h-16">
            <Link to="/" className="text-2xl font-bold text-primary">
              Clínica Crescer
            </Link>

            {/* Desktop Navigation */}
            <ul className="hidden md:flex space-x-6">
              {navItems.map((item) => (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    className={`text-sm font-medium transition-colors hover:text-primary ${
                      currentPath === item.path ? 'text-primary' : 'text-muted-foreground'
                    }`}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>

            <Link to="/admin/login" className="text-sm text-muted-foreground hover:text-primary">
              Admin
            </Link>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main>
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="border-t bg-white mt-auto">
        <div className="container mx-auto px-4 py-8">
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <h3 className="font-semibold mb-4">Clínica Crescer</h3>
              <p className="text-sm text-muted-foreground">
                Especializada em desenvolvimento infantil e neuropsicologia.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Links Rápidos</h3>
              <ul className="space-y-2 text-sm">
                {navItems.map((item) => (
                  <li key={item.path}>
                    <Link to={item.path} className="text-muted-foreground hover:text-primary">
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Contato</h3>
              <p className="text-sm text-muted-foreground">
                Informações de contato serão adicionadas aqui.
              </p>
            </div>
          </div>
          <div className="border-t mt-8 pt-8 text-center text-sm text-muted-foreground">
            © {new Date().getFullYear()} Clínica Crescer. Todos os direitos reservados.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default PublicLayout;