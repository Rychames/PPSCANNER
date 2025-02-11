export interface SendFormCompany {
    logo?: File | string; 
    name: string;
    cnpj: string;
    address: string;
}

export interface Company {
    id: number;
    logo: string;
    name: string;
    cnpj: string;
    address: string;
    products_count?: number;
    created_at?: string;
    updated_at?: string;
}

// Tipo utilitário para atualizações parciais
export type UpdateCompany = Partial<SendFormCompany> & { id: number };