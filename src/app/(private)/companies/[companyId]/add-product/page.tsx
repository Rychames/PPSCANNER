"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "next/navigation";
import ProductForm from "@/components/ProductForm";
import { Company } from "@/models";

export default function AddProductPage() {
    const params = useParams()!;
    const companyId = params.companyId as string; 

    const [company, setCompany] = useState<Company | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    useEffect(() => {
        const loadCompany = async () => {
            if (!companyId) return;

            try {
                setIsLoading(true);
                const response = await axios.get(`api/companies/${companyId}`);
                console.log("Resposta da API:", response.data); // Debug

                // Ajuste conforme a estrutura real da sua API:
                const companyData = response.data.data || response.data;
                setCompany(companyData);
            } catch (error) {
                console.error("Erro detalhado:", error);
            } finally {
                setIsLoading(false);
            }
        };

        loadCompany();
    }, [companyId]);

    if (isLoading) return <div>Carregando...</div>;
    if (!company) return <div>Empresa não encontrada</div>;

    return <ProductForm company={company} />;
}
