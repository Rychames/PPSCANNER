"use client";
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Company } from '@/models';
import { FaBuilding, FaEdit, FaChartLine, FaBoxes, FaMapMarkerAlt, FaIdCard, FaRegBuilding } from 'react-icons/fa';
import Link from 'next/link';

export default function CompanyPage() {
  const params = useParams();
  const { companyId } = params as { companyId: string };
  const [company, setCompany] = useState<Company | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  if (loading) {
      return (
      <div className="flex items-center justify-center min-h-screen text-gray-600">
        Carregando...
      </div>
    );
  }

  useEffect(() => {
    const loadCompany = async () => {
      try {
        const response = await axios.get(`api/companies/${companyId}`);
        setCompany({
          ...response.data.data,
          products_count: response.data.data.product || 0,
          employees: response.data.data.employees || 'Não informado',
          industry: response.data.data.industry || 'Não definido'
        });
        setError(null);
      } catch (error) {
        console.error("Erro ao carregar empresa:", error);
        setError('Não foi possível carregar os dados da empresa');
      } finally {
        setLoading(false);
      }
    };

    loadCompany();
  }, [companyId]);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="animate-pulse space-y-8">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-100 rounded-xl p-4">
                <div className="h-6 bg-gray-200 rounded w-1/4 mb-3"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <div className="text-center max-w-md bg-red-50 p-8 rounded-xl">
          <FaRegBuilding className="text-4xl text-red-600 mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2 text-red-600">{error}</h2>
          <p className="text-gray-600 mb-4">Empresa ID: {companyId}</p>
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

  if (!company) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <div className="text-center max-w-md">
          <FaRegBuilding className="text-4xl text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2">Empresa não encontrada</h2>
          <p className="text-gray-600 mb-4">ID: {companyId}</p>
          <Link
            href="/companies"
            className="text-primary-600 hover:underline flex items-center justify-center gap-2"
          >
            <FaChartLine /> Ver todas empresas
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8 bg-gradient-to-r from-primary-600 to-accent-500 text-white p-8 rounded-2xl shadow-lg"
      >
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-6">
            {company.logo ? (
              <img
                src={company.logo}
                alt={`Logo ${company.name}`}
                className="w-20 h-20 object-contain bg-white rounded-lg p-2"
              />
            ) : (
              <div className="w-20 h-20 bg-white/20 rounded-lg flex items-center justify-center">
                <FaBuilding className="text-3xl" />
              </div>
            )}
            <div>
              <h1 className="text-3xl font-bold">{company.name}</h1>
              <p className="opacity-90 mt-1">{company.name}</p>
            </div>
          </div>
          <Link
            href={`/companies/${companyId}/edit`}
            className="flex items-center gap-2 bg-white/10 hover:bg-white/20 px-6 py-3 rounded-lg transition-all"
          >
            <FaEdit className="text-lg" />
            Editar Empresa
          </Link>
        </div>
      </motion.div>

      {/* Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatCard
          icon={<FaBoxes className="text-2xl" />}
          title="Ativos Registrados"
          value={company.products_count?.toString() || '0'}
          color="bg-emerald-100 text-emerald-800"
        />
        <StatCard
          icon={<FaChartLine className="text-2xl" />}
          title="Colaboradores"
          value={company.name?.toString() || 'Não informado'}
          color="bg-blue-100 text-blue-800"
        />
        <StatCard
          icon={<FaMapMarkerAlt className="text-2xl" />}
          title="Localização"
          value={company.address}
          color="bg-purple-100 text-purple-800"
        />
      </div>

      {/* Detalhes da Empresa */}
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
          <FaIdCard className="text-primary-600" />
          Informações Legais
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <DetailItem label="CNPJ" value={company.cnpj} />
          <DetailItem label="Setor" value={company.name} />
          <DetailItem label="Data de Cadastro" value="01/01/2023" />
          <DetailItem label="Última Atualização" value="15/09/2023" />
        </div>
      </div>
    </div>
  );
}

const StatCard = ({ icon, title, value, color }: any) => (
  <motion.div
    whileHover={{ scale: 1.02 }}
    className={`${color} p-6 rounded-xl flex items-center gap-4`}
  >
    <div className="p-3 bg-white/20 rounded-lg">{icon}</div>
    <div>
      <p className="text-sm font-medium">{title}</p>
      <p className="text-2xl font-bold">{value}</p>
    </div>
  </motion.div>
);

const DetailItem = ({ label, value }: any) => (
  <div className="bg-gray-50 p-4 rounded-lg">
    <p className="text-sm text-gray-500 mb-1">{label}</p>
    <p className="font-medium">{value || 'Não informado'}</p>
  </div>
);