import './App.css';
import React from 'react';
import Header from './components/Header';
import Signup from './components/Signup';
import Login from './components/Login';
import Welcome from './components/Welcome';
import Admin from './components/Admin';
import Inicio from './components/Inicio';
import { Route, Routes } from 'react-router-dom';
import { useSelector } from 'react-redux';

function App() {
  const isLoggedIn = useSelector(state => state.auth.isLoggedIn)
  const isAdmin = useSelector(state => state.admin.isAdmin)
  console.log(isLoggedIn)
  return (
    <React.Fragment>
    <header>
      <Header />
    </header>

    <main>
      <Routes>
      <Route path='/' element={<Inicio/>}/>
        <Route path='/login' element={<Login/>}/>
        <Route path='/signup' element={<Signup/>}/>
        <Route path='/user' element={<Welcome/>}/>
        {isAdmin && <Route path='/admin' element={<Admin/>}/>} {" "}
      </Routes>
    </main>
    </React.Fragment>
  );
}

export default App;
