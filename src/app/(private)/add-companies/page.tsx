"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import Swal from "sweetalert2";
import Image from "next/image";

export interface SendFormCompany {
    logo: File | null;
    name: string;
    cnpj: string;
    address: string;
}

export default function AddCompanyPage() {
    const router = useRouter();
    const [formData, setFormData] = useState<SendFormCompany>({
        logo: null,
        name: "",
        cnpj: "",
        address: ""
    });

    const [previewImage, setPreviewImage] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setIsLoading(true);

        if (!formData.name || !formData.cnpj || !formData.address) {
            setError("Todos os campos são obrigatórios");
            setIsLoading(false);
            return;
        }

        try {
            const formDataToSend = new FormData();
            formDataToSend.append("name", formData.name);
            formDataToSend.append("cnpj", formData.cnpj);
            formDataToSend.append("address", formData.address);
            if (formData.logo) {
                formDataToSend.append("logo", formData.logo);
            }
            
            const response = await axios.post('api/companies/', formDataToSend);

            if (response.status === 201) {
                Swal.fire({
                    title: 'Sucesso!',
                    text: 'Empresa cadastrada com sucesso',
                    icon: 'success',
                    confirmButtonText: 'OK'
                }).then(() => {
                    router.push("/"); // Ajuste a rota conforme necessário
                });
            }
        } catch (error: any) {
            console.error("Erro ao cadastrar empresa:", error);
            setError(error.response?.data?.message || "Erro ao cadastrar empresa");
            Swal.fire('Erro!', error.response?.data?.message || 'Falha no cadastro', 'error');
        } finally {
            setIsLoading(false);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] || null;
        setFormData(prev => ({
            ...prev,
            logo: file
        }));

        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewImage(reader.result as string);
            };
            reader.readAsDataURL(file);
        } else {
            setPreviewImage(null);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden p-8">
                <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
                    Cadastrar Nova Empresa
                </h1>

                {error && (
                    <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Nome da Empresa *
                        </label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            required
                            minLength={1}
                            maxLength={255}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            CNPJ *
                        </label>
                        <input
                            type="text"
                            name="cnpj"
                            value={formData.cnpj}
                            onChange={handleInputChange}
                            required
                            minLength={1}
                            maxLength={40}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Endereço Completo *
                        </label>
                        <input
                            type="text"
                            name="address"
                            value={formData.address}
                            onChange={handleInputChange}
                            required
                            minLength={1}
                            maxLength={300}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                        />
                    </div>

                    {/* Upload de Logo */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Logo da Empresa (Opcional)
                        </label>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleFileChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg cursor-pointer"
                        />
                        {previewImage && (
                            <div className="mt-4 flex justify-center">
                                <Image src={previewImage} alt="Preview" width={150} height={150} className="rounded-lg shadow-md"/>
                            </div>
                        )}
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50"
                    >
                        {isLoading ? 'Cadastrando...' : 'Cadastrar Empresa'}
                    </button>
                </form>
            </div>
        </div>
    );
}
