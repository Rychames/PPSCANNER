"use client";
import { useEffect, useState } from 'react';
import Link from 'next/link';
import axios from 'axios';
import { motion } from 'framer-motion';
import { FaBuilding, FaPlus, FaSearch, FaChartLine, FaRegBuilding } from 'react-icons/fa';
import { Company } from '@/models';
import { useProducts } from '@/hooks/useProducts';

export default function CompaniesPage() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const loadCompanies = async () => {
      try {
        const response = await axios.get('api/companies/');

        // Verifica se a resposta é um array ou se os dados estão dentro de .data
        let companiesData: Company[] = [];
        if (Array.isArray(response.data)) {
          companiesData = response.data;
        } else if (Array.isArray(response.data?.data)) {
          companiesData = response.data.data;
        }

        setCompanies(companiesData);
      } catch (error) {
        console.error("Erro ao carregar empresas:", error);
        setError('Não foi possível carregar as empresas. Tente novamente mais tarde.');
      } finally {
        setLoading(false);
      }
    };
    loadCompanies();
  }, []);

  // Mesmo que, por algum motivo, companies seja undefined, usamos fallback para array vazio
  const filteredCompanies = (companies || []).filter(company =>
    company.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <div className="text-center max-w-md text-red-600 bg-red-100 p-8 rounded-xl">
          <FaBuilding className="text-4xl mx-auto mb-4" />
          <p className="text-xl font-semibold mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg"
          >
            Tentar Novamente
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12 bg-gradient-to-r from-primary-600 to-accent-500 text-white p-8 rounded-2xl shadow-lg"
        >
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div>
              <h1 className="text-3xl font-bold mb-2">Organizações Cadastradas</h1>
              <p className="opacity-90">Gerencie todas as empresas associadas à plataforma</p>
            </div>
            <Link
              href="/add-companies"
              className="flex items-center gap-2 bg-white/10 hover:bg-white/20 px-6 py-3 rounded-lg transition-all"
            >
              <FaPlus className="text-lg" />
              Nova Empresa
            </Link>
          </div>
        </motion.div>

        {/* Filtros e Estatísticas */}
        <div className="mb-8 bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="relative md:col-span-2">
              <input
                type="text"
                placeholder="Pesquisar empresas..."
                className="w-full pl-12 pr-4 py-3 rounded-lg border bg-transparent focus:ring-2 focus:ring-primary-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <FaSearch className="absolute left-4 top-4 text-gray-400" />
            </div>

            <div className="bg-gray-50 p-4 rounded-lg flex items-center gap-4">
              <FaChartLine className="text-2xl text-primary-600" />
              <div>
                <p className="text-sm text-gray-600">Total de Empresas</p>
                <p className="text-xl font-bold">{companies.length}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Grid de Empresas */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white rounded-xl p-4 animate-pulse">
                <div className="h-48 bg-gray-200 rounded-xl mb-4" />
                <div className="h-4 bg-gray-200 rounded mb-3 w-3/4" />
                <div className="h-3 bg-gray-200 rounded w-1/2" />
              </div>
            ))}
          </div>
        ) : filteredCompanies.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-xl">
            <div className="max-w-xs mx-auto mb-6 text-gray-400">
              <FaRegBuilding className="text-6xl mx-auto" />
            </div>
            <p className="text-gray-600 mb-4">Nenhuma empresa encontrada</p>
            <Link
              href="/add-companies"
              className="inline-flex items-center gap-2 text-primary-600 hover:underline"
            >
              <FaPlus /> Adicionar primeira empresa
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCompanies.map((company) => (
              <motion.div
                key={company.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                whileHover={{ scale: 1.02 }}
                className="group relative"
              >
                <Link
                  href={`/companies/${company.id}`}
                  className="block bg-white rounded-xl shadow-sm hover:shadow-lg transition-all overflow-hidden border border-gray-100"
                >
                  <div className="relative h-48 bg-gray-100">
                    {company.logo ? (
                      <img
                        src={company.logo}
                        alt={company.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">
                        <FaBuilding className="text-4xl" />
                      </div>
                    )}
                  </div>

                  <div className="p-6">
                    <h3 className="text-xl font-semibold mb-2">{company.name}</h3>

                    <div className="flex flex-wrap gap-2 mb-4">
                      <span className="px-3 py-1 bg-primary-100 text-primary-800 text-sm rounded-full">
                        {company.name || 'Setor não informado'}
                      </span>
                      <span className="px-3 py-1 bg-gray-100 text-gray-600 text-sm rounded-full">
                        0teste0 colaboradores
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-sm text-gray-600">
                      <span>{company.address}</span>
                      <span className="flex items-center gap-1">
                        <FaChartLine />
                        {company.products_count || 0} ativos
                      </span>
                    </div>
                  </div>

                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-5 transition-opacity" />
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
