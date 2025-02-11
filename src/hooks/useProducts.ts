import { useState, useEffect } from "react";
import axios from "axios";
import { Product } from "@/models";
import api from "@/services/api";
import { ErrorResponse, SuccessResponse } from "@/types";

export function useProducts(): SuccessResponse<Product> | ErrorResponse {
  const [reqProducts, setReqProducts] = useState<SuccessResponse<Product> | ErrorResponse>({
    success: false,
    message: "",
    loading: true,
    data: null,
    error: [],
  });

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        
        const response = await api.get<SuccessResponse<Product>>("/api/products/");

        setReqProducts({
          success: true,
          message: response.data.message,
          loading: false,
          data: response.data.data,
          error: null,
        });
      } catch (err: any) {
        const errorResponse = err.response?.data || {
          message: "Erro ao buscar produtos.",
          error: ["Erro desconhecido"],
        };

        setReqProducts({
          success: false,
          message: errorResponse.message,
          loading: false,
          data: null,
          error: errorResponse.error,
        });
      }
    };

    fetchProducts();
  }, []);

  return reqProducts;
}
