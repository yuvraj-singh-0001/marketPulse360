import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/navbar";
import Login from "./pages/login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";

function App() {
  return (
    <Router>
      <Routes>
        {/* Default route → Login */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        
        <Route path="/login" element={<><Navbar /><Login /></>} />
        <Route path="/register" element={<><Navbar /><Register /></>} />
        <Route path="/dashboard" element={<Dashboard />} /> {/* No Navbar here */}
       
      </Routes>
    </Router>
  );
}

export default App;