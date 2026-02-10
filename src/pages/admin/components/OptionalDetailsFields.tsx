interface OptionalDetailsFieldsInteface {
  bedroomsValue: number | undefined;
  bathroomsValue: number | undefined;
  floorValue: number | undefined;
  parkingValue: boolean;

  handleChange: (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => void;
  handleCheckboxChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  inputClass: string;
  labelClass: string;
}
const OptionalDetailsFields = ({
  bedroomsValue,
  bathroomsValue,
  floorValue,
  parkingValue,
  handleChange,
  handleCheckboxChange,
  inputClass,
  labelClass,
}: OptionalDetailsFieldsInteface) => {
  return (
    <>
      <div className="border-t pt-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Détails supplémentaires
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label htmlFor="bedrooms" className={labelClass}>
              Chambres
            </label>
            <input
              type="number"
              id="bedrooms"
              name="bedrooms"
              value={bedroomsValue || ""}
              onChange={handleChange}
              className={inputClass}
              min="0"
            />
          </div>

          <div>
            <label htmlFor="bathrooms" className={labelClass}>
              Salles de bain
            </label>
            <input
              type="number"
              id="bathrooms"
              name="bathrooms"
              value={bathroomsValue || ""}
              onChange={handleChange}
              className={inputClass}
              min="0"
            />
          </div>

          <div>
            <label htmlFor="floor" className={labelClass}>
              Étage
            </label>
            <input
              type="number"
              id="floor"
              name="floor"
              value={floorValue || ""}
              onChange={handleChange}
              className={inputClass}
              min="0"
            />
          </div>
        </div>

        <div className="mt-4">
          <label className="flex items-center">
            <input
              type="checkbox"
              name="parking"
              checked={parkingValue}
              onChange={handleCheckboxChange}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <span className="ml-2 text-sm text-gray-700">
              Parking disponible
            </span>
          </label>
        </div>
      </div>
    </>
  );
};

export default OptionalDetailsFields;
