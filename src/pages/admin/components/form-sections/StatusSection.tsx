import { labelClass, inputClass } from "../../../../../constants/formConstants";
import { FormDataState } from "../../hooks/usePropertyForm";

interface StatusSectionProps {
  formData: FormDataState;
  handleChange: (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => void;
}

const StatusSection = ({ formData, handleChange }: StatusSectionProps) => (
  <div>
    <label htmlFor="status" className={labelClass}>
      Statut *
    </label>
    <select
      id="status"
      name="status"
      value={formData.status}
      onChange={handleChange}
      className={inputClass}
      required
    >
      <option value="sale">Vente</option>
      <option value="rent">Location</option>
    </select>
  </div>
);

export default StatusSection;
