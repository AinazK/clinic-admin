import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";

export default function Auth() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await api.post("/login", { username, password });

      localStorage.setItem("authToken", response.data.access_token);
      localStorage.setItem("refreshToken", response.data.refresh_token);

      handleRunSync();

      navigate("/doctors");
    } catch (err: any) {
      if (err.response?.status === 422) {
        setError("Неверные данные для входа");
      } else {
        setError("Ошибка авторизации или соединения");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleRunSync = async () => {
    try {
      await api.post("/apismedia/doctors");
    } catch (err) {
      alert("Ошибка запроса");
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#e3f2fd",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          backgroundColor: "white",
          padding: "40px",
          borderRadius: "12px",
          boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
          maxWidth: "400px",
          width: "100%",
        }}
      >
        <h2
          style={{
            textAlign: "center",
            marginBottom: "30px",
            color: "#1976d2",
          }}
        >
          Авторизация
        </h2>
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: "20px" }}>
            <label
              style={{
                display: "block",
                marginBottom: "5px",
                fontWeight: "500",
              }}
            >
              Логин:
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              disabled={loading}
              style={{
                width: "100%",
                padding: "12px",
                border: "1px solid #ddd",
                borderRadius: "6px",
                fontSize: "16px",
                opacity: loading ? 0.6 : 1,
              }}
            />
          </div>

          <div style={{ marginBottom: "25px" }}>
            <label
              style={{
                display: "block",
                marginBottom: "5px",
                fontWeight: "500",
              }}
            >
              Пароль:
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={loading}
              style={{
                width: "100%",
                padding: "12px",
                border: "1px solid #ddd",
                borderRadius: "6px",
                fontSize: "16px",
                opacity: loading ? 0.6 : 1,
              }}
            />
          </div>

          {error && (
            <div
              style={{
                color: "#d32f2f",
                backgroundColor: "#ffebee",
                padding: "10px",
                borderRadius: "4px",
                marginBottom: "15px",
                textAlign: "center",
              }}
            >
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%",
              padding: "12px",
              backgroundColor: loading ? "#ccc" : "#1976d2",
              color: "white",
              border: "none",
              borderRadius: "6px",
              fontSize: "16px",
              cursor: loading ? "not-allowed" : "pointer",
              opacity: loading ? 0.6 : 1,
            }}
          >
            {loading ? "Вход..." : "Войти"}
          </button>
        </form>
      </div>
    </div>
  );
}
