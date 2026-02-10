import { useEffect, useState } from "react";
import { Link, Navigate } from "react-router";
import { Property } from "../../types/Property";
import authService from "../../services/authService";
import PropertiesTable from "./components/PropertiesTable";
import propertiesService from "../../services/propertiesService";

const Dashboard = () => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(true);

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
      } catch (error: any) {
        if (error.response?.status === 401) {
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

  return (
    <div>
      <button className="text-2xl text-center my-12">Logout</button>

      <h1 className="text-4xl text-center my-12">Tableau des Propriétés</h1>
      <button className="rounded-md bg-primary px-4 py-2 text-center text-sm font-medium text-white hover:bg-primary-hover transition cursor-pointer my-5 mx-2">
        <Link to="/admin/new-property">Ajouter une Propriété</Link>
      </button>

      <PropertiesTable properties={properties} onDelete={handleDelete} />
    </div>
  );
};

export default Dashboard;
