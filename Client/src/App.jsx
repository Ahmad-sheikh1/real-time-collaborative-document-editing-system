import './App.css';
import TextEditor from './Components/TextEditor';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from './Components/Home';
import LoginForm from './Components/Login';
import RegisterForm from './Components/Register';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useDispatch, useSelector } from "react-redux";
import { LoginDataR } from './Store/Slices/LoginSlice';
import ProtectedRoute from './Components/ProtectedRoute';
import DocumentEditor from './Components/AccessUrl';

function App() {
  const dispatch = useDispatch();
  const user = useSelector(state => state.login?.User);
  const [loading, setLoading] = useState(true);  // Add loading state

  const VerifiToken = async () => {
    try {
      const res = await axios.post("/api/user/verifytoken", { token: localStorage.getItem("token") });
      if (res.data.user) {
        dispatch(LoginDataR(res.data.user));
      }
    } catch (error) {
      console.error("Token verification failed", error);
    } finally {
      setLoading(false);  // Set loading to false after token verification
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      VerifiToken();
    } else {
      setLoading(false);  // No token, no need to wait
    }
  }, []);

  if (loading) {
    return <div>Loading...</div>;  // Show loading while token is being verified
  }

  return (
    <Router>
      <Routes>
        {/* Public routes */}
        <Route path='/login' element={<LoginForm />} />
        <Route path='/register' element={<RegisterForm />} />

        {/* Protected routes */}
        <Route path='/' element={<ProtectedRoute Element={<Home />} />} />
        <Route path='/documents/:id' element={<ProtectedRoute Element={<TextEditor />} />} />
      </Routes>
    </Router>
  );
}

export default App;
