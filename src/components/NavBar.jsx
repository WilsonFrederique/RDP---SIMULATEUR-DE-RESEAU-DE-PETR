import { LuMenu, LuX } from "react-icons/lu";
import { PiFlowArrowBold } from "react-icons/pi";
import { usePetri } from "../context/PetriContext";
import "./NavBar.css";

function NavBar({ isSidebarOpen, onToggleSidebar }) {
  const { places, transitions, hasNetwork, isDeadlocked } = usePetri();

  return (
    <header className="navbar">
      <div className="navbar-left">
        <button
          className="navbar-burger"
          onClick={onToggleSidebar}
          aria-label="Ouvrir le menu"
        >
          {isSidebarOpen ? <LuX size={22} /> : <LuMenu size={22} />}
        </button>

        <div className="navbar-brand">
          <span className="navbar-logo">
            <PiFlowArrowBold size={22} />
          </span>
          <div className="navbar-titles">
            <span className="navbar-title">Petri Sim</span>
            <span className="navbar-subtitle">Marquage &amp; Franchissement</span>
          </div>
        </div>
      </div>

      <div className="navbar-right">
        {hasNetwork && (
          <>
            <span className="navbar-stat">
              {places.length} place{places.length > 1 ? "s" : ""}
            </span>
            <span className="navbar-stat">
              {transitions.length} transition{transitions.length > 1 ? "s" : ""}
            </span>
            <span className={`navbar-status ${isDeadlocked ? "is-blocked" : "is-live"}`}>
              {isDeadlocked ? "Blocage" : "Actif"}
            </span>
          </>
        )}
      </div>
    </header>
  );
}

export default NavBar;
