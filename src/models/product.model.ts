import { Company } from "./company.model";
import { UserModel } from "./user.model";
import { ProductImage } from "./product-image.model";

export interface SendFormProduct{
    name: string,
    category: string,
    model: string,
    company_brand: string,
    description: string,
    quantity: number,
    size: string, 
    price?: number,
    lot: boolean,
    sector: string,
    delivered_by: string,
    delivery_man_signature?: File[] | null,
    received_company: number,
    current_company: number,
    images: File[] | null,
}

export interface Product {
    id: number,
    name: string,
    category: string,
    model: string,
    company_brand: string,
    description: string,
    quantity: number,
    size: string, 
    price?: number,
    lot: boolean,
    sector: string,
    delivered_by: string,
    delivery_man_signature?: string,
    received_by: UserModel,
    received_company?: Company,
    date_receipt: Date,
    current_company?: Company,
    images: ProductImage[] | null,
  }