import { BrowserRouter, Routes, Route } from "react-router-dom";
import StudentRegistrationForm from './components/Logins/StudentRegisterForm';
import LoginForm from './components/Logins/Login';
import Dashboard from './components/AptitudePortal/Dashboard';
import ProtectedRoute from './components/Protectedroute/ProtectedRoute';
import AptiQuestion from './components/AptitudePortal/Aptitude/AptiQuestion';
import GD from './components/AptitudePortal/Aptitude/GD';
import MachineRound from './components/AptitudePortal/Aptitude/MachineRound';
import AdminPortal from "./components/AptitudePortal/Admin/AdminPortal";
import VirtualCodeEditor from "./components/AptitudePortal/Aptitude/VirtualCode";

function App() {
  return (
    <BrowserRouter>
<Routes>
  <Route path="/" element={<StudentRegistrationForm />} />
  <Route path="/login" element={<LoginForm />} />

  {/* Student dashboard */}
  <Route
    path="/dashboard"
    element={
      <ProtectedRoute role="student">
        <Dashboard />
      </ProtectedRoute>
    }
  >
    <Route path="apti" element={<AptiQuestion />} />
    <Route path="gd" element={<GD />} />
    <Route path="machine" element={<VirtualCodeEditor />} />
  </Route>

  {/* Admin portal */}
  <Route
    path="/admin"
    element={
      <ProtectedRoute role="admin">
        <AdminPortal />
      </ProtectedRoute>
    }
  />
</Routes>

    </BrowserRouter>
  );
}

export default App;
