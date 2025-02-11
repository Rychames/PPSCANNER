"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import axios from "axios";
import {
    FaSearch,
    FaPlus,
    FaBoxOpen,
    FaFilter,
    FaChartLine,
    FaEdit
} from "react-icons/fa";
import { motion } from "framer-motion";
import { use } from "react";

import { Product } from "@/models";
import ExportButton from "@/components/ExportButton";
import { ErrorResponse, SuccessResponse } from "@/types";

interface InventoryPageProps {
    params: Promise<{ companyId: string }>;
}

const InventoryPage = ({ params }: InventoryPageProps) => {
    const { companyId } = use(params);
    const [products, setProducts] = useState<Product[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [filters, setFilters] = useState({
        category: "",
        status: "all",
    });
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                setIsLoading(true);
                const response = await axios.get<SuccessResponse<Product[] | null> | ErrorResponse>('api/products/');
                if (!response.data.data) return;

                const productsArray: Product[]  = response.data.data;
                const filteredProducts: Product[] = productsArray.filter((product: Product) => {
                    return product.current_company?.id === Number(companyId);
                });

                setProducts(filteredProducts);
            } catch (error) {
                console.error("Error fetching products:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchProducts();
    }, [companyId]);

    const filteredProducts = products.filter((product) => {
        const matchesSearch = product.name
            .toLowerCase()
            .includes(searchTerm.toLowerCase());
        const matchesCategory = filters.category
            ? product.category === filters.category
            : true;
        const matchesStatus =
            filters.status === "all"
                ? true
                : filters.status === "in_stock"
                    ? product.quantity > 0
                    : product.quantity === 0;

        return matchesSearch && matchesCategory && matchesStatus;
    });

    const exportData = filteredProducts.map((product) => ({
        Nome: product.name,
        Categoria: product.category,
        Modelo: product.model,
        Marca: product.company_brand,
        Descrição: product.description,
        Quantidade: product.quantity,
        Setor: product.sector,
        "Empresa Atual": product.current_company?.name || "",
        "Data de Cadastro": product.date_receipt,
    }));

    const handleQuickView = (productId: number) => {
        router.push(`/companies/${companyId}/product/${productId}`);
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
            <div className="max-w-7xl mx-auto">
                {/* Header Modernizado */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4 bg-gradient-to-r from-primary-600 to-accent-500 p-6 rounded-2xl text-white"
                >
                    <div className="flex gap-4 items-center">
                        <h1 className="text-3xl font-bold">
                            Gestão de Ativos
                            <span className="block text-sm font-normal opacity-90">
                                Controle total do seu patrimônio
                            </span>
                        </h1>
                    </div>

                    <div className="flex gap-4 flex-wrap">
                        <ExportButton products={filteredProducts} />

                        <Link
                            href={`/companies/${companyId}/add-product`}
                            className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white px-6 py-3 rounded-lg transition-all border border-white/20"
                        >
                            <FaPlus className="text-lg" />
                            Novo Ativo
                        </Link>
                    </div>
                </motion.div>

                {/* Seção de Filtros Aprimorada */}
                <div className="bg-white dark:bg-gray-800 rounded-xl p-6 mb-8 shadow-lg border border-gray-100 dark:border-gray-700">
                    <div className="flex items-center gap-3 mb-6">
                        <FaFilter className="text-xl text-primary-600 dark:text-accent-400" />
                        <h2 className="text-xl font-semibold">Filtros Avançados</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div className="relative md:col-span-2">
                            <input
                                type="text"
                                placeholder="Pesquisar ativos..."
                                className="w-full pl-12 pr-4 py-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-transparent focus:ring-2 focus:ring-primary-500"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                            <FaSearch className="absolute left-4 top-4 text-gray-400" />
                        </div>

                        <select
                            className="px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-transparent focus:ring-2 focus:ring-primary-500"
                            value={filters.category}
                            onChange={(e) => setFilters({ ...filters, category: e.target.value })}
                        >
                            <option value="">Todas Categorias</option>
                            <option value="Eletrônicos">Eletrônicos</option>
                            <option value="Equipamentos">Equipamentos</option>
                            <option value="Mobiliário">Mobiliário</option>
                            <option value="Veículos">Veículos</option>
                        </select>

                        <select
                            className="px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-transparent focus:ring-2 focus:ring-primary-500"
                            value={filters.status}
                            onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                        >
                            <option value="all">Todos Status</option>
                            <option value="in_stock">Disponível</option>
                            <option value="out_of_stock">Indisponível</option>
                        </select>
                    </div>
                </div>

                {/* Estatísticas Rápidas */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-100 dark:border-gray-700">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-emerald-100 dark:bg-emerald-900 rounded-lg">
                                <FaBoxOpen className="text-2xl text-emerald-600 dark:text-emerald-400" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Total de Ativos</p>
                                <p className="text-2xl font-bold">{products.length}</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-100 dark:border-gray-700">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-lg">
                                <FaChartLine className="text-2xl text-blue-600 dark:text-blue-400" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Disponíveis</p>
                                <p className="text-2xl font-bold">
                                    {products.filter(p => p.quantity > 0).length}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-100 dark:border-gray-700">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-orange-100 dark:bg-orange-900 rounded-lg">
                                <FaEdit className="text-2xl text-orange-600 dark:text-orange-400" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Última Atualização</p>
                                <p className="text-2xl font-bold">-</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Grid de Produtos Modernizado */}
                {isLoading ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {[...Array(8)].map((_, i) => (
                            <div key={i} className="bg-white dark:bg-gray-800 rounded-xl p-4 animate-pulse">
                                <div className="h-48 bg-gray-200 dark:bg-gray-700 rounded-xl mb-4" />
                                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-3 w-3/4" />
                                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded mb-2 w-1/2" />
                                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/4" />
                            </div>
                        ))}
                    </div>
                ) : filteredProducts.length === 0 ? (
                    <div className="text-center py-20 bg-white dark:bg-gray-800 rounded-xl">
                        <div className="max-w-xs mx-auto mb-6">
                            <svg className="w-full text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                            </svg>
                        </div>
                        <p className="text-gray-500 dark:text-gray-400 mb-4">
                            Nenhum ativo encontrado
                        </p>
                        <Link
                            href={`/companies/${companyId}/add-product`}
                            className="inline-flex items-center gap-2 text-primary-600 dark:text-accent-400 hover:underline"
                        >
                            <FaPlus /> Adicionar primeiro ativo
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {filteredProducts.map((product) => (
                            <motion.div
                                key={product.id}
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="group bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-lg transition-all cursor-pointer relative overflow-hidden border border-gray-100 dark:border-gray-700"
                                onClick={() => handleQuickView(product.id)}
                            >
                                <div className="absolute top-4 right-4 z-10">
                                    <div className={`px-3 py-1 rounded-full text-sm font-medium ${product.quantity > 0
                                            ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-100"
                                            : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100"
                                        }`}>
                                        {product.quantity > 0 ? `${product.quantity} Disponíveis` : "Esgotado"}
                                    </div>
                                </div>

                                <div className="h-48 bg-gray-100 dark:bg-gray-700 relative overflow-hidden">
                                    {product.images?.some(image => image.image) ? (
                                        <img
                                            src={product.images.find(image => image.image)?.image}
                                            alt={product.name}
                                            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                                            <FaBoxOpen className="text-4xl opacity-50" />
                                        </div>
                                    )}
                                </div>

                                <div className="p-6">
                                    <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">
                                        {product.name}
                                    </h3>
                                    <div className="flex items-center gap-2 mb-4">
                                        <span className="text-sm px-2 py-1 bg-primary-100 dark:bg-primary-900 text-primary-800 dark:text-primary-200 rounded-full">
                                            {product.category}
                                        </span>
                                    </div>

                                    <div className="flex justify-between items-center">
                                        <div>
                                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                                {product.sector || "Setor não definido"}
                                            </p>
                                            <p className="text-xs text-gray-400 dark:text-gray-500">
                                                Atualizado em {new Date(product.date_receipt).toLocaleDateString()}
                                            </p>
                                        </div>
                                        <button
                                            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleQuickView(product.id);
                                            }}
                                        >
                                            <FaSearch className="text-gray-600 dark:text-gray-400" />
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default InventoryPage;