import { useEffect, useState } from "react";
import { Link, Navigate, useNavigate } from "react-router";
import { Property } from "../../types/Property";
import authService from "../../services/authService";
import PropertiesTable from "./components/PropertiesTable";
import propertiesService from "../../services/propertiesService";
import { IoLogOut } from "react-icons/io5";
import axios from "axios";
import PropertyForm from "./AddPropertyForm";

const Dashboard = () => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(true);
  const [editingProperty, setEditingProperty] = useState<Property | null>(null);
  const [showForm, setShowForm] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("webtoken");

    if (!token) {
      setIsAuthenticated(false);
      setLoading(false);
      return;
    }

    const getProperties = async () => {
      try {
        const parsedToken = JSON.parse(token);
        const fetchedProperties = await authService.getAll(parsedToken);
        setProperties(fetchedProperties);
      } catch (error) {
        if (axios.isAxiosError(error) && error.response?.status === 401) {
          localStorage.removeItem("webtoken");
          setIsAuthenticated(false);
        }
        console.error("Failed to fetch properties:", error);
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };
    getProperties();
  }, []);

  const handleEdit = (property: Property) => {
    setEditingProperty(property);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setEditingProperty(null);
    setShowForm(false);
  };

  const handleSuccess = async () => {
    // Refresh the property list
    const token = localStorage.getItem("webtoken");
    if (token) {
      const updatedProperties = await propertiesService.getAll();
      setProperties(updatedProperties);
    }
  };

  const handleDelete = async (id: string, title: string) => {
    if (!window.confirm(`Êtes-vous sûr de vouloir supprimer « ${title} » ?`)) {
      return;
    }

    try {
      await propertiesService.removeProperty(id);
      setProperties((prev) => prev.filter((p) => p._id !== id));
    } catch (error) {
      console.error("Delete failed", error);
      alert("Échec de la suppression");
    }
  };

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }

  if (loading) return <p>please wait...</p>;

  const handleLogout = () => {
    localStorage.removeItem("webtoken");
    navigate("/admin/login");
  };

  return (
    <div>
      <button
        onClick={handleLogout}
        className="rounded-md  flex items-center gap-2 bg-red-600 px-4 py-2 text-center text-sm font-medium text-white hover:bg-red-700 transition cursor-pointer my-5 mx-2"
      >
        Déconnexion <IoLogOut size={20} />
      </button>
      <h1 className="text-4xl text-center my-12">Tableau des Propriétés</h1>
      <button className="rounded-md bg-primary px-4 py-2 text-center text-sm font-medium text-white hover:bg-primary-hover transition cursor-pointer my-5 mx-2">
        <Link to="/admin/new-property">Ajouter une Propriété</Link>
      </button>

      {/* <PropertiesTable properties={properties} onDelete={handleDelete} /> */}
      {showForm ? (
        <PropertyForm
          property={editingProperty || undefined}
          onCancel={handleCloseForm}
          onSuccess={handleSuccess}
        />
      ) : (
        <PropertiesTable
          properties={properties}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      )}
    </div>
  );
};

export default Dashboard;
