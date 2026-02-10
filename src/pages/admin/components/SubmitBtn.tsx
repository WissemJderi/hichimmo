import { Property } from "../../../types/Property";

interface SubmitBtnProps {
  isSubmitting: boolean;

  property: Property | undefined;
}

const SubmitBtn = ({ isSubmitting, property }: SubmitBtnProps) => {
  return (
    <button
      type="submit"
      disabled={isSubmitting}
      className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed font-medium transition-colors"
    >
      {isSubmitting ? "Enregistrement..." : property ? "Modifier" : "Ajouter"}
    </button>
  );
};

export default SubmitBtn;
