"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { QRCodeSVG } from "qrcode.react";
import axios from "axios";
import PDFGenerator from "@/components/PDFGenerator";
import { useFilter } from "@/context/FilterContext";
import { Product } from "@/models";
import { useProducts } from "@/hooks/useProducts";

export default function ProductDetails() {
  const params = useParams();
  const { companyId, productId } = params as {
    companyId: string;
    productId: string;
  };

  const [product, setProduct] = useState<Product | null>(null);
  const [company, setCompany] = useState<Product["current_company"] | null>(null);
  const { filters } = useFilter();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        if (!productId) return;
        const response = await axios.get(
          `api/products/${productId}/`
        );
        const productData: Product = response.data.data;
        setProduct(productData);
        setCompany(productData.current_company || null);
      } catch (error) {
        console.error("Erro ao buscar o produto:", error);
      }
    };
    fetchProduct();
  }, [productId]);

  if (!product) {
    return (
      <div className="flex items-center justify-center min-h-screen text-gray-600">
        Carregando...
      </div>
    );
  }

  return (
    // Removemos a classe "min-h-screen" ou ela será sobrescrita via CSS de impressão
    <div className="bg-gray-50 p-6 print-area">
      <div className="max-w-4xl mx-auto bg-white shadow-xl rounded-lg overflow-hidden animate-fadeIn">
        {filters.onlyQRCode ? (
          // Modo "Somente QR Code": conteúdo centralizado para impressão
          <div className="flex flex-col items-center justify-center p-6">
            <h1 className="text-2xl font-bold text-gray-800 mb-4">
              {product.name}
            </h1>
            <QRCodeSVG
              value={`https://ppscanner.vercel.app/companies/${companyId}/product/${product.id}`}
              size={256}
              className="mx-auto"
            />
            <p className="mt-4 text-sm text-gray-600 text-center">
              Escaneie o código para acessar a página do produto.
            </p>
            {/* Botões são renderizados mas possuem a classe no-print */}
            <div className="no-print mt-4">
              {company && <PDFGenerator product={product} company={company} />}
            </div>
          </div>
        ) : (
          // Layout Normal (detalhes do produto, galeria, etc.)
          <div className="md:flex">
            {/* Área de Imagem ou Galeria */}
            <div className="md:w-1/2 relative">
              <div className="h-full p-6 flex flex-col">
                {!filters.removeImages &&
                  product.images &&
                  product.images.length > 0 ? (
                  <div>
                    <h2 className="text-lg font-semibold text-gray-800 mb-2">
                      Imagens do Produto
                    </h2>
                    <div className="grid grid-cols-2 gap-2">
                      {product.images.map((img) => (
                        <div
                          key={img.id}
                          className="overflow-hidden rounded-lg border border-gray-200"
                        >
                          <img
                            src={img.image}
                            alt={product.name}
                            className="w-full h-32 object-cover transform transition duration-300 hover:scale-105"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="flex-1 flex items-center justify-center border-2 border-dashed border-gray-200 rounded-lg p-4">
                    <span className="text-gray-400">
                      Sem imagens cadastradas
                    </span>
                  </div>
                )}
              </div>
            </div>
            {/* Área de Detalhes */}
            <div className="md:w-1/2 p-6 flex flex-col justify-between">
              <div className="space-y-4">
                <h1 className="text-3xl font-bold text-gray-800">
                  {product.name}
                </h1>
                <div className="grid grid-cols-2 gap-4">
                  {filters.showProductDetails && (
                    <>
                      <div>
                        <p className="text-gray-600">
                          <span className="font-semibold">Categoria:</span>{" "}
                          {product.category}
                        </p>
                        <p className="text-gray-600">
                          <span className="font-semibold">Modelo:</span>{" "}
                          {product.model}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-600">
                          <span className="font-semibold">Marca:</span>{" "}
                          {product.company_brand}
                        </p>
                        <p className="text-gray-600">
                          <span className="font-semibold">Quantidade:</span>{" "}
                          {product.quantity}
                        </p>
                      </div>
                    </>
                  )}
                </div>
                <p className="text-gray-600">
                  <span className="font-semibold">Descrição:</span>{" "}
                  {product.description}
                </p>
                <p className="text-gray-600">
                  <span className="font-semibold">Entregue por:</span>{" "}
                  {product.delivered_by}
                </p>
                {filters.showUserInfo && product.received_by && (
                  <p className="text-gray-600">
                    <span className="font-semibold">Recebido por:</span>{" "}
                    {product.received_by.email}
                  </p>
                )}
                {filters.showCompanyInfo && company && (
                  <p className="text-gray-600">
                    <span className="font-semibold">Empresa:</span>{" "}
                    {company.name}
                  </p>
                )}
              </div>
              <div className="mt-6">
                <div className="flex items-center justify-center mb-4">
                  <QRCodeSVG
                    value={`https://ppscanner.vercel.app/companies/${companyId}/product/${product.id}`}
                    size={128}
                    className="mx-auto"
                  />
                </div>
                {/* Botões (PDFGenerator) – não serão impressos */}
                <div className="no-print">
                  {company && <PDFGenerator product={product} company={company} />}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
