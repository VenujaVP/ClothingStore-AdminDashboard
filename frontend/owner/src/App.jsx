/* eslint-disable react/no-unknown-property */
/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
/* eslint-disable react/jsx-key */

// npm install react react-dom @react-oauth/google react-icons

import { useState } from 'react'
import './App.css'
import Sidebar from './component/Sidebar/Sidebar';
import Navbar from './component/Navbar/Navbar';

function App() {

  return (
    <>
     <Sidebar />
     <Navbar />
    </>
  )
}

export default App