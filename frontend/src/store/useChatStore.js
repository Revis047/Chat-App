import { create } from 'zustand';
import { axiosInstance } from '../lib/Axios.js';
import toast from 'react-hot-toast';
import { useAuthStore } from './useAuthStore.js';

export const useChatStore = create((set, get) => ({
  messages: [],
  users: [],
  selectedUser: null,
  isUsersLoading: false,
  isMessagesLoading: false,
  typingUsers: [],

  getUsers: async () => {
    set({ isUsersLoading: true });
    try {
      const res = await axiosInstance.get("/message/user");
      set({ users: res.data });
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Something went wrong";
      toast.error(errorMessage);
    } finally {
      set({ isUsersLoading: false });
    }
  },

  getMessages: async (userId) => {
    const { selectedUser } = get();
    const targetUserId = userId || selectedUser?._id;
    if (!targetUserId) return;

    set({ isMessagesLoading: true });
    try {
      const res = await axiosInstance.get(`/message/${targetUserId}`);
      set({ messages: res.data });
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Something went wrong";
      toast.error(errorMessage);
    } finally {
      set({ isMessagesLoading: false });
    }
  },

  sendMessage: async (messageData) => {
    const { selectedUser, messages } = get();
    if (!selectedUser?._id) return;

    try {
      const res = await axiosInstance.post(`/message/send/${selectedUser._id}`, messageData);
      set({ messages: [...messages, res.data] });
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Failed to send message";
      toast.error(errorMessage);
    }
  },

  //  Delete message function
  deleteMessage: async (messageId) => {
    try {
      await axiosInstance.delete(`/message/${messageId}`);
      // The real-time update will handle UI changes
      toast.success("Message deleted");
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Failed to delete message";
      toast.error(errorMessage);
    }
  },

  //  Edit message function
  editMessage: async (messageId, newText) => {
    try {
      const res = await axiosInstance.put(`/message/${messageId}`, { text: newText });
      // The real-time update will handle UI changes
      toast.success("Message edited");
      return res.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Failed to edit message";
      toast.error(errorMessage);
      throw error;
    }
  },

  subscribeToMessages: () => {
    const { selectedUser } = get();
    if (!selectedUser) return;

    const socket = useAuthStore.getState().socket;
    if (!socket) return;

    socket.on("newMessage", (newMessage) => {
      const { selectedUser: currentSelectedUser } = get();
      if (
        newMessage.senderId === currentSelectedUser?._id || 
        newMessage.receiverId === currentSelectedUser?._id
      ) {
        set({
          messages: [...get().messages, newMessage],
        });
      }
    });

    //  Handle message deletion
    socket.on("messageDeleted", (deletedMessage) => {
      const { messages } = get();
      const updatedMessages = messages.map(msg => 
        msg._id === deletedMessage._id 
          ? { ...msg, isDeleted: true, deletedAt: deletedMessage.deletedAt }
          : msg
      );
      set({ messages: updatedMessages });
    });

    //  Handle message editing
    socket.on("messageEdited", (editedMessage) => {
      const { messages } = get();
      const updatedMessages = messages.map(msg => 
        msg._id === editedMessage._id 
          ? { ...msg, text: editedMessage.text, isEdited: true, editedAt: editedMessage.editedAt }
          : msg
      );
      set({ messages: updatedMessages });
    });

    socket.on("typing", (userId) => {
      const { typingUsers } = get();
      if (!typingUsers.includes(userId)) {
        set({ typingUsers: [...typingUsers, userId] });
      }
    });

    socket.on("stopTyping", (userId) => {
      const { typingUsers } = get();
      set({ typingUsers: typingUsers.filter(id => id !== userId) });
    });
  },

  unsubscribeFromMessages: () => {
    const socket = useAuthStore.getState().socket;
    if (socket) {
      socket.off("newMessage");
      socket.off("messageDeleted");
      socket.off("messageEdited");
      socket.off("typing");
      socket.off("stopTyping");
    }
  },

  setSelectedUser: (selectedUser) => {
    set({ selectedUser });
  },

  initializeChat: (user) => {
    get().unsubscribeFromMessages();
    set({ selectedUser: user });
    if (user) {
      get().getMessages(user._id);
      get().subscribeToMessages();
    }
  },

  cleanup: () => {
    get().unsubscribeFromMessages();
    set({ selectedUser: null, messages: [], typingUsers: [] });
  },
}));