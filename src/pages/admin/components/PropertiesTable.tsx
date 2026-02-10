import { Link } from "react-router";
import { Property } from "../../../types/Property";
import { formatDateObject, formatPrice, formatTitle } from "../../../utils";

interface PropertiesTableProps {
  properties: Property[];
  onDelete: (id: string, title: string) => void;
}

const PropertiesTable = ({ properties, onDelete }: PropertiesTableProps) => {
  console.log(properties);

  return (
    <>
      {/* Mobile: Card Layout */}
      <div className="block lg:hidden space-y-4">
        {properties.map((property) => (
          <div
            key={property._id}
            className="bg-white border border-gray-200 rounded-lg shadow-sm p-4"
          >
            <div className="flex gap-4 mb-3">
              <img
                src={property.images[0]}
                alt={property.title}
                className="h-20 w-24 rounded object-cover flex-shrink-0"
              />
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-semibold text-gray-900 truncate">
                  <Link to={`/listings/${property._id}`}>{property.title}</Link>
                </h3>
                <p className="text-sm text-gray-600 mt-1">
                  {formatTitle(property.location)}
                </p>
                <p className="text-lg font-bold text-gray-900 mt-1">
                  {formatPrice(property.price)}
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-gray-200">
              <div className="flex items-center gap-2">
                <span
                  className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                    property.status === "sale"
                      ? "bg-green-100 text-green-800"
                      : "bg-blue-100 text-blue-800"
                  }`}
                >
                  {property.status === "sale" ? "Vente" : "Location"}
                </span>
                <span className="text-xs text-gray-500">
                  {formatDateObject(property.createdAt!)}
                </span>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => onDelete(property._id!, property.title)}
                  className="cursor-pointer text-red-600 hover:text-red-800 font-medium text-sm transition-colors"
                >
                  Supprimer
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Desktop: Table Layout */}
      <div className="hidden lg:block overflow-x-auto border border-gray-200 shadow-sm rounded-lg">
        <table className="min-w-full divide-y divide-gray-200 bg-white">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Image
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Titre
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Prix
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Localisation
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Type
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date de création
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {properties.map((property) => (
              <tr
                key={property._id}
                className="hover:bg-gray-50 transition-colors"
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <img
                    src={property.images[0]}
                    alt={property.title}
                    className="h-16 w-20 rounded object-cover"
                  />
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    <Link to={`/listings/${property._id}`}>
                      {property.title}
                    </Link>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900 font-semibold">
                    {formatPrice(property.price)}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-700">
                    {formatTitle(property.location)}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      property.status === "sale"
                        ? "bg-green-100 text-green-800"
                        : "bg-blue-100 text-blue-800"
                    }`}
                  >
                    {property.status === "sale" ? "Vente" : "Location"}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {formatDateObject(property.createdAt!)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <div className="flex gap-2">
                    <button
                      onClick={() => onDelete(property._id!, property.title)}
                      className="cursor-pointer text-red-600 hover:text-red-800 font-medium transition-colors"
                    >
                      Supprimer
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default PropertiesTable;
