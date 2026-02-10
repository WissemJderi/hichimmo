import { labelClass, inputClass } from "../../../../../constants/formConstants";
import { FormDataState } from "../../hooks/usePropertyForm";

interface PriceSectionProps {
  formData: FormDataState;
  handleChange: (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => void;
}

const PriceSection = ({ formData, handleChange }: PriceSectionProps) => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
    <div>
      <label htmlFor="price" className={labelClass}>
        Prix (DT) *
      </label>
      <input
        type="number"
        id="price"
        name="price"
        value={formData.price}
        onChange={handleChange}
        className={inputClass}
        min="0"
        required
      />
    </div>

    <div>
      <label htmlFor="area" className={labelClass}>
        Superficie (m²) *
      </label>
      <input
        type="number"
        id="area"
        name="area"
        value={formData.area}
        onChange={handleChange}
        className={inputClass}
        min="0"
        required
      />
    </div>
  </div>
);

export default PriceSection;
