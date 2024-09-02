import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import MainScreen from './components/Hero.jsx';
import Navbar from './components/navbar.jsx';
import Home from './pages/Home.jsx';
import About from './pages/About.jsx';
import InterviewForm from './pages/Interview.jsx';


const App = () => {
  return (
    <Router>
      <main className='bg-black'>
        <Navbar/> 
        <Routes>
          <Route path="/" element={<MainScreen />} />
          <Route path="/home" element={<Home />} />
          {/* <Route path="/about-drdo" element={<About />} /> */}
          <Route path="/interview" element={<InterviewForm />} />




        </Routes>
      </main>
    </Router>
  );
}

export default App;
