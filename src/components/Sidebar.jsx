import { NavLink } from "react-router-dom";
import { LuPlay, LuTable2, LuBookOpen } from "react-icons/lu";
import "./Sidebar.css";

const links = [
  { to: "/", label: "Simulateur", icon: <LuPlay size={18} />, end: true },
  { to: "/matrices", label: "Matrices", icon: <LuTable2 size={18} /> },
  { to: "/theorie", label: "Théorie", icon: <LuBookOpen size={18} /> },
];

function Sidebar({ isOpen, onNavigate }) {
  return (
    <>
      <aside className={`sidebar ${isOpen ? "is-open" : ""}`}>
        <nav className="sidebar-nav">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.end}
              onClick={onNavigate}
              className={({ isActive }) => `sidebar-link ${isActive ? "active" : ""}`}
            >
              <span className="sidebar-icon">{link.icon}</span>
              <span>{link.label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="sidebar-footer">
          <p>Réseaux de Petri</p>
          <span>Éditeur • Simulation • Matrices</span>
        </div>
      </aside>

      {isOpen && <div className="sidebar-overlay" onClick={onNavigate} />}
    </>
  );
}

export default Sidebar;
