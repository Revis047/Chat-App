 import { useEffect } from 'react'
import Navbar from './components/navbar'
import { Navigate, Route, Routes } from 'react-router-dom'
import HomePage from './pages/HomePage'
import SignUpPage from './pages/SignUpPage'
import LoginPage from './pages/LoginPage'
import ProfilePage from './pages/ProfilePage'
import SettingPage from './pages/SettingPage'
import { useAuthStore } from './store/useAuthStore'
import {LoaderCircle} from "lucide-react"
import { Toaster } from 'react-hot-toast'
import Test from './pages/test'
import { useThemeStore } from './store/useThemeStore'
 
 function App() {
   const {authUser,checkAuth,isCheckingAuth,onlineUsers} = useAuthStore();
   const {theme} =  useThemeStore()
   console.log(onlineUsers)
   useEffect(() => {
    checkAuth();
    
   }, [checkAuth]);
   
   console.log( { authUser } );
   if (isCheckingAuth && !authUser)return(
   
       <div className='flex items-center justify-center h-screen'>
        <LoaderCircle className='size-10 animate-spin' />
       </div>
   ) 
   return (
     <div data-theme={theme} > 
      
   <Navbar/>
   <Routes>
    <Route path='/' element={ authUser ? <HomePage/>: <Navigate to="/login" />} />
    <Route path='/signup' element={ !authUser ?<SignUpPage/> : <Navigate to="/" /> } />
    <Route path='/login' element={!authUser ? <LoginPage/> : <Navigate to="/" />} />
    <Route path='/profile' element={ authUser ? <ProfilePage/> : <Navigate to="/login" />} />
    <Route path='/setting' element={<SettingPage/>} />
    <Route path='/test' element={!authUser ?<Test/>:<Navigate to="/" />  } />
   </Routes>
   <Toaster/>  </div>
   )
 }
 
 
 export default App