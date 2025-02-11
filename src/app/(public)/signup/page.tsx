"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function SignupPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [toast, setToast] = useState<{ type: 'success' | 'danger', message: string } | null>(null);
    const router = useRouter();

    useEffect(() => {
        if (toast) {
            const timer = setTimeout(() => setToast(null), 5000);
            return () => clearTimeout(timer);
        }
    }, [toast]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setToast(null);

        if (password !== confirmPassword) {
            setToast({ type: 'danger', message: "As senhas não coincidem" });
            return;
        }

        try {
            const response = await axios.post('user/register/', {
                email: email.toLowerCase().trim(),
                password,
                confirm_password: confirmPassword
            });

            if (response.data.success) {
                router.push(`/VerifyCodePage?email=${encodeURIComponent(email)}`);
            }
        } catch (error: any) {
            const errorMessage = error.response?.data?.message || 
                               error.response?.data?.data?.[0] || 
                               "Erro ao cadastrar. Tente novamente.";
            setToast({ type: 'danger', message: errorMessage });
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            {/* Toast Container */}
            <div className="fixed top-4 right-4 z-50">
                {toast && (
                    <div className={`flex items-center w-full max-w-xs p-4 mb-4 rounded-lg shadow-sm 
                        ${toast.type === 'success' ? 'bg-green-100 dark:bg-green-800 text-green-700 dark:text-green-200' 
                        : 'bg-red-100 dark:bg-red-800 text-red-700 dark:text-red-200'}`}>
                        {/* Ícone e mensagem (mesmo formato da VerifyCodePage) */}
                    </div>
                )}
            </div>

            <div className="flex items-center justify-center min-h-screen">
                <div className="w-full max-w-md p-6 space-y-8 bg-white rounded-lg shadow-md dark:bg-gray-800">
                    <div className="text-center">
                        <img src="/ppscanner.svg" alt="Logo" className="w-24 h-24 mx-auto" />
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mt-4">
                            Criar Nova Conta
                        </h1>
                    </div>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                                Email
                            </label>
                            <input
                                type="email"
                                id="email"
                                className="w-full p-2.5 bg-gray-50 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                                placeholder="nome@empresa.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                        <div>
                            <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                                Senha
                            </label>
                            <input
                                type="password"
                                id="password"
                                className="w-full p-2.5 bg-gray-50 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                        <div>
                            <label htmlFor="confirm-password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                                Confirmar Senha
                            </label>
                            <input
                                type="password"
                                id="confirm-password"
                                className="w-full p-2.5 bg-gray-50 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                                placeholder="••••••••"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                            />
                        </div>
                        <button
                            type="submit"
                            className="w-full px-5 py-3 text-base font-medium text-center text-white bg-primary-600 rounded-lg hover:bg-primary-700 focus:ring-4 focus:ring-primary-300 dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
                        >
                            Criar Conta
                        </button>
                        <div className="text-sm font-medium text-gray-500 dark:text-gray-400 text-center">
                            Já tem uma conta?{" "}
                            <Link href="/login" className="text-primary-600 hover:underline dark:text-primary-500">
                                Faça login aqui
                            </Link>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}