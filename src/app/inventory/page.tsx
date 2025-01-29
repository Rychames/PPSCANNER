"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { FaEdit, FaTrash, FaSearch } from "react-icons/fa";
import axios from "axios";
import { Product } from "@/app/models";

// Definir o tipo para o item do inventário


export default function InventoryPage() {
  const [items, setItems] = useState<Product[]>([]); // Todos os itens
  const [filteredItems, setFilteredItems] = useState<Product[]>([]); // Itens filtrados
  const [categoryFilter, setCategoryFilter] = useState(""); // Filtro de categoria
  const [searchTerm, setSearchTerm] = useState(""); // Termo de pesquisa
  const [loading, setLoading] = useState(true); // Estado de carregamento
  const router = useRouter();

  const token = localStorage.getItem('authToken');

  // Carregar itens da API ao montar o componente
  useEffect(() => {
    const fetchItems = async () => {
      console.log("📡 Buscando itens do inventário...");
      try {
<<<<<<< HEAD
        const response = await axios.get(
          "http://127.0.0.1:8000/api/products/",
          
        );      
        const data = response.data['data'];
        console.log(data);
        setItems(data);
        setFilteredItems(data); // Inicialmente, todos os itens são exibidos
=======
        const response = await axios.get(`${BASE_URL}api/inventory`); 
        console.log("✅ Dados recebidos da API:", response.data);

        // Garantindo que as imagens sejam arrays válidos
        const formattedData = response.data.map((item: InventoryItem) => ({
          ...item,
          images: item.images ? item.images : [], // Se images for null, converte para []
        }));

        setItems(formattedData);
        setFilteredItems(formattedData);
>>>>>>> fdb4d90b821498e438d3a8d10fc1a52dcf5bdb24
      } catch (error) {
        console.error("❌ Erro ao carregar os itens:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchItems();
  }, []);

  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const category = e.target.value;
    setCategoryFilter(category);
    applyFilters(searchTerm, category);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value;
    setSearchTerm(term);
    applyFilters(term, categoryFilter);
  };

  const applyFilters = (term: string, category: string) => {
    let filtered = items;

    if (category) {
      filtered = filtered.filter((item) => item.category === category);
    }

    if (term) {
      filtered = filtered.filter((item) =>
        item.name.toLowerCase().includes(term.toLowerCase())
      );
    }

    setFilteredItems(filtered);
  };

  const handleDelete = async (id: number) => {
    console.log(`🗑️ Tentando excluir o item ID: ${id}`);
    try {
      const response = await axios.delete(`${BASE_URL}api/inventory/${id}`);
      console.log("✅ Produto excluído com sucesso:", response.data);

      setItems((prev) => prev.filter((item) => item.id !== id));
      setFilteredItems((prev) => prev.filter((item) => item.id !== id));
    } catch (error) {
      console.error("❌ Erro ao excluir o produto:", error);
    }
  };

  return (
    <div className="p-4 md:p-8 bg-gray-100 min-h-screen">
      {loading ? (
        <div className="flex justify-center items-center h-full">
          <div className="loader border-t-4 border-blue-500 rounded-full w-16 h-16 animate-spin"></div>
        </div>
      ) : (
        <div className="flex">
          {/* Sidebar com Filtros */}
          <div className="w-1/4 p-4 bg-white shadow rounded-lg">
            <h2 className="text-lg font-bold mb-4">Filtros</h2>
            <div className="mb-4">
              <label className="block font-medium text-gray-700 mb-2">
                Categoria
              </label>
              <select
                className="border border-gray-300 p-2 rounded w-full"
                value={categoryFilter}
                onChange={handleFilterChange}
              >
                <option value="">Todas as Categorias</option>
                {[...new Set(items.map((item) => item.category))].map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Área de Resultados */}
          <div className="w-3/4 pl-6">
            {/* Barra de Pesquisa */}
            <div className="flex items-center mb-6">
              <input
                type="text"
                className="border border-gray-300 p-2 rounded-l w-full"
                placeholder="Pesquisar produtos..."
                value={searchTerm}
                onChange={handleSearchChange}
              />
              <button className="bg-blue-500 text-white px-4 py-2 rounded-r">
                <FaSearch />
              </button>
            </div>

            {/* Lista de Itens */}
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredItems.map((item) => (
                <li
                  key={item.id}
                  className="p-4 bg-white shadow rounded-lg relative"
                  onClick={() => router.push(`/product/${item.id}`)}
                >
                  <h2 className="text-xl font-bold">{item.name}</h2>

                  {/* Exibindo imagem principal */}
                  {item.images && item.images.length > 0 ? (
                    <div>
                      <img
<<<<<<< HEAD
                        src={item.images[0].image}
=======
                        src={`data:image/png;base64,${item.images[0]}`}
>>>>>>> fdb4d90b821498e438d3a8d10fc1a52dcf5bdb24
                        alt={`${item.name} image`}
                        className="w-full h-48 object-cover rounded-lg mb-4"
                      />
                      {item.images.length > 1 && (
                        <p>{`Mais ${item.images.length - 1} imagem(s) disponível(s)`}</p>
                      )}
                    </div>
                  ) : (
                    <p>No image available</p>
                  )}

                  {/* Informações adicionais */}
                  <p>Categoria: {item.category || "Sem Categoria"}</p>
                  <p>Descrição: {item.description}</p>
                  <p>Quantidade: {item.quantity}</p>

                  {/* Botões de Ação */}
                  <div className="absolute top-4 right-4 flex space-x-2">
                    <button
                      className="bg-green-500 text-white p-2 rounded hover:bg-green-600"
                      onClick={() => router.push(`/product/edit/${item.id}`)}
                    >
                      <FaEdit />
                    </button>
                    <button
                      className="bg-red-500 text-white p-2 rounded hover:bg-red-600"
                      onClick={() => handleDelete(item.id)}
                    >
                      <FaTrash />
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
