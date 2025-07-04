import React from 'react'
import { useThemeStore } from '../store/useThemeStore'
import { THEMES } from "../constants"

function SettingPage() {
  const {theme , setTheme} = useThemeStore()
  return (
    <div  className='h-screen container mx-auto px-4 pt-20 max-w-5xl'>
      <div className='space-y-6' >
        <div className='flex flex-col gap-1'>
          <h2 className='text-lg font-semibold'>Theme</h2>
          <p className='text-sm text-base-content/70'>Choose a theme for your chat interface</p>
        </div>

        <div className='grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-2'>
          {THEMES.map((t) => (
            <button 
            key={t}
            className={`group flex -col items-center gap-2.5 p-2 rounded-lg transition-colors 
          ${theme === t ?"bg-base-200" : "hover:base-200/50" }`}
          onClick={() => setTheme(t)}
            >
           
             <span className='text-[11px] font-medium truncate w-full text-center '>
              {t.charAt(0).toUpperCase() + t.slice(1)}
             </span>

            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

export default SettingPage