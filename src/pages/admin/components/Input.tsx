import { titleCase } from "../../../utils";

interface InputProps {
  value: string;
  handleChange: (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => void;
  inputClass: string;
  labelClass: string;
  id: string;
  type: string;
}
const Input = ({
  value,
  handleChange,
  inputClass,
  labelClass,
  id,
  type,
}: InputProps) => {
  return (
    <div>
      <label htmlFor={id} className={labelClass}>
        {titleCase(id)} *
      </label>
      <input
        type={type}
        id={id}
        name={id}
        value={value}
        onChange={handleChange}
        className={inputClass}
        required
      />
    </div>
  );
};

export default Input;
