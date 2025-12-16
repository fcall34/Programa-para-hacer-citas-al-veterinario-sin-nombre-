import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children, role }) {
  const token = localStorage.getItem("token");

  if (!token) {
    return <Navigate to="/login" />;
  }

  const payload = JSON.parse(atob(token.split(".")[1]));

  if (role && Number(payload.user_type) !== Number(role)) {
    return <Navigate to="/unauthorized" />;
  }

  return children;
}
