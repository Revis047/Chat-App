import React from 'react'
import { useAuthStore } from '../store/useAuthStore'
import { Link } from 'react-router-dom'
import { MessageSquare, LogOut, Settings, User } from 'lucide-react'

function Navbar() {
  const { logout, authUser } = useAuthStore(); // Fixed: proper destructuring

  return (
    <header className='bg-base-100 border-b border-base-300 fixed w-full top-0 z-40 backdrop-blur-lg bg-base-100/80'>
      <div className='container mx-auto px-4 h-16'>
        <div className='flex justify-between items-center h-full'> {/* Fixed: justify-between instead of justify-normal */}
          
          {/* Logo Section */}
          <div className='flex items-center gap-8'>
            <Link to="/" className='flex items-center gap-2.5 hover:opacity-80 transition-all'>
              <div className='size-9 rounded-lg bg-primary/10 flex items-center justify-center'>
                <MessageSquare className='w-5 h-5 text-primary' />
              </div>
              <h1 className='text-lg font-bold'>Chilly</h1>
            </Link>
          </div>

          {/* Navigation Section */}
          <div className='flex items-center gap-4'>
            {authUser ? (
              // Authenticated user menu
              <div className='flex items-center gap-3'>
                
                 <Link 
                  to="/setting" 
                  className=' flex items-center gap-2'
                >
                  <Settings className='w-4 h-4' />
                  <span className='hidden sm:inline'>Settings</span>
                </Link>
                
                <Link 
                  to="/profile" 
                  className='btn btn-ghost btn-sm  gap-2'
                >
                  <User className='size-5' />
                  <span className='hidden sm:inline'>Profile</span>
                </Link>
                
               
                
                <button 
                  onClick={logout}
                  className=' flex items-center gap-2  '
                >
                  <LogOut className='size-5' />
                  <span className='hidden sm:inline'>Logout</span>
                </button>
              </div>
            ) : (
              // Guest user menu
              <div className='flex items-center gap-2'>
                <Link 
                  to="/setting" 
                  className=' flex items-center gap-2'
                >
                  <Settings className='w-4 h-4' />
                  <span className='hidden sm:inline'>Settings</span>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}

export default Navbar