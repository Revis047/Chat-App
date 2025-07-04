import User from "../models/user.model.js"
import Message from "../models/message.model.js"
import cloudinary from "../lib/cloudinary.js"
import { getReceiverSocketId, io } from '../lib/socket.js'

export const getUsersForSidebar = async(req, res) => {
    try {
        const loggedInUserId = req.user._id
        const filteredUsers = await User.find({_id: {$ne: loggedInUserId}}).select(`-password`)
        res.status(200).json(filteredUsers)
    } catch (error) {
        console.log(`Error in getUsersForSidebar `, error.message)
        res.status(500).json({messages: `Internal Server Error`})
    }
}

export const getMessages = async(req, res) => {
    try {
        const {id: userToChatId} = req.params
        const myId = req.user._id
        const message = await Message.find({
            $or: [
                {senderId: myId, receiverId: userToChatId},
                {senderId: userToChatId, receiverId: myId}
            ]
        }).sort({ createdAt: 1 })
        res.status(200).json(message)
    } catch (error) {
        console.log(`Error In Get Message Controller:`, error.message)
        res.status(500).json({message: `Internal Server Error`})
    }
}

export const sendMessage = async (req, res) => {
    try {
        const {text, image} = req.body;
        const {id: receiverId} = req.params;
        const senderId = req.user._id;
        let imageUrl;
        
        if (image) {
            const uploadResponse = await cloudinary.uploader.upload(image)
            imageUrl = uploadResponse.secure_url;
        }

        const newMessage = new Message({
            senderId,
            receiverId,
            text: text,
            image: imageUrl,
        });
        
        await newMessage.save();

        // Real-time functionality with socket.io
        const receiverSocketId = getReceiverSocketId(receiverId);
        if (receiverSocketId) {
            io.to(receiverSocketId).emit("newMessage", newMessage);
        }

        const senderSocketId = getReceiverSocketId(senderId);
        if (senderSocketId) {
            io.to(senderSocketId).emit("newMessage", newMessage);
        }

        res.status(201).json(newMessage)

    } catch (error) {
        console.log(`Error in sendMessage Controller`, error.message)
        res.status(500).json({message: `Internal Server Error`})
    }
}

// NEW: Delete message controller
export const deleteMessage = async (req, res) => {
    try {
        const { messageId } = req.params;
        const userId = req.user._id;

        // Find the message
        const message = await Message.findById(messageId);
        
        if (!message) {
            return res.status(404).json({ message: "Message not found" });
        }

        // Check if user is the sender
        if (message.senderId.toString() !== userId.toString()) {
            return res.status(403).json({ message: "You can only delete your own messages" });
        }

        // Mark message as deleted instead of actually deleting
        message.isDeleted = true;
        message.deletedAt = new Date();
        await message.save();

        // Emit real-time update to both sender and receiver
        const receiverSocketId = getReceiverSocketId(message.receiverId);
        const senderSocketId = getReceiverSocketId(message.senderId);

        const deletedMessage = {
            _id: message._id,
            senderId: message.senderId,
            receiverId: message.receiverId,
            isDeleted: true,
            deletedAt: message.deletedAt
        };

        if (receiverSocketId) {
            io.to(receiverSocketId).emit("messageDeleted", deletedMessage);
        }
        if (senderSocketId) {
            io.to(senderSocketId).emit("messageDeleted", deletedMessage);
        }

        res.status(200).json({ message: "Message deleted successfully" });

    } catch (error) {
        console.log(`Error in deleteMessage Controller`, error.message);
        res.status(500).json({ message: `Internal Server Error` });
    }
}

// NEW: Edit message controller
export const editMessage = async (req, res) => {
    try {
        const { messageId } = req.params;
        const { text } = req.body;
        const userId = req.user._id;

        // Find the message
        const message = await Message.findById(messageId);
        
        if (!message) {
            return res.status(404).json({ message: "Message not found" });
        }

        // Check if user is the sender
        if (message.senderId.toString() !== userId.toString()) {
            return res.status(403).json({ message: "You can only edit your own messages" });
        }

        // Check if message is already deleted
        if (message.isDeleted) {
            return res.status(400).json({ message: "Cannot edit deleted message" });
        }

        // Update message
        message.text = text;
        message.isEdited = true;
        message.editedAt = new Date();
        await message.save();

        // Emit real-time update to both sender and receiver
        const receiverSocketId = getReceiverSocketId(message.receiverId);
        const senderSocketId = getReceiverSocketId(message.senderId);

        if (receiverSocketId) {
            io.to(receiverSocketId).emit("messageEdited", message);
        }
        if (senderSocketId) {
            io.to(senderSocketId).emit("messageEdited", message);
        }

        res.status(200).json(message);

    } catch (error) {
        console.log(`Error in editMessage Controller`, error.message);
        res.status(500).json({ message: `Internal Server Error` });
    }
}