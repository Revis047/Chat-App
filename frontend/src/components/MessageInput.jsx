import React, { useRef, useState } from 'react'
import { useChatStore } from '../store/useChatStore'
import { Send, X, Image } from "lucide-react"
import toast from 'react-hot-toast'

function MessageInput() {
  const [text, setText] = useState("")
  const [imagePreview, setImagePreview] = useState(null)
  const [isUploading, setIsUploading] = useState(false)
  const fileInputRef = useRef(null)
  
  const {sendMessage} = useChatStore()
  
  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file")
      return;
    }

    // Validate file size (limit to 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB in bytes
    if (file.size > maxSize) {
      toast.error("Image size should be less than 5MB")
      return;
    }

    const reader = new FileReader()
    reader.onloadend = () => {
      setImagePreview(reader.result)
    }
    reader.onerror = () => {
      toast.error("Failed to read image file")
    }
    reader.readAsDataURL(file)
  };

  const removeImage = () => {
    setImagePreview(null)
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  const handleSendMessage = async(e) => {
    e.preventDefault();
    
    // Validate input
    if (!text.trim() && !imagePreview) {
      toast.error("Please enter a message or select an image");
      return;
    }

    setIsUploading(true);
    
    try {
      await sendMessage({
        text: text.trim(),
        image: imagePreview,
      });
      
      // Clear form after successful send
      setText("")
      setImagePreview(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
      
    } catch (error) {
      console.error("Failed to send message:", error);
      toast.error("Failed to send message. Please try again.");
    } finally {
      setIsUploading(false);
    }
  }

  return (
    <div className='p-4 w-full'>
      {imagePreview && (
        <div className='mb-3 flex items-center gap-2'>
          <div className='relative'>
            <img 
              src={imagePreview} 
              alt="Preview"
              className='w-20 h-20 object-cover rounded-lg border border-zinc-700'
            />
            <button 
              onClick={removeImage}
              className='absolute -top-2.5 -right-1.5 w-5 h-5 rounded-full bg-base-300 
              flex justify-center items-center hover:bg-base-200'
              type='button'
              disabled={isUploading}>
              <X className="size-3"/>
            </button>
          </div>
        </div>
      )}

      <form onSubmit={handleSendMessage} className="flex items-center gap-2">
        <div className='flex-1 flex gap-2'>
          <input 
            type="text"
            className='w-full input input-bordered rounded-lg input-sm sm:input-md'
            placeholder='Type a message...'
            value={text}
            onChange={(e) => setText(e.target.value)}
            disabled={isUploading}
          />

          <input 
            type="file"
            accept='image/*'
            className='hidden'
            ref={fileInputRef}
            onChange={handleImageChange}
            disabled={isUploading}
          />

          <button 
            type='button'
            className={`hidden sm:flex btn btn-circle
            ${imagePreview ? "text-emerald-500" : "text-zinc-400"} 
            ${isUploading ? "loading" : ""}`}
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}>
            <Image size={20} />
          </button>
        </div>
        
        <button 
          type='submit'
          className={`btn btn-sm btn-circle ${isUploading ? "loading" : ""}`}
          disabled={(!text.trim() && !imagePreview) || isUploading}>
          {!isUploading && <Send size={22} />}
        </button>
      </form>
    </div>
  )
}

export default MessageInput