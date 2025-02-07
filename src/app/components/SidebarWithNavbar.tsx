"use client";
import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/app/context/AuthContext";
import Link from "next/link";
import { useFilter } from "@/app/context/FilterContext";

const SidebarWithNavbar: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const { logout, user } = useAuth();

  // Verifica se a rota é uma página de empresa: espera-se que seja "/companies/[companyId]/..."
  const isCompanyPage = pathname ? pathname.startsWith("/companies/") && pathname.split("/").length > 2 : false;
  const companyId = isCompanyPage ? pathname.split("/")[2] : null;

  const { filters, setFilters } = useFilter();

  // Funções de filtro (mantidas do exemplo original)
  const handleOnlyQRCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { checked } = e.target;
    setFilters((prev) => ({
      ...prev,
      onlyQRCode: checked,
      showProductDetails: checked ? false : prev.showProductDetails,
      showUserInfo: checked ? false : prev.showUserInfo,
      showCompanyInfo: checked ? false : prev.showCompanyInfo,
      removeImages: checked ? false : prev.removeImages,
    }));
  };

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    if (filters.onlyQRCode) return;
    setFilters((prev) => ({ ...prev, [name]: checked }));
  };

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsSidebarOpen(true);
      } else {
        setIsSidebarOpen(false);
      }
    };
    const handleClickOutside = (event: MouseEvent) => {
      const dropdown = document.getElementById("dropdown-user");
      if (dropdown && !dropdown.contains(event.target as Node)) {
        setIsUserDropdownOpen(false);
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      window.removeEventListener("resize", handleResize);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const toggleSidebar = () => {
    if (window.innerWidth < 1024) {
      setIsSidebarOpen(!isSidebarOpen);
    }
  };

  const publicRoutes = ["/login", "/signup", "/VerifyCodePage", "/not-found"];
  const isPublicPage = publicRoutes.includes(pathname);

  return (
    <div className={`min-h-screen bg-gray-50 dark:bg-gray-900 ${isPublicPage ? "justify-center" : ""}`}>
      {!isPublicPage && (
        <>
          <nav className="no-print fixed top-0 z-50 w-full bg-[#004022] border-b border-gray-200 dark:bg-gray-800 dark:border-gray-700">
            <div className="px-3 py-3 lg:px-5 lg:pl-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center justify-start rtl:justify-end">
                  <button
                    onClick={toggleSidebar}
                    className="inline-flex items-center p-2 text-sm text-gray-500 rounded-lg lg:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
                  >
                    <span className="sr-only">Abrir menu</span>
                    <svg
                      className="w-6 h-6"
                      aria-hidden="true"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        clipRule="evenodd"
                        fillRule="evenodd"
                        d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 10.5a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5a.75.75 0 01-.75-.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 01.75 10z"
                      />
                    </svg>
                  </button>
                  <Link href="/" className="flex ms-2 md:me-24">
                    <img src="/ppscanner.svg" className="h-8 me-3" alt="Logo" />
                  </Link>
                </div>
                <div className="flex items-center">
                  <div className="relative">
                    <button
                      onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
                      className="flex text-sm bg-gray-800 rounded-full focus:ring-4 focus:ring-gray-300 dark:focus:ring-gray-600"
                      aria-expanded={isUserDropdownOpen}
                    >
                      <span className="sr-only">Abrir menu do usuário</span>
                      <img
                        className="w-8 h-8 rounded-full"
                        src="https://flowbite.com/docs/images/people/profile-picture-5.jpg"
                        alt="user"
                      />
                    </button>
                    {isUserDropdownOpen && (
                      <div
                        id="dropdown-user"
                        className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 dark:bg-gray-700 z-50"
                      >
                        <div className="px-4 py-3" role="none">
                          <p className="text-sm text-gray-900 dark:text-white" role="none">
                            {user?.email}
                          </p>
                          <p className="text-sm font-medium text-gray-900 truncate dark:text-gray-300" role="none">
                            {user?.email}
                          </p>
                        </div>
                        <ul className="py-1" role="none">
                          {(user?.role === "ADMIN" || user?.role === "MODERATOR") && (
                            <li>
                              <Link
                                href="/admin"
                                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-600 dark:hover:text-white"
                                role="menuitem"
                              >
                                Tela de Administração
                              </Link>
                            </li>
                          )}
                          <li>
                            <button
                              onClick={logout}
                              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-600 dark:hover:text-white w-full text-left"
                              role="menuitem"
                            >
                              Sair
                            </button>
                          </li>
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </nav>
          <aside
            id="logo-sidebar"
            className={`no-print fixed top-0 left-0 z-40 w-64 h-screen pt-20 transition-transform bg-white border-r border-gray-200 dark:bg-gray-800 dark:border-gray-700 lg:translate-x-0 ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"
              }`}
            aria-label="Sidebar"
          >
            <div className="h-full px-3 pb-4 overflow-y-auto bg-white dark:bg-gray-800">
              <ul className="space-y-2 font-medium">
                <li>
                  {/* Ajuste do link do dashboard: se estiver em uma página de empresa, aponta para a rota dentro de companies */}
                  <Link
                    href={
                      isCompanyPage && companyId
                        ? `/companies/${companyId}/dashboard`
                        : "/dashboard"
                    }
                    className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
                  >
                    <svg
                      className="w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="currentColor"
                      viewBox="0 0 22 21"
                    >
                      <path d="M16.975 11H10V4.025a1 1 0 0 0-1.066-.998 8.5 8.5 0 1 0 9.039 9.039.999.999 0 0 0-1-1.066h.002Z" />
                      <path d="M12.5 0c-.157 0-.311.01-.565.027A1 1 0 0 0 11 1.02V10h8.975a1 1 0 0 0 1-.935c.013-.188.028-.374.028-.565A8.51 8.51 0 0 0 12.5 0Z" />
                    </svg>
                    <span className="ms-3">Dashboard</span>
                  </Link>
                </li>
                {/* Se estiver em uma página de empresa, exibe opções para gerenciamento */}
                {isCompanyPage && companyId && (
                  <li className="pt-4 mt-4 border-t border-gray-200 dark:border-gray-700">
                    <div className="px-2">
                      <span className="text-gray-500 dark:text-gray-400 text-sm font-light">
                        Gerenciamento da Empresa
                      </span>
                      <div className="mt-2 space-y-2">
                        <Link
                          href={`/companies/${companyId}/add-product`}
                          className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
                        >
                          <svg
                            className="w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 18 18"
                          >
                            <path
                              stroke="currentColor"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M9 1v16M1 9h16"
                            />
                          </svg>
                          <span className="ms-3">Novo Produto</span>
                        </Link>
                        <Link
                          href={`/companies/${companyId}/inventory`}
                          className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
                        >
                          <svg
                            className="w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="currentColor"
                            viewBox="0 0 18 20"
                          >
                            <path d="M17 5.923A1 1 0 0 0 16 5h-3V4a4 4 0 1 0-8 0v1H2a1 1 0 0 0-1 .923L.086 17.846A2 2 0 0 0 2.08 20h13.84a2 2 0 0 0 1.994-2.153L17 5.923ZM7 9a1 1 0 0 1-2 0V7h2v2Zm0-5a2 2 0 1 1 4 0v1H7V4Zm6 5a1 1 0 1 1-2 0V7h2v2Z" />
                          </svg>
                          <span className="ms-3">Ver Inventário</span>
                        </Link>
                      </div>
                    </div>
                  </li>
                )}
                <li>
                  <Link
                    href="/companies"
                    className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
                  >
                    <svg
                      className="shrink-0 w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="currentColor"
                      viewBox="0 0 18 18"
                    >
                      <path d="M6.143 0H1.857A1.857 1.857 0 0 0 0 1.857v4.286C0 7.169.831 8 1.857 8h4.286A1.857 1.857 0 0 0 8 6.143V1.857A1.857 1.857 0 0 0 6.143 0Zm10 0h-4.286A1.857 1.857 0 0 0 10 1.857v4.286C10 7.169 10.831 8 11.857 8h4.286A1.857 1.857 0 0 0 18 6.143v-4.286A1.857 1.857 0 0 0 16.143 0Zm-10 10H1.857A1.857 1.857 0 0 0 0 11.857v4.286C0 17.169.831 18 1.857 18h4.286A1.857 1.857 0 0 0 8 16.143v-4.286A1.857 1.857 0 0 0 6.143 10Zm10 0h-4.286A1.857 1.857 0 0 0 10 11.857v4.286c0 1.026.831 1.857 1.857 1.857h4.286A1.857 1.857 0 0 0 18 16.143v-4.286A1.857 1.857 0 0 0 16.143 10Z" />
                    </svg>
                    <span className="ms-3">Empresas</span>
                  </Link>
                </li>
                <li>
                  <Link
                    href="/settings"
                    className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
                  >
                    <svg
                      className="shrink-0 w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 20 20"
                    >
                      <path
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M7.75 4H19M7.75 4a2.25 2.25 0 0 1-4.5 0m4.5 0a2.25 2.25 0 0 0-4.5 0M1 4h2.25m13.5 6H19m-2.25 0a2.25 2.25 0 0 1-4.5 0m4.5 0a2.25 2.25 0 0 0-4.5 0M1 10h11.25m-4.5 6H19M7.75 16a2.25 2.25 0 0 1-4.5 0m4.5 0a2.25 2.25 0 0 0-4.5 0M1 16h2.25"
                      />
                    </svg>
                    <span className="ms-3">Configurações</span>
                  </Link>
                </li>
              </ul>
            </div>
          </aside>
        </>
      )}
      <div className={`p-4 ${isPublicPage ? "" : "lg:ml-64"} mt-14`}>
        <div className="p-4 border-2 border-gray-200 border-dashed rounded-lg dark:border-gray-700">
          {children}
        </div>
      </div>
    </div>
  );
};

export default SidebarWithNavbar;
