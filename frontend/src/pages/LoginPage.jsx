import { useState } from 'react'
import { useAuthStore } from '../store/useAuthStore'
import { Eye, EyeOff, Loader2, Lock, Mail, MessageSquare, MessagesSquare } from 'lucide-react'
import { Link } from 'react-router-dom'
import toast from "react-hot-toast"

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    email: "",
    password: "" // Fixed: consistent naming
  });

  const { login, isLoggingIn } = useAuthStore();

  const validateForm = () => {

    if (!formData.email.trim()) {
      toast.error("Email is required");
      return false;
    }
    if (!formData.password.trim()) {
      toast.error("Password is required");
      return false;
    }
    if (formData.password.length < 6) { // Fixed: removed negation
      toast.error("Password must be at least 6 characters");
      return false;
    }
    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      toast.error("Invalid email format");
      return false;
    }
    return true;
  }

 const handleSubmit = async (e) => {
  e.preventDefault();
  const success = validateForm();
  if (success) {
    await login(formData);  // make sure to await here
  }
};


  return (
    <div className='min-h-screen grid lg:grid-cols-2'>
      {/* left side */}
      <div className='flex flex-col justify-center items-center p-6 sm:p-12'>
        <div className='w-full max-w-md space-y-8'>
          {/* LOGO */}
          <div className='text-center mb-8'>
            <div className='flex flex-col items-center gap-2 group'>
              <div className='size-12 rounded-xl bg-primary/10 flex justify-center items-center group-hover:bg-primary/20 transition-colors'>
                <MessagesSquare className='size-6 text-primary' />
              </div>
              <h1 className='text-2xl font-bold mt-2'>Sign In </h1>
              <p className='text-base-content/60'>Get Started With Your Free Account</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className='space-y-6'>
            

            {/* Email Field */}
            <div className='form-control'>
              <label className='label'>
                <span className='label-text font-medium'>Email</span>
              </label>
              <div className='relative'>
                <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                  <Mail className='size-5 text-base-content/40' />
                </div>
                <input 
                  type="email"
                  className='input input-bordered w-full pl-10'
                  placeholder='example@gmail.com'
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })} // Fixed: consistent naming
                />
              </div>
            </div>

            {/* Password Field */}
            <div className='form-control'>
              <label className='label'>
                <span className='label-text font-medium'>Password</span>
              </label>
              <div className='relative'>
                <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                  <Lock className='size-5 text-base-content/40' />
                </div>
                <input 
                  type={showPassword ? "text" : "password"}
                  className='input input-bordered w-full pl-10'
                  placeholder='.........'
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })} // Fixed: consistent naming
                />
                <button
                  type="button" // Fixed: added type="button"
                  className='absolute inset-y-0 right-0 pr-3 flex items-center'
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className='size-5 text-base-content/40' />
                  ) : (
                    <Eye className='size-5 text-base-content/40' />
                  )}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button 
              type='submit' 
              className='btn btn-primary w-full' 
              disabled={isLoggingIn}
            >
              {isLoggingIn ? (
                <>
                  <Loader2 className='size-5 animate-spin' />
                  Loading...
                </>
              ) : (
                "Sign in"
              )}
            </button>
          </form>

          <div className='text-center'>
            <p className='text-base-content/60'>
              Don't have an account?{" "}
              <Link to="/signup" className='link link-primary'>Create account</Link>
            </p>
          </div>
        </div>
      </div>

      {/* Right side - optional background or image */}
      <div className='hidden lg:flex items-center justify-center bg-base-200'>
        <div className='text-center'>
          <MessagesSquare className='size-24 text-primary mx-auto mb-4' />
          <h2 className='text-3xl font-bold mb-2'>Welcome Back !</h2>
          <p className='text-base-content/60'>Sign in to continue chat and catch up with your messages</p>
        </div>
      </div>
    </div>
  )
}

export default LoginPage;