interface CancelBtnProps {
  onCancel: () => void;
}
const CancelBtn = ({ onCancel }: CancelBtnProps) => {
  return (
    <button
      type="button"
      onClick={onCancel}
      className="flex-1 bg-gray-200 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-300 font-medium transition-colors"
    >
      Annuler
    </button>
  );
};

export default CancelBtn;
