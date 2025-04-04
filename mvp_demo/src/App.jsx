import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./components/landing_page";
import HomePage2 from "./components/landing_page/index2";
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        {/* Make sure this matches the button's path */}
        <Route path="/extension-features" element={<HomePage />} />
        <Route path="/" element={<HomePage2 />} />
      </Routes>
    </Router>
  );
}

export default App;
