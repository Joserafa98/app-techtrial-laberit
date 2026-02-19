import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useUsers } from '../context/UsersContext';

interface FormErrors {
  first_name?: string;
  last_name?: string;
  email?: string;
}

export default function UserForm() {
  const { id } = useParams<{ id: string }>();
  const isEditing = Boolean(id);
  const navigate = useNavigate();
  const { getUserById, addUser, editUser } = useUsers();

  const [form, setForm] = useState({ first_name: '', last_name: '', email: '' });
  const [errors, setErrors] = useState<FormErrors>({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (isEditing) {
      const user = getUserById(Number(id));
      if (user) setForm({ first_name: user.first_name, last_name: user.last_name, email: user.email });
    }
  }, [id]);

  const validate = (): boolean => {
    const newErrors: FormErrors = {};
    if (!form.first_name.trim()) newErrors.first_name = 'El nombre es obligatorio';
    if (!form.last_name.trim()) newErrors.last_name = 'El apellido es obligatorio';
    if (!form.email.trim()) {
      newErrors.email = 'El email es obligatorio';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      newErrors.email = 'El email no es válido';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    setErrors(prev => ({ ...prev, [e.target.name]: undefined }));
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setSaving(true);
    if (isEditing) {
      editUser(Number(id), form);
      navigate(`/users/${id}`);
    } else {
      addUser(form);
      navigate('/');
    }
    setSaving(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-md mx-auto bg-white rounded-xl shadow p-8">
        <button
          onClick={() => navigate(-1)}
          className="text-blue-600 hover:underline mb-6 block"
        >
          ← Volver
        </button>

        <h1 className="text-2xl font-bold text-gray-800 mb-8">
          {isEditing ? 'Editar usuario' : 'Crear usuario'}
        </h1>

        <div className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Nombre</label>
            <input
              name="first_name"
              value={form.first_name}
              onChange={handleChange}
              className={`w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 ${errors.first_name ? 'border-red-400' : 'border-gray-300'}`}
              placeholder="John"
            />
            {errors.first_name && <p className="text-red-500 text-sm mt-1">{errors.first_name}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Apellido</label>
            <input
              name="last_name"
              value={form.last_name}
              onChange={handleChange}
              className={`w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 ${errors.last_name ? 'border-red-400' : 'border-gray-300'}`}
              placeholder="Doe"
            />
            {errors.last_name && <p className="text-red-500 text-sm mt-1">{errors.last_name}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Email</label>
            <input
              name="email"
              value={form.email}
              onChange={handleChange}
              className={`w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 ${errors.email ? 'border-red-400' : 'border-gray-300'}`}
              placeholder="john@example.com"
            />
            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
          </div>
        </div>

        <button
          onClick={handleSubmit}
          disabled={saving}
          className="w-full mt-8 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
        >
          {saving ? 'Guardando...' : isEditing ? 'Guardar cambios' : 'Crear usuario'}
        </button>
      </div>
    </div>
  );
}