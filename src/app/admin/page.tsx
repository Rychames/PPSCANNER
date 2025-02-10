'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { UserModel, UserRole } from '@/app/models/user.model'; 
import { BASE_URL } from '@/app/utils/constants';


export default function AdminPage() {
  const [users, setUsers] = useState<UserModel[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get('user/manager/');
        const userData = response.data['data'];
        setUsers(userData);
      } catch (error) {
        console.error('Erro ao buscar os usuários:', error);
        alert('Ocorreu um erro ao buscar os usuários.');
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const toggleUserActivation = async (id: number) => {
    const user = users.find((user) => user.id === id);
    if (!user) return;

    const newStatusBoolean = user.is_active !== true;
    const newStatusString = newStatusBoolean ? true : false;

    try {
      await axios.patch(`user/manager/${id}/`, {
        is_active: newStatusBoolean,
      });

      // Atualiza o estado local para refletir a alteração
      setUsers((prevUsers) =>
        prevUsers.map((u) => (u.id === id ? { ...u, is_active: newStatusString } : u))
      );

      alert(`Usuário ${id} ${newStatusBoolean ? 'ativado' : 'desativado'} com sucesso!`);
    } catch (error) {
      console.error('Erro ao atualizar o usuário:', error);
      alert('Ocorreu um erro ao atualizar o usuário.');
    }
  };

  const deleteUser = async (id: number) => {
    try {
      await axios.delete(`user/manager/${id}`);

      // Atualiza o estado removendo o usuário deletado
      setUsers((prevUsers) => prevUsers.filter((user) => user.id !== id));
      alert(`Usuário ${id} deletado com sucesso!`);
    } catch (error) {
      console.error('Erro ao deletar o usuário:', error);
      alert('Ocorreu um erro ao deletar o usuário.');
    }
  };

  const renderTable = (title: string, filterRole: UserRole) => {
    const filteredUsers = users.filter((user) => user.role === filterRole);
    return (
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4">{title}</h2>
        {filteredUsers.length === 0 ? (
          <p>Nenhum usuário encontrado.</p>
        ) : (
          <table className="min-w-full divide-y divide-gray-200 border">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Nome
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ativo
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredUsers.map((user) => (
                <tr key={user.id}>
                  <td className="px-6 py-4 whitespace-nowrap">{user.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{user.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {user.first_name} {user.last_name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {user.is_active === true ? 'Sim' : 'Não'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      onClick={() => toggleUserActivation(user.id!)}
                      className={`px-3 py-1 mr-2 rounded ${user.is_active === true
                          ? 'bg-red-500 hover:bg-red-600'
                          : 'bg-green-500 hover:bg-green-600'
                        } text-white`}
                    >
                      {user.is_active === true ? 'Desativar Acesso' : 'Ativar Acesso'}
                    </button>
                    <button
                      onClick={() => deleteUser(user.id!)}
                      className="bg-gray-700 text-white px-3 py-1 rounded hover:bg-gray-800"
                    >
                      Deletar Conta
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    );
  };

  if (loading) {
    return <p>Carregando usuários...</p>;
  }

  return (
    <div className="p-4">
      <h1 className="text-3xl font-bold mb-6">Administração de Usuários</h1>
      {renderTable('Administradores', 'ADMIN')}
      {renderTable('Moderadores', 'MODERATOR')}
      {renderTable('Contas Comuns', 'COMMON')}
    </div>
  );
}
