"use client";

import { useState, useEffect, useMemo } from "react";
import axios from "axios";
import { Bar, Line, Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

// Registra os componentes necessários do Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

// Importa os modelos (ajuste os caminhos se necessário)
import { Company } from "@/app/models/company.model";
import { UserModel } from "@/app/models/user.model";
import { Product } from "@/app/models/product.model";

// Define uma interface que estende Company para garantir que ela possua um array de produtos
interface CompanyWithProducts extends Company {
  products: Product[];
}

export default function DashboardAllCompanies() {
  // Estados para armazenar os dados buscados
  const [companies, setCompanies] = useState<CompanyWithProducts[]>([]);
  const [users, setUsers] = useState<UserModel[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  // Busca os dados utilizando axios (ajuste as URLs conforme sua API)
  useEffect(() => {
    async function fetchData() {
      try {
        const [companiesResponse, usersResponse] = await Promise.all([
          axios.get<CompanyWithProducts[]>("/api/companies"),
          axios.get<UserModel[]>("/api/users"),
        ]);

        // Caso alguma empresa não tenha o array "products", atribuímos um array vazio
        const companiesData: CompanyWithProducts[] = companiesResponse.data.map(
          (company) => ({
            ...company,
            products: company.products ?? [],
          })
        );

        setCompanies(companiesData);
        setUsers(usersResponse.data);
        setLoading(false);
      } catch (err) {
        setError("Erro ao carregar dados.");
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  // Cálculos gerais
  const totalCompanies = companies.length;
  const totalUsers = users.length;
  const totalProducts = companies.reduce(
    (acc, company) => acc + company.products.length,
    0
  );
  const totalProductValue = companies.reduce((acc, company) => {
    const companyTotal = company.products.reduce(
      (sum, prod) => sum + prod.price,
      0
    );
    return acc + companyTotal;
  }, 0);

  // Obtém o último produto cadastrado, comparando pela data de cadastro (campo "date_receipt")
  const latestProductInfo = useMemo(() => {
    let latest: Product | null = null;
    let latestCompany: CompanyWithProducts | null = null;
    companies.forEach((company) => {
      company.products.forEach((prod) => {
        if (
          !latest ||
          new Date(prod.date_receipt) > new Date(latest.date_receipt)
        ) {
          latest = prod;
          latestCompany = company;
        }
      });
    });
    return { latest, latestCompany };
  }, [companies]);

  // Gráfico de barras: Número de produtos por empresa
  const productsPerCompanyChart = {
    labels: companies.map((company) => company.name),
    datasets: [
      {
        label: "Número de Produtos",
        data: companies.map((company) => company.products.length),
        backgroundColor: "rgba(75,192,192,0.6)",
      },
    ],
  };

  // Gráfico de linha: Produtos cadastrados ao longo do tempo (agrupados por mês)
  const productRegistrationChart = useMemo(() => {
    const registrationMap: { [key: string]: number } = {};
    companies.forEach((company) => {
      company.products.forEach((product) => {
        const date = new Date(product.date_receipt);
        const monthYear = `${date.getFullYear()}-${(date.getMonth() + 1)
          .toString()
          .padStart(2, "0")}`;
        registrationMap[monthYear] = (registrationMap[monthYear] || 0) + 1;
      });
    });
    const sortedMonths = Object.keys(registrationMap).sort();
    return {
      labels: sortedMonths,
      datasets: [
        {
          label: "Produtos Cadastrados",
          data: sortedMonths.map((month) => registrationMap[month]),
          fill: false,
          borderColor: "rgba(75,192,192,1)",
          tension: 0.1,
        },
      ],
    };
  }, [companies]);

  // Gráfico doughnut: Valor total em produtos por empresa
  const revenuePerCompanyChart = {
    labels: companies.map((company) => company.name),
    datasets: [
      {
        label: "Valor Total em Produtos",
        data: companies.map((company) =>
          company.products.reduce((sum, prod) => sum + prod.price, 0)
        ),
        backgroundColor: companies.map(
          (_, index) => `hsl(${(index * 60) % 360}, 70%, 50%)`
        ),
      },
    ],
  };

  if (loading) return <div>Carregando...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Dashboard Geral de Empresas</h1>

      {/* Cards de informações */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="p-4 bg-white shadow rounded">
          <h2 className="text-xl font-semibold">Empresas</h2>
          <p className="text-3xl">{totalCompanies}</p>
        </div>
        <div className="p-4 bg-white shadow rounded">
          <h2 className="text-xl font-semibold">Produtos</h2>
          <p className="text-3xl">{totalProducts}</p>
        </div>
        <div className="p-4 bg-white shadow rounded">
          <h2 className="text-xl font-semibold">Usuários</h2>
          <p className="text-3xl">{totalUsers}</p>
        </div>
        <div className="p-4 bg-white shadow rounded">
          <h2 className="text-xl font-semibold">Valor Total em Produtos</h2>
          <p className="text-3xl">R$ {totalProductValue}</p>
        </div>
      </div>

      {/* Gráfico de barras */}
      <div className="mb-8 bg-white p-4 shadow rounded">
        <h2 className="text-2xl font-bold mb-4">Produtos por Empresa</h2>
        <Bar
          data={productsPerCompanyChart}
          options={{ responsive: true, plugins: { legend: { position: "top" } } }}
        />
      </div>

      {/* Gráfico de linha */}
      <div className="mb-8 bg-white p-4 shadow rounded">
        <h2 className="text-2xl font-bold mb-4">
          Produtos Cadastrados ao Longo do Tempo
        </h2>
        <Line
          data={productRegistrationChart}
          options={{ responsive: true, plugins: { legend: { position: "top" } } }}
        />
      </div>

      {/* Gráfico doughnut */}
      <div className="mb-8 bg-white p-4 shadow rounded">
        <h2 className="text-2xl font-bold mb-4">Receita por Empresa</h2>
        <Doughnut
          data={revenuePerCompanyChart}
          options={{ responsive: true, plugins: { legend: { position: "top" } } }}
        />
      </div>

      {/* Último produto cadastrado */}
      <div className="bg-white p-4 shadow rounded">
        <h2 className="text-2xl font-bold mb-4">Último Produto Cadastrado</h2>
        {latestProductInfo.latest && latestProductInfo.latestCompany ? (
          <ul>
            <li>
              <strong>Produto:</strong> {latestProductInfo.latest.name}
            </li>
            <li>
              <strong>Empresa:</strong> {latestProductInfo.latestCompany.name}
            </li>
            <li>
              <strong>Preço:</strong> R$ {latestProductInfo.latest.price}
            </li>
            <li>
              <strong>Data de Cadastro:</strong>{" "}
              {new Date(latestProductInfo.latest.date_receipt).toLocaleDateString()}
            </li>
          </ul>
        ) : (
          <p>Nenhum produto cadastrado.</p>
        )}
      </div>
    </div>
  );
}
