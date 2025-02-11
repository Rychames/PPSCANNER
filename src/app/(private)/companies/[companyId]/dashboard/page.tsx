'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

// Tipos dos dados simulados
interface Product {
  id: number;
  name: string;
  price: number;
  createdAt: string;
}

interface Company {
  id: number;
  name: string;
  products: Product[];
}

export default function CompanyDashboard() {
  const params = useParams()!;
  const companyId = Number(params.companyId);

  // Dados simulados
  const [companies] = useState<Company[]>([
    {
      id: 1,
      name: 'Company A',
      products: [
        { id: 1, name: 'Produto A1', price: 100, createdAt: '2023-01-01' },
        { id: 2, name: 'Produto A2', price: 200, createdAt: '2023-02-01' },
      ],
    },
    {
      id: 2,
      name: 'Company B',
      products: [
        { id: 3, name: 'Produto B1', price: 150, createdAt: '2023-03-01' },
      ],
    },
    {
      id: 3,
      name: 'Company C',
      products: [
        { id: 4, name: 'Produto C1', price: 250, createdAt: '2023-04-01' },
        { id: 5, name: 'Produto C2', price: 300, createdAt: '2023-05-01' },
        { id: 6, name: 'Produto C3', price: 50, createdAt: '2023-06-01' },
      ],
    },
  ]);

  // Filtrar a empresa selecionada
  const company = companies.find((comp) => comp.id === companyId);

  if (!company) {
    return (
      <div className="p-6">
        <h1 className="text-3xl font-bold">Empresa não encontrada</h1>
      </div>
    );
  }

  const totalProducts = company.products.length;
  const totalProductValue = company.products.reduce((acc, prod) => acc + prod.price, 0);

  // Dados para o gráfico: preço de cada produto
  const chartData = {
    labels: company.products.map((prod) => prod.name),
    datasets: [
      {
        label: 'Preço do Produto',
        data: company.products.map((prod) => prod.price),
        backgroundColor: 'rgba(153,102,255,0.6)',
      },
    ],
  };

  // Último produto cadastrado
  let latestProduct = company.products.reduce((latest, prod) => {
    return !latest || new Date(prod.createdAt) > new Date(latest.createdAt)
      ? prod
      : latest;
  }, null as Product | null);

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Dashboard da {company.name}</h1>

      {/* Cards de informações */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <div className="p-4 bg-white shadow rounded">
          <h2 className="text-xl font-semibold">Produtos</h2>
          <p className="text-3xl">{totalProducts}</p>
        </div>
        <div className="p-4 bg-white shadow rounded">
          <h2 className="text-xl font-semibold">Valor Total em Produtos</h2>
          <p className="text-3xl">R$ {totalProductValue}</p>
        </div>
      </div>

      {/* Gráfico */}
      <div className="mb-8 bg-white p-4 shadow rounded">
        <h2 className="text-2xl font-bold mb-4">Preços dos Produtos</h2>
        <Bar data={chartData} options={{ responsive: true, plugins: { legend: { position: 'top' } } }} />
      </div>

      {/* Último Produto Cadastrado */}
      <div className="bg-white p-4 shadow rounded">
        <h2 className="text-2xl font-bold mb-4">Último Produto Cadastrado</h2>
        {latestProduct ? (
          <ul>
            <li><strong>Produto:</strong> {latestProduct.name}</li>
            <li><strong>Preço:</strong> R$ {latestProduct.price}</li>
            <li><strong>Data de Cadastro:</strong> {latestProduct.createdAt}</li>
          </ul>
        ) : (
          <p>Nenhum produto cadastrado.</p>
        )}
      </div>
    </div>
  );
}
