import { BrowserRouter, Route, Routes } from "react-router-dom";
import SignupForm from "./components/SignupForm";
import ConfirmEmail from "./components/ConfirmEmail";
import LoginForm from "./components/LoginForm";
import Navbar from "./components/Navbar";
import Profile from "./components/Profile";

const App = () => {
  return (
    <BrowserRouter>
      <Navbar />
      {/* <div style={{ paddingTop: "60px" }}></div> */}
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
