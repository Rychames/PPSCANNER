"use client";

import { useState } from "react";
import Swal from "sweetalert2";
import { useRouter } from "next/navigation";
import {
    FaUser,
    FaTag,
    FaClipboard,
    FaBox,
    FaCheckSquare,
    FaClock,
    FaPen,
    FaWeight,
} from "react-icons/fa"; // Ícones

export default function FormPage() {
    const [formData, setFormData] = useState({
        name: "",
        category: "",
        description: "",
        quantity: 0,
        size: "",
        model: "",
        brand: "",
        unitOrBox: false,
        deliveryCompany: "",
        deliveredBy: "",
        receivedBy: "",
        deliveryTime: "",
    });

    const router = useRouter();

    const categories = ["Eletrônicos", "Móveis", "Alimentos", "Vestuário", "Outros"];
    const deliveryCompanies = [
        "Mercado Livre",
        "Shein",
        "Shopee",
        "Amazon",
        "Outros",
    ];

    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;

        if (e.target instanceof HTMLInputElement && e.target.type === "checkbox") {
            setFormData({ ...formData, [name]: e.target.checked });
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };

    const setCurrentTime = () => {
        const currentTime = new Date().toLocaleTimeString("pt-BR", {
            hour: "2-digit",
            minute: "2-digit",
        });
        setFormData({ ...formData, deliveryTime: currentTime });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await fetch(
                "https://ppscannerbackend-production.up.railway.app/api/inventory",
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(formData),
                }
            );
            if (!response.ok) throw new Error("Erro ao cadastrar produto.");
            Swal.fire("Sucesso!", "Produto cadastrado com sucesso!", "success");
            router.push("/inventory");
        } catch (error) {
            Swal.fire("Erro!", "Falha ao cadastrar produto.", "error");
        }
    };

    return (
        <div className="p-6 md:p-12 bg-gray-100 min-h-screen relative z-10">
            <div className="max-w-4xl mx-auto bg-white shadow-xl rounded-lg p-8">
                <h1 className="text-4xl font-bold mb-8 text-gray-800 text-center">
                    Cadastrar Produto
                </h1>
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Nome e Categoria */}
                    <div className="space-y-4">
                        <div className="flex items-center space-x-3">
                            <FaUser className="text-green-500" />
                            <input
                                name="name"
                                type="text"
                                placeholder="Nome do Produto"
                                className="w-full border border-gray-300 p-3 rounded-lg focus:ring focus:ring-green-300"
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                        <div className="flex items-center space-x-3">
                            <FaTag className="text-green-500" />
                            <select
                                name="category"
                                className="w-full border border-gray-300 p-3 rounded-lg focus:ring focus:ring-green-300"
                                onChange={handleInputChange}
                                required
                            >
                                <option value="">Selecione uma Categoria</option>
                                {categories.map((cat) => (
                                    <option key={cat} value={cat}>
                                        {cat}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Modelo e Marca */}
                    <div className="space-y-4">
                        <div className="flex items-center space-x-3">
                            <FaClipboard className="text-green-500" />
                            <input
                                name="model"
                                type="text"
                                placeholder="Modelo do Produto"
                                className="w-full border border-gray-300 p-3 rounded-lg focus:ring focus:ring-green-300"
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                        <div className="flex items-center space-x-3">
                            <FaBox className="text-green-500" />
                            <input
                                name="brand"
                                type="text"
                                placeholder="Marca"
                                className="w-full border border-gray-300 p-3 rounded-lg focus:ring focus:ring-green-300"
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                    </div>

                    {/* Descrição */}
                    <div className="space-y-4">
                        <div className="flex items-center space-x-3">
                            <FaPen className="text-green-500" />
                            <textarea
                                name="description"
                                placeholder="Descrição do Produto"
                                className="w-full border border-gray-300 p-3 rounded-lg focus:ring focus:ring-green-300"
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                    </div>

                    {/* Quantidade e Tamanho */}
                    <div className="space-y-4">
                        <div className="flex items-center space-x-3">
                            <FaWeight className="text-green-500" />
                            <input
                                name="quantity"
                                type="number"
                                placeholder="Quantidade"
                                className="w-full border border-gray-300 p-3 rounded-lg focus:ring focus:ring-green-300"
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                        <div className="flex items-center space-x-3">
                            <FaTag className="text-green-500" />
                            <select
                                name="size"
                                className="w-full border border-gray-300 p-3 rounded-lg focus:ring focus:ring-green-300"
                                onChange={handleInputChange}
                                required
                            >
                                <option value="">Selecione o Tamanho</option>
                                <option value="P">P</option>
                                <option value="M">M</option>
                                <option value="G">G</option>
                            </select>
                        </div>
                    </div>

                    {/* CheckBox */}
                    <div className="flex items-center space-x-3">
                        <FaCheckSquare className="text-green-500" />
                        <input
                            name="unitOrBox"
                            type="checkbox"
                            id="unitOrBox"
                            className="h-5 w-5 text-green-500 border-gray-300 rounded focus:ring-green-300"
                            onChange={handleInputChange}
                        />
                        <label htmlFor="unitOrBox" className="text-gray-700">
                            Por Caixa (desmarcar para Unidade)
                        </label>
                    </div>

                    {/* Entrega */}
                    <div className="space-y-4">
                        <div className="flex items-center space-x-3">
                            <FaUser className="text-green-500" />
                            <input
                                name="deliveredBy"
                                type="text"
                                placeholder="Entregue Por"
                                className="w-full border border-gray-300 p-3 rounded-lg focus:ring focus:ring-green-300"
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                        <div className="flex items-center space-x-3">
                            <FaUser className="text-green-500" />
                            <input
                                name="receivedBy"
                                type="text"
                                placeholder="Recebido Por"
                                className="w-full border border-gray-300 p-3 rounded-lg focus:ring focus:ring-green-300"
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                        <div className="flex items-center space-x-3">
                            <FaClock className="text-green-500" />
                            <input
                                name="deliveryTime"
                                type="text"
                                placeholder="Horário de Entrega"
                                value={formData.deliveryTime}
                                className="w-full border border-gray-300 p-3 rounded-lg focus:ring focus:ring-green-300"
                                onChange={handleInputChange}
                            />
                            <button
                                type="button"
                                onClick={setCurrentTime}
                                className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
                            >
                                Hora Atual
                            </button>
                        </div>
                    </div>

                    {/* Botão */}
                    <button
                        type="submit"
                        className="w-full bg-green-500 text-white px-4 py-3 rounded-lg hover:bg-green-600 font-bold shadow-md"
                    >
                        Cadastrar Produto
                    </button>
                </form>
            </div>
        </div>
    );
}