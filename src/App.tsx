import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import SignupForm from './components/SignupForm';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/signup" element={<SignupForm />} />
        <Route path="/login" element={<SignupForm />} /> {/* сюда компонентик логин попозже */}
        <Route path="/" element={<div><a href="/signup">Go to Sign Up</a></div>} />
      </Routes>
    </Router>
  );
}

export default App;