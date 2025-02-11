import api from "./api";
import { Product } from "@/models/product.model";

export const getProducts = async (): Promise<Product[]> => {
  const response = await api.get("/products/");
  return response.data;
};

export const getProductById = async (id: string): Promise<Product> => {
  const response = await api.get(`/products/${id}`);
  return response.data;
};
