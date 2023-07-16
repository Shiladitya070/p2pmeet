import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import NotFound from "./Pages/NotFound";
import Home from "./Pages/Home";
import Meeting from "./Pages/Meeting";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/meeting/:roomId" element={<Meeting />} />
        <Route path="/" element={<Home />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;
