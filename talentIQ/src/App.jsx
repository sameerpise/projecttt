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
import AptitudeInstructions from "./components/AptitudePortal/Aptitude/AptitudeInstruction";
import StudentList from "./components/AptitudePortal/Admin/Studentlist";
import QuestionManager from "./components/AptitudePortal/Admin/SetTest";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<StudentRegistrationForm />} />
        <Route path="/login" element={<LoginForm />} />
        {/* <Route path="/list" element={<StudentList />} /> */}




        {/* Student dashboard */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute role="student">
              <Dashboard />
            </ProtectedRoute>
          }
        >
          {/* Instruction route before aptitude */}
          <Route path="aptii" element={<AptitudeInstructions />} />

          {/* Actual aptitude rounds */}
          <Route path="apti" element={<AptiQuestion />} />
          <Route path="gd" element={<GD />} />
          <Route path="machine" element={<VirtualCodeEditor />} />
           <Route path="list" element={<StudentList />} />
           <Route path="set" element={<QuestionManager />} />

        </Route>

        {/* Admin portal */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute role="admin">
              <AdminPortal />
              {/* <QuestionManager /> */}
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
