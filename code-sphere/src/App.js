import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginSignup from "./pages/LoginMain";
import Messaging from "./pages/messagingMain";
import CodeCollabPage from "./components/CodeCollabpage"
import ExplorePage from "./components/ExplorePage"

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginSignup />} />
        <Route path="/messaging" element={<Messaging />} />
        <Route path="/codeCollab" element={<CodeCollabPage />} />
        <Route path="/ExplorePage" element={<ExplorePage />} />
      </Routes>
    </Router>
  );
}

export default App;
