import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "./App.css";
import Main from "./pages/main";
import Admin from "./pages/admin";
import Coins from "./pages/coins";

const App = () => (
  <Router>
    <Routes>
      <Route path="/" element={<Main />} />
      <Route path="/admin" element={<Admin />} />
      <Route path="/coins" element={<Coins />} />
    </Routes>
  </Router>
);
export default App;
