import React from "react";

interface ConfirmationPopupProps {
  show: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  message: string;
}

const ConfirmationPopup: React.FC<ConfirmationPopupProps> = ({ show, onConfirm, onCancel, message }) => {
  if (!show) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg z-50">
        <div className="flex justify-between items-center">
          <p className="text-lg font-bold">Confirmation</p>
          <button className="p-2" onClick={onCancel}>
            <svg height="20px" viewBox="0 0 384 512">
              <path
                d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z"
                fill="rgb(175, 175, 175)"
              ></path>
            </svg>
          </button>
        </div>
        <p className="text-gray-600">{message}</p>
        <div className="flex justify-end space-x-4 mt-4">
          <button className="bg-gray-300 text-gray-800 px-4 py-2 rounded" onClick={onCancel}>
            Annuler
          </button>
          <button className="bg-red-600 text-white px-4 py-2 rounded" onClick={onConfirm}>
            Supprimer
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationPopup;