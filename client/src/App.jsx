import { useState } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css'
import Signup from './signup'
import {BrowserRouter, Routes, Route} from 'react-router-dom'
import Login from './Login'
import DonorProfile from './home'
import BloodCenterProfile from './bhome'
import Blogin from './bloodcentrelogin'

function App() {
  

  return (
    <BrowserRouter>
      <Routes>
        <Route path='/register' element={<Signup/>}></Route>
        <Route path='/login' element={<Login/>}></Route>
        <Route path='/home' element={<DonorProfile/>}></Route>
        <Route path='/bloodcentrelogin' element={<Blogin/>}></Route>
        <Route path='/bhome' element={<BloodCenterProfile/>}></Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App;
