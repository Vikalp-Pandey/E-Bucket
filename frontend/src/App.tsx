import './App.css'
import { BrowserRouter, Route, Routes } from "react-router";
import SignupForm from './components/signupForm';
import HomePage from './Pages/homepage';
import SigninForm from './components/signinForm';
import OtpForm from './components/otpForm';
import ForgotPasswordForm from './components/forgotPasswordForm';
import ResetPasswordForm from './components/resetPasswordForm';

function App() {
  return (
    <BrowserRouter>
       <Routes>
           <Route path='/' element={<HomePage />} />
           <Route path='/signup' element={<SignupForm />} />
           <Route path='/signin' element={<SigninForm />} />
           <Route path='/verify-otp' element={<OtpForm />} />
           <Route path='/forgot-password' element={<ForgotPasswordForm />} />
           <Route path='/reset-password' element={<ResetPasswordForm />} />
       </Routes>
    </BrowserRouter>
  )
}

export default App
