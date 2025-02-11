"use client";

import { useState } from "react";
import Swal from "sweetalert2";
import { useRouter } from "next/navigation";
import axios from "axios";
import {
    FaUser,
    FaTag,
    FaClipboard,
    FaBox,
    FaCheckSquare,
    FaPen,
    FaWeight,
    FaImage,
    FaPlus,
} from "react-icons/fa";
import { Company, SendFormProduct } from "@/app/models";
import { BASE_URL } from "../utils/constants";

interface ProductFormProps {
    company: Company;
}

const ProductForm = ({ company }: ProductFormProps) => {
    // ... (mantenha os states e métodos existentes)

    const [formData, setFormData] = useState<SendFormProduct>({
        name: '',
        category: '',
        model: '',
        company_brand: '',
        description: '',
        quantity: 0,
        size: '',
        price: 0,
        lot: false,
        sector: '',
        delivered_by: '',
        delivery_man_signature: null,
        received_company: company.id, // Garantir que o id da empresa está correto
        current_company: company.id,  // Garantir que o id da empresa está correto
        images: null,
    });

    const [images, setImages] = useState<File[]>([]);
    const [previewImages, setPreviewImages] = useState<string[]>([]);
    const router = useRouter();

    const categories = ["Eletrônicos", "Roupas", "Alimentos"]; // Exemplo de categorias

    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
    ) => {
        const { name, value, type } = e.target;

        setFormData({
            ...formData,
            [name]:
                type === "checkbox"
                    ? (e.target as HTMLInputElement).checked
                        ? 1
                        : 0
                    : value,
        });
    };

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files) return;

        const files = Array.from(e.target.files);
        setImages(files);

        const previews = files.map((file) => URL.createObjectURL(file));
        setPreviewImages(previews);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const form = new FormData();
        Object.entries(formData).forEach(([key, value]) => {
            form.append(key, String(value));
        });

        images.forEach((image) => {
            form.append("images", image);
        });

        form.append("delivery_man_signature", images[0]);

        try {
            const response = await axios.post(
                `${BASE_URL}api/products/`,
                form,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                        'Authorization': `Bearer ${localStorage.getItem('authToken')}`
                    },
                }
            );

            if (response.data['success'] === true) {
                Swal.fire({
                    title: "Sucesso!",
                    text: "Produto cadastrado com sucesso!",
                    icon: "success",
                    showCancelButton: true,
                    confirmButtonText: "Ir para o Inventário",
                    cancelButtonText: "Cadastrar Novo Produto"
                }).then((result) => {
                    if (result.isConfirmed) {
                        // Redireciona para o inventário da empresa selecionada
                        router.push(`/companies/${company.id}/inventory`);
                    } else {
                        // Reseta o formulário para um novo cadastro
                        resetForm();
                    }
                });
            }
        } catch (error) {
            console.error("Erro ao enviar o formulário:", error);
            Swal.fire("Erro", "Falha ao cadastrar o produto.", "error");
        }
    };

    
    const resetForm = () => {
        setFormData({
            name: '',
            category: '',
            model: '',
            company_brand: '',
            description: '',
            quantity: 0,
            size: '',
            price: 0,
            lot: false,
            sector: '',
            delivered_by: '',
            delivery_man_signature: null,
            received_company: company.id,
            current_company: company.id,
            images: null,
        });
        setImages([]);
        setPreviewImages([]);
    
        // Reseta os inputs manualmente
        document.querySelectorAll("input, select, textarea").forEach((element) => {
            if (element instanceof HTMLInputElement) {
                if (element.type === "checkbox") {
                    element.checked = false;
                } else {
                    element.value = "";
                }
            } else if (element instanceof HTMLSelectElement || element instanceof HTMLTextAreaElement) {
                element.value = "";
            }
        });
    };

    return (
        <div className="p-4 md:p-8 bg-gray-50 min-h-screen">
            <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-md overflow-hidden">
                {/* Header */}
                <div className="p-6 bg-gradient-to-r from-green-500 to-emerald-600">
                    <h1 className="text-2xl md:text-3xl font-bold text-white">
                        Cadastro de Produto
                    </h1>
                    <p className="text-emerald-100 mt-2">{company.name}</p>
                </div>

                <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-6">
                    {/* Grid Responsivo */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Nome */}
                        <div className="space-y-2">
                            <label className="flex items-center text-gray-700 mb-2">
                                <FaUser className="mr-2 text-emerald-600" />
                                Nome do Produto
                            </label>
                            <input
                                name="name"
                                type="text"
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                                onChange={handleInputChange}
                                required
                            />
                        </div>

                        {/* Categoria */}
                        <div className="space-y-2">
                            <label className="flex items-center text-gray-700 mb-2">
                                <FaTag className="mr-2 text-emerald-600" />
                                Categoria
                            </label>
                            <select
                                name="category"
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                                onChange={handleInputChange}
                                required
                            >
                                <option value="">Selecione...</option>
                                {categories.map((cat) => (
                                    <option key={cat} value={cat}>
                                        {cat}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Modelo */}
                        <div className="space-y-2">
                            <label className="flex items-center text-gray-700 mb-2">
                                <FaClipboard className="mr-2 text-emerald-600" />
                                Modelo
                            </label>
                            <input
                                name="model"
                                type="text"
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                                onChange={handleInputChange}
                                required
                            />
                        </div>

                        {/* Marca */}
                        <div className="space-y-2">
                            <label className="flex items-center text-gray-700 mb-2">
                                <FaBox className="mr-2 text-emerald-600" />
                                Marca
                            </label>
                            <input
                                name="company_brand"
                                type="text"
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                                onChange={handleInputChange}
                                required
                            />
                        </div>

                        {/* Setor */}
                        <div className="space-y-2">
                            <label className="flex items-center text-gray-700 mb-2">
                                <FaClipboard className="mr-2 text-emerald-600" />
                                Setor de Armazenamento
                            </label>
                            <input
                                name="sector"
                                type="text"
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                                onChange={handleInputChange}
                                required
                            />
                        </div>

                        {/* Tamanho */}
                        <div className="space-y-2">
                            <label className="flex items-center text-gray-700 mb-2">
                                <FaTag className="mr-2 text-emerald-600" />
                                Tamanho
                            </label>
                            <select
                                name="size"
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                                onChange={handleInputChange}
                                required
                            >
                                <option value="">Selecione...</option>
                                <option value="S">Pequeno (P)</option>
                                <option value="M">Médio (M)</option>
                                <option value="G">Grande (G)</option>
                            </select>
                        </div>

                        {/* Quantidade */}
                        <div className="space-y-2">
                            <label className="flex items-center text-gray-700 mb-2">
                                <FaWeight className="mr-2 text-emerald-600" />
                                Quantidade
                            </label>
                            <input
                                name="quantity"
                                type="number"
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                                onChange={handleInputChange}
                                required
                            />
                        </div>

                        {/* Tipo de Embalagem */}
                        <div className="space-y-2">
                            <label className="flex items-center text-gray-700 mb-2">
                                <FaCheckSquare className="mr-2 text-emerald-600" />
                                Tipo de Embalagem
                            </label>
                            <div className="flex items-center space-x-3 bg-gray-50 p-4 rounded-lg">
                                <input
                                    name="lot"
                                    type="checkbox"
                                    id="unitOrBox"
                                    className="h-5 w-5 text-emerald-600 border-gray-300 rounded focus:ring-emerald-500"
                                    onChange={handleInputChange}
                                />
                                <label htmlFor="unitOrBox" className="text-gray-700">
                                    Produto embalado em caixa
                                </label>
                            </div>
                        </div>
                    </div>

                    {/* Descrição */}
                    <div className="space-y-2">
                        <label className="flex items-center text-gray-700 mb-2">
                            <FaPen className="mr-2 text-emerald-600" />
                            Descrição
                        </label>
                        <textarea
                            name="description"
                            rows={4}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                            onChange={handleInputChange}
                            required
                        />
                    </div>

                    {/* Entregue Por */}
                    <div className="space-y-2">
                        <label className="flex items-center text-gray-700 mb-2">
                            <FaUser className="mr-2 text-emerald-600" />
                            Entregue Por
                        </label>
                        <input
                            name="delivered_by"
                            type="text"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                            onChange={handleInputChange}
                            required
                        />
                    </div>

                    {/* Upload de Imagens */}
                    <div className="space-y-4">
                        <label className="flex items-center text-gray-700 mb-2">
                            <FaImage className="mr-2 text-emerald-600" />
                            Imagens do Produto
                        </label>
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                            <div className="mb-4">
                                <p className="text-sm text-gray-500 mb-2">
                                    Arraste imagens ou clique para selecionar
                                </p>
                                <label
                                    htmlFor="image-upload"
                                    className="inline-flex items-center px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 cursor-pointer transition-colors"
                                >
                                    <FaPlus className="mr-2" />
                                    Adicionar Imagens
                                </label>
                                <input
                                    type="file"
                                    name="images"
                                    multiple
                                    accept="image/*"
                                    className="hidden"
                                    id="image-upload"
                                    onChange={handleImageUpload}
                                />
                            </div>
                            
                            {/* Preview de Imagens */}
                            {previewImages.length > 0 && (
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                                    {previewImages.map((src, index) => (
                                        <div
                                            key={index}
                                            className="relative group rounded-lg overflow-hidden shadow-md"
                                        >
                                            <img
                                                src={src}
                                                alt={`Preview ${index + 1}`}
                                                className="w-full h-32 object-cover"
                                            />
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Botão de Submit */}
                    <button
                        type="submit"
                        className="w-full py-4 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors font-semibold flex items-center justify-center"
                    >
                        <FaPlus className="mr-2" />
                        Cadastrar Produto
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ProductForm;