import React from 'react'
import { X } from 'lucide-react' // Added missing import
import { useChatStore } from '../store/useChatStore'
import { useAuthStore } from '../store/useAuthStore'

function ChatHeader() {
  const {selectedUser, setSelectedUser} = useChatStore()
  const {onlineUsers} = useAuthStore()
  
  return (
    <div className='pt-14 p-2.5 border-b border-base-300'>
      <div className='flex items-center justify-between'> {/* Fixed: changed 'justify-center' to 'justify-between' */}
        <div className='flex items-center gap-3'>
          {/* Avatar */}
          <div className='avatar'>
            <div className='size-10 rounded-full relative'> {/* Fixed: 'round-full' to 'rounded-full' */}
              <img src={selectedUser.profilePic || "avatar.jfiff"} alt={selectedUser.fullName} />
            </div>
          </div>
          {/* user info */}
          <div>
            <h3 className='font-medium'>{selectedUser.fullName}</h3>
            <p className='text-sm text-base-content/70'> 
              {onlineUsers.includes(selectedUser._id) ? "online" : "offline"}
            </p>
          </div>
        </div>
        {/* close button */}
        <button onClick={() => setSelectedUser(null)}>
          <X/>
        </button>
      </div>
    </div>
  )
}

export default ChatHeader