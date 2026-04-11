import { useNavigate } from "react-router-dom";

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="not-found-page page-enter">
      <h1>404 - Page Not Found</h1>
      <p>The page you are looking for does not exist.</p>
      <button type="button" className="not-found-btn" onClick={() => navigate("/")}>
        Go Home
      </button>
    </div>
  );
}
