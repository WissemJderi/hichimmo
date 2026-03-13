import { labelClass, inputClass } from "../../../../constants/formConstants";
import { FormDataState } from "../../hooks/usePropertyForm";

interface BasicInfoSectionProps {
  formData: FormDataState;
  handleChange: (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => void;
}

const BasicInfoSection = ({
  formData,
  handleChange,
}: BasicInfoSectionProps) => (
  <>
    {/* Title */}
    <div>
      <label htmlFor="title" className={labelClass}>
        Titre *
      </label>
      <input
        type="text"
        id="title"
        name="title"
        value={formData.title}
        onChange={handleChange}
        className={inputClass}
        required
      />
    </div>

    {/* Reference */}
    <div>
      <label htmlFor="ref" className={labelClass}>
        Référence *
      </label>
      <input
        type="text"
        id="ref"
        name="ref"
        value={formData.ref}
        onChange={handleChange}
        className={inputClass}
        required
      />
    </div>

    {/* Description */}
    <div>
      <label htmlFor="description" className={labelClass}>
        Description *
      </label>
      <textarea
        id="description"
        name="description"
        value={formData.description}
        onChange={handleChange}
        rows={4}
        className={inputClass}
        required
      />
    </div>
  </>
);

export default BasicInfoSection;
