import React, { useEffect, useState } from 'react'
import '../node_modules/bootstrap/dist/css/bootstrap.min.css'
import '../node_modules/mdbootstrap/css/mdb.css'
import './App.css'
import Home from './components/Home/index.jsx';
import {jwtDecode} from 'jwt-decode';
import Register from './components/Register/index.jsx';
import Login from './components/Login/index';
import People from './components/People/index';
import Tv from './components/Tv/index';
import Movies from './components/Movies/index';
import Navbar from './components/Navbar/index';
import { Navigate, Route, Routes, useNavigate } from 'react-router-dom';
import Details from './components/Details';

export default function App() {
  const navigate = useNavigate()

  const [userData, setUserData] = useState(null);

  function savaDataUser(){
    let encodedToken = localStorage.getItem('token');
    if(encodedToken){
      let decdodedToken = jwtDecode(encodedToken);
      setUserData(decdodedToken);
    }else{
      navigate('/login');
    }
  }

  function logOut(){
    setUserData(null)
    localStorage.removeItem('token');
  }

  function ProtectedRoute({children}){
    if(userData){
      return children;
      
    }else{
      return <Navigate to={'/login'}/>;
    }
  }

  useEffect(()=>{
    savaDataUser();
  },[])

  return (
    <div >
      <Navbar userData = {userData} logOut={logOut}/>
      <div className='container mt-5'>
        <Routes>
          <Route path='' element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>}/>
          <Route path='home' element={
            <ProtectedRoute>
            <Home />
          </ProtectedRoute>
          }/>
          <Route path='movies' element={
            <ProtectedRoute>
            <Movies />
            </ProtectedRoute>
          }/>
          <Route path='people' element={
            <ProtectedRoute>
            <People />
            </ProtectedRoute>
          }/>
          <Route path='tv' element={
            <ProtectedRoute>
            <Tv />
            </ProtectedRoute>
          }/>
          <Route path='login' element={
              <Login saveUserData={savaDataUser} />}/>
          <Route path='register' element={<Register />}/>
          <Route path='*' element={<h1>Not Found</h1>}/>
          <Route path='details/:category/:id' element={<Details />}/>
        </Routes>
      </div>
    </div>
  )
}
