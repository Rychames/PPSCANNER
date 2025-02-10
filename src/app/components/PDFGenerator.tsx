"use client";
import React, { useRef, useState } from "react";
import SignatureCanvas from "react-signature-canvas";
import {
  PDFDownloadLink,
  Document,
  Page,
  Text,
  View,
  Image,
  StyleSheet,
} from "@react-pdf/renderer";
import Modal from "react-modal";
import { Product, Company } from "@/app/models";

// Estilos para o PDF
const styles = StyleSheet.create({
  page: {
    flexDirection: "column",
    backgroundColor: "#FFFFFF",
    padding: 40,
    textAlign: "justify",
    position: "relative", // Para posicionar o rodapé
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
    borderBottomWidth: 1,
    paddingBottom: 10,
  },
  headerCenter: {
    flex: 1,
    flexDirection: "column",
    alignItems: "center",
    marginHorizontal: 10,
  },
  logo: {
    width: 80,
    height: 80,
  },
  companyName: {
    fontSize: 16,
    fontWeight: "bold",
  },
  companyEmail: {
    fontSize: 12,
  },
  companyContact: {
    fontSize: 12,
  },
  title: {
    fontSize: 20,
    textAlign: "center",
    marginVertical: 20,
    fontWeight: "bold",
  },
  contentText: {
    fontSize: 14,
    marginBottom: 20,
    textAlign: "justify",
    lineHeight: 1.5,
  },
  // Layout para as assinaturas no PDF (lado a lado)
  signatureRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 30,
  },
  signatureColumn: {
    flex: 1,
    alignItems: "center",
  },
  // Definimos apenas a largura para preservar a proporção da imagem
  signatureImage: {
    width: 250,
  },
  signatureLine: {
    borderBottomWidth: 1,
    width: "80%",
    marginTop: 10,
    marginBottom: 5,
  },
  signatureText: {
    fontSize: 12,
    marginTop: 5,
  },
  footer: {
    position: "absolute",
    bottom: 20,
    left: 40,
    right: 40,
    textAlign: "center",
    fontSize: 12,
    borderTopWidth: 1,
    paddingTop: 5,
  },
});

interface PDFDocumentProps {
  product: Product;
  delivererSignature: string;
  directorSignature: string;
  company: Company;
}

const PDFDocument = ({
  product,
  delivererSignature,
  directorSignature,
  company,
}: PDFDocumentProps) => (
  <Document>
    <Page size="A4" style={styles.page}>
      {/* Cabeçalho */}
      <View style={styles.header}>
        {company?.logo && <Image src={company.logo} style={styles.logo} />}
        <View style={styles.headerCenter}>
          <Text style={styles.companyName}>{company?.name}</Text>
          <Text style={styles.companyEmail}>{company?.name}</Text>
          <Text style={styles.companyContact}>{company?.name}</Text>
        </View>
        {company?.logo && <Image src={company.logo} style={styles.logo} />}
      </View>

      <Text style={styles.title}>Comprovante de Entrega</Text>
      <Text style={styles.contentText}>
        O produto "{product.name}" (Modelo: {product.model}, Categoria: {product.category}, Tamanho: {product.size})
        da empresa {product.company_brand} foi entregue pelo funcionário {product.delivered_by} da empresa {product.current_company?.name}
        para {product.received_by.first_name} {product.received_by.last_name} da empresa {product.received_company?.name}
        no dia {new Date(product.date_receipt).toLocaleDateString()} às {new Date(product.date_receipt).toLocaleTimeString()}.
      </Text>

      {/* Assinaturas lado a lado */}
      <View style={styles.signatureRow}>
        <View style={styles.signatureColumn}>
          {delivererSignature && (
            <>
              <Image src={delivererSignature} style={styles.signatureImage} />
              <View style={styles.signatureLine} />
            </>
          )}
          <Text style={styles.signatureText}>Assinatura do Entregador</Text>
        </View>
        <View style={styles.signatureColumn}>
          {directorSignature && (
            <>
              <Image src={directorSignature} style={styles.signatureImage} />
              <View style={styles.signatureLine} />
            </>
          )}
          <Text style={styles.signatureText}>Assinatura do Diretor do Almoxarifado</Text>
        </View>
      </View>

      {/* Rodapé */}
      <View style={styles.footer}>
        <Text>CNPJ: {company?.cnpj}</Text>
      </View>
    </Page>
  </Document>
);

