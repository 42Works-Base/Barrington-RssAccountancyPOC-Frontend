import React from 'react'
import {BrowserRouter, Route, Routes} from 'react-router-dom'
import Signup from './Pages/Signup/Signup'
import Login from './Pages/Login/Login'
import VerifyOtp from './Pages/VerifyOtp/VerifyOtp'
import ResetPassword from './Pages/ResetPassword/ResetPassword'
import Verifications from './Pages/Verifications/Verifications'
import { ToastContainer } from 'react-toastify'
import Dashboard from './Pages/Dashboard/Dashboard'
import ForgotPassword from './Pages/ForgotPassword/ForgotPassword'
const App = () => {
  
  return (
    
    <div>
      <BrowserRouter basename='/rss-accountancy/'>
      <Routes>
        <Route path='/' element={<Signup/>}/>
        <Route path='/login' element={<Login/>}/>
        <Route path='/forgot-password' element={<ForgotPassword/>}/>
        <Route path='/verify-otp' element={<VerifyOtp/>}/>
        <Route path='/reset-password' element={<ResetPassword/>}/>
        <Route path='/verification' element={<Verifications/>}/>
        <Route path='/dashboard' element={<Dashboard/>}/>
      </Routes>
      <ToastContainer style={{fontSize:'14px'}}/>
      </BrowserRouter>
    </div>
  )
}

export default App