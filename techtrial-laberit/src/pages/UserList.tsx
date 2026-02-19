import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useUsers } from '../context/UsersContext';
import Toast from '../components/Toast';
import { useToast } from '../hooks/useToast';

export default function UserList() {
  const { state, setPage } = useUsers();
  const { users, currentPage, totalPages, loading, error } = state;
  const navigate = useNavigate();
  const location = useLocation();
  const { toast, showToast, hideToast } = useToast();

  useEffect(() => {
  if (location.state?.deleted) {
    showToast('Usuario eliminado correctamente', 'error');
    navigate('/', { replace: true, state: {} });
  }
}, []);

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6 md:mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Usuarios</h1>
          <button
            onClick={() => navigate('/users/new')}
            className="bg-blue-600 text-white px-3 py-2 md:px-4 text-sm md:text-base rounded-lg hover:bg-blue-700 transition"
          >
            + Crear usuario
          </button>
        </div>

        {error ? (
          <div className="flex flex-col items-center justify-center mt-20 gap-4">
            <p className="text-red-500 text-center">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
            >
              Reintentar
            </button>
          </div>
        ) : loading ? (
          <p className="text-center text-gray-500">Cargando...</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {users.map(user => (
              <div
                key={user.id}
                onClick={() => navigate(`/users/${user.id}`)}
                className="bg-white rounded-xl shadow p-6 flex flex-col items-center cursor-pointer hover:shadow-md transition"
              >
                <img
                  src={user.avatar}
                  alt={user.first_name}
                  className="w-20 h-20 rounded-full mb-4"
                />
                <p className="font-semibold text-gray-700">
                  {user.first_name} {user.last_name}
                </p>
                <p className="text-sm text-gray-400">{user.email}</p>
              </div>
            ))}
          </div>
        )}

        <div className="flex justify-center gap-4 mt-8">
          <button
            onClick={() => setPage(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-4 py-2 bg-white border rounded-lg disabled:opacity-40 hover:bg-gray-100 transition"
          >
            Anterior
          </button>
          <span className="py-2 text-gray-600">Página {currentPage} de {totalPages}</span>
          <button
            onClick={() => setPage(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-4 py-2 bg-white border rounded-lg disabled:opacity-40 hover:bg-gray-100 transition"
          >
            Siguiente
          </button>
        </div>
      </div>

      {toast && <Toast message={toast.message} type={toast.type} onClose={hideToast} />}
    </div>
  );
}