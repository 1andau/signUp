import { BrowserRouter, Route, Routes } from 'react-router-dom';
import SignupForm from './components/SignupForm';
import ConfirmEmail from './components/ConfirmEmail'; 
import LoginForm from './components/LoginForm';

const App = () => {
  return (
<BrowserRouter>
      <Routes>
        <Route path="/" element={<SignupForm />} />
        <Route path="/login" element={<LoginForm />} />
        <Route path="/confirm/:token" element={<ConfirmEmail />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;