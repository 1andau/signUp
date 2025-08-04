import { BrowserRouter, Route, Routes } from "react-router-dom";
import SignupForm from "./features/auth/SignupForm";
import ConfirmEmail from "./features/auth/ConfirmEmail";
import LoginForm from "./features/auth/LoginForm";
import Navbar from "./components/navbar/Navbar";
import Profile from "./components/profile/Profile";

const App = () => {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<SignupForm />} />
        <Route path="/login" element={<LoginForm />} />
        <Route path="/confirm/:token" element={<ConfirmEmail />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
