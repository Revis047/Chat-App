import React from 'react'
import { useChatStore } from '../store/useChatStore'
import NoChatSelected from '../components/NoChatSelected'
import ChatContainer from '../components/ChatContainer'
import Sidebar from '../components/Sidebar'

function HomePage() {
  const {selectedUser} = useChatStore()
  
  return (
    <div className='h-screen bg-base-200 flex flex-col'>
      <div className='flex-1 flex items-center justify-center p-4'>
        <div className='bg-base-100 rounded-lg shadow-xl w-full max-w-6xl h-full max-h-[calc(100vh-2rem)]'>
          <div className='flex h-full rounded-lg overflow-hidden'>
            <Sidebar/>
            
            <div className='flex-1 flex flex-col min-h-0'>
              {!selectedUser ? <NoChatSelected/> : <ChatContainer/>}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default HomePage