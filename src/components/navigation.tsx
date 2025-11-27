import { Link, useLocation, useNavigate } from "react-router-dom";

export default function Navigation() {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    navigate("/auth");
  };

  return (
    <div
      style={{
        position: "fixed",
        left: 0,
        top: 0,
        height: "100vh",
        width: "250px",
        backgroundColor: "#f8f9fa",
        borderRight: "1px solid #dee2e6",
        display: "flex",
        flexDirection: "column",
        padding: "20px 0",
        lineHeight: "150%",
      }}
    >
      <div style={{ flex: 1 }}>
        <div
          style={{
            padding: "0 20px 20px",
            borderBottom: "1px solid #dee2e6",
            marginBottom: "20px",
          }}
        >
          <h3 style={{ color: "#1976d2", margin: 0 }}>Панель управления</h3>
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "10px",
            padding: "0 20px",
          }}
        >
          <Link
            to="/doctors"
            style={{
              padding: "12px 16px",
              backgroundColor:
                location.pathname === "/doctors" ? "#1976d2" : "transparent",
              color: location.pathname === "/doctors" ? "white" : "#495057",
              textDecoration: "none",
              borderRadius: "6px",
              fontWeight: "500",
              transition: "all 0.3s",
              border: "none",
            }}
          >
            Врачи
          </Link>

          <Link
            to="/specialties"
            style={{
              padding: "12px 16px",
              backgroundColor:
                location.pathname === "/specialties"
                  ? "#1976d2"
                  : "transparent",
              color: location.pathname === "/specialties" ? "white" : "#495057",
              textDecoration: "none",
              borderRadius: "6px",
              fontWeight: "500",
              transition: "all 0.3s",
              border: "none",
            }}
          >
            Специальности
          </Link>

          <Link
            to="/filials"
            style={{
              padding: "12px 16px",
              backgroundColor:
                location.pathname === "/filials" ? "#1976d2" : "transparent",
              color: location.pathname === "/filials" ? "white" : "#495057",
              textDecoration: "none",
              borderRadius: "6px",
              fontWeight: "500",
              transition: "all 0.3s",
              border: "none",
            }}
          >
            Филиалы
          </Link>
        </div>
      </div>

      <div style={{ padding: "0 20px" }}>
        <button
          onClick={handleLogout}
          style={{
            width: "100%",
            padding: "12px",
            backgroundColor: "#6c757d",
            color: "white",
            border: "none",
            borderRadius: "6px",
            fontWeight: "500",
            cursor: "pointer",
            transition: "background-color 0.3s",
          }}
          onMouseOver={(e) =>
            (e.currentTarget.style.backgroundColor = "#ad2d2dff")
          }
          onMouseOut={(e) =>
            (e.currentTarget.style.backgroundColor = "#6c757d")
          }
        >
          Выйти
        </button>
      </div>
    </div>
  );
}
