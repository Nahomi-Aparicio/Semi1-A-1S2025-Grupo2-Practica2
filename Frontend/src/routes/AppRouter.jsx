import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import LoginPage from "../components/LoginPage";
import Principal from "../pages/Principal";
const AppRouter = () => {
    return (
        <Router>
            <Routes>              
                <Route path="/" element={<LoginPage />} />
                <Route path="/principal" element={<Principal />} />
            </Routes>
          <Routes>
    </Routes>
    </Router>
  );
};

export default AppRouter;