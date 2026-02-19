import { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useUsers } from '../context/UsersContext';
import Toast from '../components/Toast';
import { useToast } from '../hooks/useToast';

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
  const { toast, showToast, hideToast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState({ first_name: '', last_name: '', email: '' });
  const [errors, setErrors] = useState<FormErrors>({});
  const [saving, setSaving] = useState(false);
  const [avatar, setAvatar] = useState<string | null>(null);

  useEffect(() => {
    if (isEditing) {
      const user = getUserById(Number(id));
      if (user) {
        setForm({ first_name: user.first_name, last_name: user.last_name, email: user.email });
        setAvatar(user.avatar);
      }
    }
  }, [id]);

  const getInitials = () => {
    const first = form.first_name.trim().charAt(0).toUpperCase();
    const last = form.last_name.trim().charAt(0).toUpperCase();
    return first || last ? `${first}${last}` : '?';
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => setAvatar(reader.result as string);
    reader.readAsDataURL(file);
  };

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
    const finalAvatar = avatar || `https://ui-avatars.com/api/?name=${form.first_name}+${form.last_name}&background=random&color=fff`;
    if (isEditing) {
      editUser(Number(id), form, finalAvatar);
      showToast('Usuario actualizado correctamente');
      setTimeout(() => navigate(`/users/${id}`), 1500);
    } else {
      addUser(form, finalAvatar);
      showToast('Usuario creado correctamente');
      setTimeout(() => navigate('/'), 1500);
    }
    setSaving(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-blue-900 p-4 md:p-8">
      <div className="max-w-md mx-auto bg-white rounded-xl shadow p-6 md:p-8">
        <button onClick={() => navigate(-1)} className="text-blue-600 hover:underline mb-6 block">
          ← Volver
        </button>

        <h1 className="text-2xl font-bold text-gray-800 mb-8">
          {isEditing ? 'Editar usuario' : 'Crear usuario'}
        </h1>

        {/* Avatar */}
        <div className="flex flex-col items-center mb-8 gap-3">
          {avatar ? (
            <img src={avatar} alt="avatar" className="w-24 h-24 rounded-full object-cover shadow" />
          ) : (
            <div className="w-24 h-24 rounded-full bg-blue-100 flex items-center justify-center shadow">
              <span className="text-2xl font-bold text-blue-500">{getInitials()}</span>
            </div>
          )}
          <div className="flex gap-2">
            <button
              onClick={() => fileInputRef.current?.click()}
              className="text-sm text-blue-600 border border-blue-300 px-3 py-1 rounded-lg transition-all duration-200 hover:scale-105 hover:shadow-[0_0_15px_rgba(59,130,246,0.5)]"
            >
              Subir foto
            </button>
            {avatar && (
              <button
                onClick={() => setAvatar(null)}
                className="text-sm text-gray-400 border border-gray-200 px-3 py-1 rounded-lg transition-all duration-200 hover:scale-105 hover:shadow-[0_0_15px_rgba(255,255,255,0.3)]"
              >
                Quitar foto
              </button>
            )}
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />
        </div>

        <div className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Nombre <span className="text-red-500">*</span>
            </label>
            <input
              name="first_name"
              value={form.first_name}
              onChange={handleChange}
              placeholder="ej: John"
              className={`w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 placeholder-gray-300 ${errors.first_name ? 'border-red-400' : 'border-gray-300'}`}
            />
            {errors.first_name && <p className="text-red-500 text-sm mt-1">{errors.first_name}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Apellido <span className="text-red-500">*</span>
            </label>
            <input
              name="last_name"
              value={form.last_name}
              onChange={handleChange}
              placeholder="ej: Doe"
              className={`w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 placeholder-gray-300 ${errors.last_name ? 'border-red-400' : 'border-gray-300'}`}
            />
            {errors.last_name && <p className="text-red-500 text-sm mt-1">{errors.last_name}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Email <span className="text-red-500">*</span>
            </label>
            <input
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="ej: john@example.com"
              className={`w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 placeholder-gray-300 ${errors.email ? 'border-red-400' : 'border-gray-300'}`}
            />
            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
          </div>

          <p className="text-gray-400 text-xs">
            <span className="text-red-500">*</span> Campos obligatorios
          </p>
        </div>

        <button
          onClick={handleSubmit}
          disabled={saving}
          className="w-full mt-8 bg-blue-600 text-white py-2 rounded-lg transition-all duration-200 hover:scale-105 hover:shadow-[0_0_20px_rgba(59,130,246,0.7)] disabled:opacity-50 disabled:hover:scale-100 disabled:hover:shadow-none"
        >
          {saving ? 'Guardando...' : isEditing ? 'Guardar cambios' : 'Crear usuario'}
        </button>
      </div>

      {toast && <Toast message={toast.message} type={toast.type} onClose={hideToast} />}
    </div>
  );
}