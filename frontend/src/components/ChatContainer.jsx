import React, { useEffect, useRef, useState } from 'react'
import { useChatStore } from '../store/useChatStore'
import ChatHeader from './ChatHeader'
import MessageInput from './MessageInput'
import MessageSkeleton from './MessageSkeleton'
import MessageDropdown from './MessageDropdown'
import EditMessageModal from './EditMessageModal'
import { useAuthStore } from '../store/useAuthStore'
import { formatMessageTime } from '../lib/utils'

function ChatContainer() {
  const {
    messages, 
    getMessages, 
    isMessagesLoading, 
    selectedUser,
    subscribeToMessages,
    unsubscribeFromMessages,
    deleteMessage,
    editMessage
  } = useChatStore()
  
  const { authUser } = useAuthStore()
  const messagesEndRef = useRef(null)
  const messagesContainerRef = useRef(null)
  
  // Hover state for messages
  const [hoveredMessage, setHoveredMessage] = useState(null)
  
  // Edit modal state
  const [editModal, setEditModal] = useState({
    isOpen: false,
    messageId: null,
    messageText: ''
  })

  // Scroll to bottom function
  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" })
    }
  }

  // Get messages when selectedUser changes
  useEffect(() => {
    if (selectedUser?._id) {
      getMessages()
      subscribeToMessages()
      return () => unsubscribeFromMessages()
    }
  }, [selectedUser?._id, getMessages, subscribeToMessages, unsubscribeFromMessages])

  // Auto-scroll when messages change
  useEffect(() => {
    const timer = setTimeout(() => {
      scrollToBottom()
    }, 100)
    
    return () => clearTimeout(timer)
  }, [messages])

  // Auto-scroll when component mounts
  useEffect(() => {
    scrollToBottom()
  }, [])

  // Handle edit message
  const handleEditMessage = (messageId, messageText) => {
    setEditModal({
      isOpen: true,
      messageId: messageId,
      messageText: messageText
    })
  }

  // Handle delete message
  const handleDeleteMessage = (messageId) => {
    deleteMessage(messageId)
  }

  // Save edited message
  const saveEditedMessage = async (newText) => {
    if (editModal.messageId) {
      await editMessage(editModal.messageId, newText)
      setEditModal({ isOpen: false, messageId: null, messageText: '' })
    }
  }

  if (isMessagesLoading) {
    return (
      <div className='h-full flex flex-col'>
        <ChatHeader />
        <div className='flex-1'>
          <MessageSkeleton />
        </div>
        <MessageInput />
      </div>
    )
  }

  return (
    <div className='h-full flex flex-col'>
      <ChatHeader />
      
      <div
        ref={messagesContainerRef}
        className='flex-1 overflow-y-auto p-4 space-y-4 scroll-smooth'
        style={{ scrollBehavior: 'smooth' }}
      >
        {messages.map((message) => (
          <div
            key={message._id}
            className={`chat ${message.senderId === authUser._id ? "chat-end" : "chat-start"} group`}
            onMouseEnter={() => setHoveredMessage(message._id)}
            onMouseLeave={() => setHoveredMessage(null)}
          >
            <div className='chat-image avatar'>
              <div className='size-10 rounded-full border'>
                <img
                  src={
                    message.senderId === authUser._id
                      ? authUser.profilePic || "/avatar.png"
                      : selectedUser.profilePic || "/avatar.png"
                  }
                  alt="profile pic"
                />
              </div>
            </div>
            
            <div className='chat-header mb-1'>
              <time className='text-xs opacity-50 ml-1'>
                {formatMessageTime(message.createdAt)}
                {message.isEdited && (
                  <span className='text-xs opacity-50 ml-2 italic'>(edited)</span>
                )}
              </time>
            </div>
            
            <div className='relative flex items-start gap-2'>
              <div
                className={`chat-bubble flex flex-col ${
                  message.senderId === authUser._id
                    ? "bg-blue-500 text-white"
                    : "bg-zinc-200 text-black"
                } ${message.isDeleted ? 'opacity-50' : ''}`}
              >
                {message.isDeleted ? (
                  <p className='italic text-black'>This message was deleted</p>
                ) : (
                  <>
                    {message.image && (
                      <img
                        src={message.image}
                        alt="Attachment"
                        className='sm:max-w-[200px] rounded-md mb-2'
                      />
                    )}
                    {message.text && <p>{message.text}</p>}
                  </>
                )}
              </div>
              
              {/* Dropdown Menu - Only show for user's own messages and non-deleted messages */}
              {message.senderId === authUser._id && !message.isDeleted && (
                <div className={`${message.senderId === authUser._id ? 'order-first' : 'order-last'}`}>
                  <MessageDropdown
                    isVisible={hoveredMessage === message._id}
                    onEdit={() => handleEditMessage(message._id, message.text || '')}
                    onDelete={() => handleDeleteMessage(message._id)}
                    canEdit={message.text !== undefined && message.text !== ''}
                    canDelete={true}
                  />
                </div>
              )}
            </div>
          </div>
        ))}
        
        {/* Invisible div to scroll to */}
        <div ref={messagesEndRef} />
      </div>
      
      <MessageInput />
      
      {/* Edit Message Modal */}
      <EditMessageModal
        isOpen={editModal.isOpen}
        onClose={() => setEditModal({ isOpen: false, messageId: null, messageText: '' })}
        onSave={saveEditedMessage}
        initialText={editModal.messageText}
      />
    </div>
  )
}

export default ChatContainer