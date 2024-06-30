import React from "react";
import ReactDOM from "react-dom/client";
import { HashRouter, Routes, Route } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import Home from "./Home.jsx";
import FaceRegistration from "./FaceRegistration.jsx";
import FaceSignIn from "./FaceSignIn.jsx";


export default function App() {
  return (
    <div className="App">
      <HashRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/face-regester" element={<FaceRegistration />} />
          <Route path="/face-signin" element={<FaceSignIn />} />
        </Routes>
      </HashRouter>
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);