const PDFGenerator = ({
  product,
  company,
}: {
  product: Product;
  company: Company;
}) => {
  // Referências dos canvas de assinatura
  const delivererSignatureRef = useRef<SignatureCanvas>(null);
  const directorSignatureRef = useRef<SignatureCanvas>(null);

  // Estados para armazenar os dataURLs das assinaturas
  const [delivererSignatureDataUrl, setDelivererSignatureDataUrl] = useState<string>("");
  const [directorSignatureDataUrl, setDirectorSignatureDataUrl] = useState<string>("");

  // Controle do modal e do passo atual
  const [modalIsOpen, setModalIsOpen] = useState<boolean>(false);
  const [currentStep, setCurrentStep] = useState<number>(1); // 1: Entregador, 2: Diretor

  // Função para avançar no fluxo de assinaturas
  const handleNextStep = () => {
    if (currentStep === 1) {
      // Salva a assinatura do entregador e vai para a próxima etapa
      if (delivererSignatureRef.current) {
        setDelivererSignatureDataUrl(delivererSignatureRef.current.toDataURL());
      }
      setCurrentStep(2);
    } else if (currentStep === 2) {
      // Salva a assinatura do diretor e finaliza o modal
      if (directorSignatureRef.current) {
        setDirectorSignatureDataUrl(directorSignatureRef.current.toDataURL());
      }
      setModalIsOpen(false);
      setCurrentStep(1); // Reseta para uso futuro
    }
  };

  const handleClearDeliverer = () => {
    delivererSignatureRef.current?.clear();
  };

  const handleClearDirector = () => {
    directorSignatureRef.current?.clear();
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="flex flex-col items-center">
      {/* Botões de ação (não serão impressos) */}
      <div className="no-print flex flex-row items-center justify-center gap-4 mt-4">
        <button
          onClick={() => {
            setModalIsOpen(true);
            setCurrentStep(1);
          }}
          className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition"
        >
          Assinar
        </button>
        {delivererSignatureDataUrl && directorSignatureDataUrl ? (
          <PDFDownloadLink
            document={
              <PDFDocument
                product={product}
                delivererSignature={delivererSignatureDataUrl}
                directorSignature={directorSignatureDataUrl}
                company={company}
              />
            }
            fileName={`comprovante_${product.name}.pdf`}
            className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-md shadow-md transition"
          >
            Salvar PDF
          </PDFDownloadLink>
        ) : (
          <button
            disabled
            className="bg-gray-300 text-white font-semibold py-2 px-4 rounded-md shadow-md transition cursor-not-allowed"
          >
            Salvar PDF
          </button>
        )}
        <button
          onClick={handlePrint}
          className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-md transition"
        >
          Imprimir
        </button>
      </div>

      {/* Modal de assinatura com fluxo sequencial */}
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={() => {
          setModalIsOpen(false);
          setCurrentStep(1);
        }}
        contentLabel="Assinar"
        ariaHideApp={false}
        overlayClassName="no-print fixed inset-0 bg-black bg-opacity-50 flex justify-end items-center"
        className="no-print bg-white p-6 rounded-md shadow-lg w-full max-w-xl md:max-w-2xl mr-8"
      >
        {currentStep === 1 && (
          <div>
            <h2 className="text-lg font-semibold mb-4 text-center">Assinatura do Entregador</h2>
            <div className="flex flex-col items-center">
              <SignatureCanvas
                ref={delivererSignatureRef}
                penColor="black"
                canvasProps={{
                  width: 800,
                  height: 100,
                  className: "border border-gray-500 rounded-md",
                }}
              />
              <button
                onClick={handleClearDeliverer}
                className="bg-gray-500 text-white py-1 px-3 mt-2 rounded-md hover:bg-gray-600 transition"
              >
                Limpar
              </button>
            </div>
            <div className="flex justify-center mt-4">
              <button
                onClick={handleNextStep}
                className="bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600 transition"
              >
                Próximo
              </button>
            </div>
          </div>
        )}
        {currentStep === 2 && (
          <div>
            <h2 className="text-lg font-semibold mb-4 text-center">Assinatura do Diretor do Almoxarifado</h2>
            <div className="flex flex-col items-center">
              <SignatureCanvas
                ref={directorSignatureRef}
                penColor="black"
                canvasProps={{
                  width: 800,
                  height: 100,
                  className: "border border-gray-500 rounded-md",
                }}
              />
              <button
                onClick={handleClearDirector}
                className="bg-gray-500 text-white py-1 px-3 mt-2 rounded-md hover:bg-gray-600 transition"
              >
                Limpar
              </button>
            </div>
            <div className="flex justify-center mt-4">
              <button
                onClick={handleNextStep}
                className="bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600 transition"
              >
                Salvar Assinaturas
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default PDFGenerator;
