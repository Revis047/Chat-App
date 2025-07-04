import express from "express"
import { protectRoute } from "../middleware/auth.middleware.js";
import { 
    getMessages, 
    getUsersForSidebar, 
    sendMessage, 
    deleteMessage, 
    editMessage 
} from "../controllers/message.controller.js";

const router = express.Router();

router.get(`/user`, protectRoute, getUsersForSidebar);
router.get(`/:id`, protectRoute, getMessages);
router.post(`/send/:id`, protectRoute, sendMessage);

//  Add delete and edit routes
router.delete(`/:messageId`, protectRoute, deleteMessage);
router.put(`/:messageId`, protectRoute, editMessage);

export default router;