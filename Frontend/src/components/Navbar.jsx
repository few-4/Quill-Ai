import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logoutUser } from "../features/auth/states/auth.slice";
import { LogOut } from "lucide-react";

export default function Navbar() {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await dispatch(logoutUser());
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <Link to="/" className="navbar__brand">
        <img src="/favicon.svg" alt="Quill Ai Logo" className="navbar__brand-icon" />
        <span>Quill Ai</span>
      </Link>
      {user && (
        <div className="navbar__right">
          <div className="navbar__avatar">
            {user.name?.charAt(0)?.toUpperCase() || "U"}
          </div>
          <button onClick={handleLogout} className="navbar__logout">
            <LogOut size={14} />
            <span>Logout</span>
          </button>
        </div>
      )}
    </nav>
  );
}
