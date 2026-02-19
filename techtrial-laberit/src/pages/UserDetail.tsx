import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useUsers } from '../context/UsersContext';
import ConfirmModal from '../components/ConfirmModal';
import Toast from '../components/Toast';
import { useToast } from '../hooks/useToast';

export default function UserDetail() {
  const { id } = useParams<{ id: string }>();
  const { getUserById, removeUser } = useUsers();
  const navigate = useNavigate();
  const user = getUserById(Number(id));
  const [showModal, setShowModal] = useState(false);
  const { toast, showToast, hideToast } = useToast();

  const handleDelete = () => {
    setShowModal(false);
    removeUser(Number(id));
    navigate('/', { state: { deleted: true } });
  };

  if (!user) return <p className="text-center mt-20 text-gray-500">Usuario no encontrado.</p>;

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-md mx-auto bg-white rounded-xl shadow p-6 md:p-8">
        <button
          onClick={() => navigate('/')}
          className="text-blue-600 hover:underline mb-6 block"
        >
          ← Volver
        </button>

        <div className="flex flex-col items-center mb-8">
          <img
            src={user.avatar}
            alt={user.first_name}
            className="w-28 h-28 rounded-full mb-4 shadow"
          />
          <h1 className="text-2xl font-bold text-gray-800">
            {user.first_name} {user.last_name}
          </h1>
          <p className="text-gray-400">{user.email}</p>
        </div>

        <div className="bg-gray-50 rounded-lg p-4 mb-8 space-y-2">
          <div className="flex justify-between">
            <span className="text-gray-500 font-medium">ID</span>
            <span className="text-gray-700">{user.id}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500 font-medium">Nombre</span>
            <span className="text-gray-700">{user.first_name}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500 font-medium">Apellido</span>
            <span className="text-gray-700">{user.last_name}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500 font-medium">Email</span>
            <span className="text-gray-700">{user.email}</span>
          </div>
        </div>

        <div className="flex gap-4">
          <button
            onClick={() => navigate(`/users/${id}/edit`)}
            className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
          >
            Editar
          </button>
          <button
            onClick={() => setShowModal(true)}
            className="flex-1 bg-red-500 text-white py-2 rounded-lg hover:bg-red-600 transition"
          >
            Eliminar
          </button>
        </div>
      </div>

      {showModal && (
        <ConfirmModal
          message="Esta acción no se puede deshacer. ¿Quieres eliminar este usuario?"
          onConfirm={handleDelete}
          onCancel={() => setShowModal(false)}
        />
      )}

      {toast && <Toast message={toast.message} type={toast.type} onClose={hideToast} />}
    </div>
  );
}