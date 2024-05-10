import './stylesheets/text-elements.css';
import './stylesheets/form-elements.css';
import './stylesheets/alignment.css';
import './stylesheets/theme.css';
import './stylesheets/custom-components.css';
import './stylesheets/layout.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import ProtectedRoute from './components/ProtectedRoute';
import PublicRoute from './components/PublicRoute';
import Loader from './components/Loader';
import { useSelector } from 'react-redux';
import Transactions from './pages/Transactions';
import Requests from './pages/Requests';
import Users from './pages/Users';
import {useNavigate} from "react-router-dom";

function App() {

  const {loading} = useSelector((state)=>state.loaders);
  const {user} = useSelector((state)=>state.users);
  // console.log(user);

  return (
    <div>
      {loading && <Loader/>}
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<PublicRoute><Login/></PublicRoute>}/>
          <Route path="/register" element={<PublicRoute><Register/></PublicRoute>}/>
          <Route path="/" element={<ProtectedRoute><Home/></ProtectedRoute>}/>
          <Route path="/transactions" element={<ProtectedRoute><Transactions/></ProtectedRoute>}/>
          <Route path="/requests" element={<ProtectedRoute><Requests/></ProtectedRoute>}/>
          {user?.isAdmin===true && <Route path="/users" element={<ProtectedRoute><Users/></ProtectedRoute>}/>}
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
