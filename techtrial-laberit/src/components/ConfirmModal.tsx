import { useEffect, useState } from 'react';

interface ConfirmModalProps {
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmModal({ message, onConfirm, onCancel }: ConfirmModalProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setTimeout(() => setVisible(true), 10);
  }, []);

  const handleCancel = () => {
    setVisible(false);
    setTimeout(onCancel, 300);
  };

  const handleConfirm = () => {
    setVisible(false);
    setTimeout(onConfirm, 300);
  };

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center transition-all duration-300
      ${visible ? 'bg-black/50' : 'bg-black/0'}`}
    >
      <div className={`bg-white rounded-xl shadow-xl p-8 max-w-sm w-full mx-4 transition-all duration-300
        ${visible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}
      >
        <h2 className="text-lg font-bold text-gray-800 mb-2">¿Estás seguro?</h2>
        <p className="text-gray-500 mb-6">{message}</p>
        <div className="flex gap-3">
          <button
            onClick={handleCancel}
            className="flex-1 border border-gray-300 text-gray-600 py-2 rounded-lg hover:bg-gray-50 transition"
          >
            Cancelar
          </button>
          <button
            onClick={handleConfirm}
            className="flex-1 bg-red-500 text-white py-2 rounded-lg hover:bg-red-600 transition"
          >
            Eliminar
          </button>
        </div>
      </div>
    </div>
  );
}