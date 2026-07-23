import { useState } from "react";
import { Routes, Route } from "react-router-dom";
import NavBar from "./components/NavBar";
import Sidebar from "./components/Sidebar";
import { PetriProvider } from "./context/PetriContext";
import Simulateur from "./Pages/Simulateur/Simulateur";
import Matrices from "./Pages/Matrices/Matrices";
import Theorie from "./Pages/Theorie/Theorie";
import "./App.css";

function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <PetriProvider>
      <div className="app-shell">
        <NavBar
          isSidebarOpen={isSidebarOpen}
          onToggleSidebar={() => setIsSidebarOpen((v) => !v)}
        />
        <Sidebar isOpen={isSidebarOpen} onNavigate={() => setIsSidebarOpen(false)} />

        <main className="app-content">
          <Routes>
            <Route path="/" element={<Simulateur />} />
            <Route path="/matrices" element={<Matrices />} />
            <Route path="/theorie" element={<Theorie />} />
          </Routes>
        </main>
      </div>
    </PetriProvider>
  );
}

export default App;
