"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { useRouter, useSearchParams } from "next/navigation";


export default function VerifyCodePage() {
    const [email, setEmail] = useState("");
    const [code, setCode] = useState("");
    const [toast, setToast] = useState<{ type: 'success' | 'danger', message: string } | null>(null);
    const router = useRouter();
    const searchParams = useSearchParams()!;

    useEffect(() => {
        const emailParam = searchParams.get('email');
        if (emailParam) {
            try {
                const decodedEmail = decodeURIComponent(emailParam);
                if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(decodedEmail)) {
                    setEmail(decodedEmail);
                } else {
                    setToast({ type: 'danger', message: "Email inválido" });
                    setTimeout(() => router.push("/signup"), 3000);
                }
            } catch (error) {
                setToast({ type: 'danger', message: "Erro ao processar email" });
                setTimeout(() => router.push("/signup"), 3000);
            }
        } else {
            setToast({ type: 'danger', message: "Email não encontrado" });
            setTimeout(() => router.push("/signup"), 3000);
        }
    }, [searchParams, router]);

    useEffect(() => {
        if (toast) {
            const timer = setTimeout(() => setToast(null), 5000);
            return () => clearTimeout(timer);
        }
    }, [toast]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setToast(null);

        if (!code.match(/^\d{6}$/)) {
            setToast({ type: 'danger', message: "Código deve conter 6 dígitos" });
            return;
        }

        try {
            const response = await axios.post('user/register/verify-code/', {
                email,
                code
            });

            if (response.data.success) {
                setToast({
                    type: 'success',
                    message: response.data.message || "Verificação realizada com sucesso!"
                });
                setTimeout(() => router.push("/login"), 2000);
            }
        } catch (error: any) {
            const errorMessage = error.response?.data?.message || 
                               error.response?.data?.data?.[0] || 
                               "Erro na verificação. Tente novamente.";
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
                        <div className="inline-flex items-center justify-center flex-shrink-0 w-8 h-8">
                            {toast.type === 'success' ? (
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 8.207-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L9 10.586l3.293-3.293a1 1 0 0 1 1.414 1.414Z"/>
                                </svg>
                            ) : (
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 11.793a1 1 0 1 1-1.414 1.414L10 11.414l-2.293 2.293a1 1 0 0 1-1.414-1.414L8.586 10 6.293 7.707a1 1 0 0 1 1.414-1.414L10 8.586l2.293-2.293a1 1 0 0 1 1.414 1.414L11.414 10l2.293 2.293Z"/>
                                </svg>
                            )}
                        </div>
                        <div className="ml-3 text-sm font-normal">{toast.message}</div>
                        <button onClick={() => setToast(null)} className="ml-auto -mx-1.5 -my-1.5 rounded-lg p-1.5 hover:bg-gray-50 dark:hover:bg-gray-700">
                            <span className="sr-only">Fechar</span>
                            <svg className="w-3 h-3" fill="none" viewBox="0 0 14 14">
                                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
                            </svg>
                        </button>
                    </div>
                )}
            </div>

            {/* Formulário */}
            <div className="flex items-center justify-center min-h-screen">
                <div className="w-full max-w-md p-6 space-y-8 bg-white rounded-lg shadow-md dark:bg-gray-800">
                    <h1 className="text-2xl font-bold text-center text-gray-900 dark:text-white">
                        Verificação de Código
                    </h1>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <input type="hidden" name="email" value={email} />
                        <div>
                            <label htmlFor="code" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                                Código de 6 dígitos enviado para:
                                <div className="mt-1 font-medium text-primary-600 dark:text-primary-400">
                                    {email}
                                </div>
                            </label>
                            <input
                                type="text"
                                id="code"
                                inputMode="numeric"
                                pattern="[0-9]{6}"
                                maxLength={6}
                                className="w-full p-2.5 text-center text-xl bg-gray-50 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                                placeholder="••••••"
                                value={code}
                                onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
                                required
                                autoFocus
                            />
                        </div>
                        <button
                            type="submit"
                            className="w-full px-5 py-3 text-base font-medium text-center text-white bg-primary-600 rounded-lg hover:bg-primary-700 focus:ring-4 focus:ring-primary-300 dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
                        >
                            Verificar Código
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}