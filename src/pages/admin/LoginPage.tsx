import { useState } from "react";
import authService from "../../services/authService";
import { useNavigate } from "react-router";

const LoginPage = () => {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");

  const navigate = useNavigate();
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!username) {
      setErrorMessage("Veuillez saisir votre nom d’utilisateur.");
      setTimeout(() => {
        setErrorMessage("");
      }, 5000);
      return;
    }

    if (!password) {
      setErrorMessage("Veuillez saisir votre mot de passe.");
      setTimeout(() => {
        setErrorMessage("");
      }, 5000);
      return;
    }
    try {
      const data = await authService.login(username, password);
      localStorage.setItem("webtoken", JSON.stringify(data.token));
      setUsername("");
      setPassword("");
      navigate("/admin/dashboard");
    } catch (error) {
      console.log(error);
      setErrorMessage("Nom d’utilisateur ou mot de passe incorrect.");
      setTimeout(() => {
        setErrorMessage("");
      }, 5000);
    }
  };
  const labelStyle = "text-lg flex flex-col my-2 text-gray-800";

  const inputStyle =
    "w-full rounded-sm bg-white px-2 py-2 border border-gray-300";
  return (
    <div className="flex flex-col gap-10 items-center my-10 mx-auto p-6 w-full max-w-md bg-gray-200 rounded-sm">
      <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl md:text-4xl text-center">
        Connexion à votre compte
      </h1>
      {errorMessage ? (
        <p className="text-red-700 text-lg">{errorMessage}</p>
      ) : null}
      <form
        className="flex flex-col gap-3"
        onSubmit={(event) => {
          handleSubmit(event);
        }}
      >
        <label className={labelStyle}>
          Nom d’utilisateur
          <input
            type="text"
            className={inputStyle}
            value={username}
            onChange={(event) => {
              setUsername(event.target.value);
            }}
          />
        </label>
        <label className={labelStyle}>
          Mot de passe
          <input
            type="password"
            className={inputStyle}
            value={password}
            onChange={(event) => {
              setPassword(event.target.value);
            }}
          />
        </label>
        <button
          type="submit"
          className="w-full sm:w-auto cursor-pointer bg-primary text-white font-semibold p-2 rounded-sm"
        >
          Se connecter
        </button>
      </form>
    </div>
  );
};

export default LoginPage;
