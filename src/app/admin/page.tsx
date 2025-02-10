'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {
  UserModel,
  UserRole,
  UpdateSendFormUserManagerModel,
  handleError
} from '@/app/models/user.model';
import { BASE_URL } from '@/app/utils/constants';
import { FiRefreshCw, FiTrash2, FiToggleLeft, FiToggleRight, FiSearch } from 'react-icons/fi';
import { useAuth } from '@/app/context/AuthContext';

export default function AdminPage() {
  const { user: currentUser, setUser } = useAuth();
  const [users, setUsers] = useState<UserModel[]>([]);
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [deleteConfirmation, setDeleteConfirmation] = useState<number | null>(null);

  const roleColors = {
    ADMIN: 'bg-purple-100 text-purple-800',
    MODERATOR: 'bg-blue-100 text-blue-800',
    COMMON: 'bg-gray-100 text-gray-800'
  };

  const filteredUsers = users.filter(user =>
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.last_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const fetchUsers = async () => {
    try {
      const response = await axios.get(`${BASE_URL}user/manager/`);
      setUsers(response.data.data);
    } catch (error) {
      const handledError = handleError(error);
      toast.error(handledError.message);
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  };

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

  const handleRefresh = () => {
    setIsRefreshing(true);
    fetchUsers();
  };

  const toggleUserActivation = async (id: number) => {
    try {
      const user = users.find(u => u.id === id);
      if (!user || user.role === 'ADMIN') return;

      const newStatus = !user.is_active;
      const payload: UpdateSendFormUserManagerModel = { is_active: newStatus };

      await axios.patch(`${BASE_URL}user/manager/${id}/`, payload);

      setUsers(users.map(u =>
        u.id === id ? { ...u, is_active: newStatus } : u
      ));

      toast.success(`Usuário ${newStatus ? 'ativado' : 'desativado'}!`);
    } catch (error) {
      const handledError = handleError(error);
      toast.error(handledError.message);
    }
  };

  const deleteUser = async (id: number) => {
    try {
      await axios.delete(`${BASE_URL}user/manager/${id}`);
      setUsers(users.filter(user => user.id !== id));
      toast.success('Usuário deletado!');
    } catch (error) {
      const handledError = handleError(error);
      toast.error(handledError.message);
    } finally {
      setDeleteConfirmation(null);
    }
  };

  const updateUserRole = async (id: number, newRole: UserRole) => {
    try {
      const payload: UpdateSendFormUserManagerModel = { role: newRole };
      await axios.patch(`${BASE_URL}user/manager/${id}/`, payload);

      const updatedUsers = users.map(user =>
        user.id === id ? { ...user, role: newRole } : user
      );
      setUsers(updatedUsers);

      if (currentUser?.id === id) {
        setUser({ ...currentUser, role: newRole });
      }

      toast.success(`Permissão atualizada para ${newRole}!`);
    } catch (error) {
      const handledError = handleError(error);
      console.error('Detalhes do erro:', handledError);
      toast.error(handledError.message);
      setUsers([...users]);
    }
  };

  const UserCard = ({ user }: { user: UserModel }) => (
    <div className="bg-white rounded-xl shadow-md p-6 mb-4 hover:shadow-lg transition-shadow">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold">
            {user.first_name} {user.last_name}
          </h3>
          <p className="text-gray-600">{user.email}</p>
        </div>
        <span className={`px-3 py-1 rounded-full text-sm ${roleColors[user.role]}`}>
          {user.role.toLowerCase()}
        </span>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <select
            value={user.role}
            onChange={(e) => updateUserRole(user.id!, e.target.value as UserRole)}
            className={`rounded-lg px-3 py-1 ${roleColors[user.role]} font-medium`}
          >
            <option value="ADMIN">Admin</option>
            <option value="MODERATOR">Moderador</option>
            <option value="COMMON">Comum</option>
          </select>

          <button
            onClick={() => toggleUserActivation(user.id!)}
            className={`flex items-center gap-2 ${user.role === 'ADMIN' ? 'opacity-50 cursor-not-allowed' : ''}`}
            disabled={user.role === 'ADMIN'}
          >
            {user.is_active ? (
              <>
                <FiToggleRight className="text-green-500 text-2xl" />
                <span className="text-sm">Ativo</span>
              </>
            ) : (
              <>
                <FiToggleLeft className="text-red-500 text-2xl" />
                <span className="text-sm">Inativo</span>
              </>
            )}
          </button>
        </div>

        <button
          onClick={() => setDeleteConfirmation(user.id!)}
          className={`text-red-500 hover:text-red-700 p-2 rounded-full hover:bg-red-50 ${user.role === 'ADMIN' ? 'opacity-50 cursor-not-allowed' : ''}`}
          disabled={user.role === 'ADMIN'}
        >
          <FiTrash2 className="text-xl" />
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Gerenciamento de Usuários</h1>
          <div className="flex space-x-4">
            <button
              onClick={handleRefresh}
              className="bg-white p-3 rounded-lg shadow-md hover:shadow-lg transition-all"
              disabled={isRefreshing}
            >
              <FiRefreshCw className={`text-xl ${isRefreshing ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>

        <div className="mb-8 relative">
          <FiSearch className="absolute left-3 top-3.5 text-gray-400" />
          <input
            type="text"
            placeholder="Pesquisar usuários..."
            className="w-full pl-10 pr-4 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-purple-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin inline-block w-8 h-8 border-4 border-purple-500 rounded-full border-t-transparent"></div>
          </div>
        ) : (
          <div className="grid gap-6">
            {['ADMIN', 'MODERATOR', 'COMMON'].map((role) => (
              <div key={role}>
                <h2 className="text-xl font-semibold mb-4 capitalize">
                  {role.toLowerCase()}s ({filteredUsers.filter(u => u.role === role).length})
                </h2>
                {filteredUsers.filter(u => u.role === role).map(user => (
                  <UserCard key={user.id} user={user} />
                ))}
              </div>
            ))}
          </div>
        )}
      </div>

      {deleteConfirmation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl p-6 max-w-md w-full">
            <h3 className="text-xl font-bold mb-4">Confirmar exclusão</h3>
            <p className="mb-6">Tem certeza que deseja deletar este usuário permanentemente?</p>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setDeleteConfirmation(null)}
                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
              >
                Cancelar
              </button>
              <button
                onClick={() => deleteUser(deleteConfirmation)}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
              >
                Confirmar Exclusão
              </button>
            </div>
          </div>
        </div>
      )}

      <ToastContainer
        position="bottom-right"
        autoClose={3000}
        theme="colored"
        hideProgressBar
      />
    </div>
  );
}