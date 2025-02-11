'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Menu, X, Home, LogIn, User, LogOut } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import ProtectedLink from './ProtectLink';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Obtenha o usuário, token e a função de logout a partir do contexto de autenticação
  const { user, token, logout } = useAuth();

  useEffect(() => {
    // Lógica adicional se necessário, mas o token já é gerido pelo AuthContext
  }, [token]);

  const toggleMenu = () => {
    setIsMenuOpen(prev => !prev);
  };

  const handleLogout = () => {
    logout(); // Chama a função logout do contexto para deslogar
  };

  return (
    <header className="bg-[#004022] text-white shadow-md top-0 w-full z-50 print:hidden">
      <nav className="bg-[#004022]">
        <div className="max-w-screen-xl flex flex-col lg:flex-row items-center justify-between mx-auto p-4">
          <div className="flex items-center space-x-8 mb-4 lg:mb-0">
            <ProtectedLink href="/">
              <img src="/ppscanner.svg" className="h-[4rem] w-auto" alt="Logo" />
            </ProtectedLink>
            <button
              onClick={toggleMenu}
              type="button"
              className="md:hidden inline-flex items-center p-2 w-10 h-10 justify-center text-white rounded-lg hover:bg-[#4b6b65] focus:outline-none focus:ring-2 focus:ring-[#4b6b65]"
              aria-controls="navbar-default"
              aria-expanded={isMenuOpen}
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          <div
            className={`${isMenuOpen ? 'block' : 'hidden'} w-full md:flex md:items-center md:w-auto overflow-visible`}
            id="navbar-default"
          >
            <ul className="font-medium flex flex-col p-4 md:flex-row md:space-x-8 w-full md:w-auto border border-gray-100 rounded-lg bg-[#004022] md:mt-0 md:border-0 md:bg-transparent">
              <li className="flex-1 md:flex-none">
                <ProtectedLink href="/add-companies">
                  <div className="group flex items-center justify-center py-3 px-4 text-white hover:text-gray-300 relative">
                    Adicionar Empresa
                    <span className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-[#004022] to-white scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></span>
                  </div>
                </ProtectedLink>
              </li>
              <li className="flex-1 md:flex-none">
                <ProtectedLink href="/companies">
                  <div className="group flex items-center justify-center py-3 px-4 text-white hover:text-gray-300 relative">
                    Empresas
                    <span className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-[#004022] to-white scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></span>
                  </div>
                </ProtectedLink>
              </li>

              {token ? (
                <li className="flex-1 md:flex-none relative">
                  <div className="relative">
                    <button
                      onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                      className="flex items-center py-3 px-4 text-white hover:text-gray-300"
                    >
                      <User className="w-5 h-5 mr-2" />
                      Perfil
                    </button>
                    {isDropdownOpen && (
                      <ul className="absolute bg-white text-black rounded-md shadow-lg right-0 mt-2 py-2 w-40 z-50">
                        {/* Exibe a opção "Administração" apenas se o usuário for admin */}
                        {user?.role === 'ADMIN' && (
                          <li>
                            <Link
                              href="/admin"
                              onClick={() => setIsDropdownOpen(false)}
                              className="block px-4 py-2 text-sm hover:bg-gray-200"
                            >
                              <Home className="w-4 h-4 inline mr-2" />
                              Administração
                            </Link>
                          </li>
                        )}
                        <li>
                          <button
                            onClick={handleLogout}
                            className="block px-4 py-2 text-sm hover:bg-gray-200 w-full text-left"
                          >
                            <LogOut className="w-4 h-4 inline mr-2" />
                            Sair
                          </button>
                        </li>
                      </ul>
                    )}
                  </div>
                </li>
              ) : (
                <li className="flex-1 md:flex-none">
                  <Link
                    href="/login"
                    className="group flex items-center justify-center py-3 px-4 text-white bg-[#004022] rounded-lg hover:bg-[#3f5c57] relative"
                  >
                    <LogIn className="mr-2 w-5 h-5 group-hover:text-gray-300" />
                    Login
                  </Link>
                </li>
              )}
            </ul>
          </div>
        </div>
      </nav>
    </header>
  );
}
