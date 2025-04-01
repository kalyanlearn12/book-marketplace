import React from 'react'; // Add this import
import { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Books from './pages/Books';
import AddBook from './pages/AddBook';
import MyBooks from './pages/MyBooks';
import PrivateRoute from './components/PrivateRoute';
import './styles/main.css';

function App() {
  return (
    <AuthProvider>
      <div className="app">
        <Navbar />
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/books" element={<Books />} />
            <Route path="/books/add" element={<PrivateRoute><AddBook /></PrivateRoute>} />
            <Route path="/my-books" element={<PrivateRoute><MyBooks /></PrivateRoute>} />
          </Routes>
        </main>
      </div>
    </AuthProvider>
  );
}

export default App;