import {
  labelClass,
  inputClass,
  propertyTypes,
} from "../../../../constants/formConstants";
import { formatTitle, titleCase } from "../../../../utils";
import { locations } from "../../../../data";
import { FormDataState } from "../../hooks/usePropertyForm";

interface PropertyTypeLocationSectionProps {
  formData: FormDataState;
  handleChange: (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => void;
}

const PropertyTypeLocationSection = ({
  formData,
  handleChange,
}: PropertyTypeLocationSectionProps) => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
    <div>
      <label htmlFor="propertyType" className={labelClass}>
        Type de propriété *
      </label>
      <select
        id="propertyType"
        name="propertyType"
        value={formData.propertyType}
        onChange={handleChange}
        className={inputClass}
        required
      >
        {propertyTypes.map((type) => (
          <option key={type} value={type}>
            {titleCase(type)}
          </option>
        ))}
      </select>
    </div>

    <div>
      <label htmlFor="location" className={labelClass}>
        Localisation *
      </label>
      <select
        id="location"
        name="location"
        value={formData.location}
        onChange={handleChange}
        className={inputClass}
        required
      >
        {locations.map((location) => (
          <option value={location} key={location}>
            {formatTitle(location)}
          </option>
        ))}
      </select>
    </div>
  </div>
);

export default PropertyTypeLocationSection;
