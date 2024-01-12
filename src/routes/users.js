import { Router } from "express";
import { userController } from "../controllers/userController.js";


export const users = Router()


// users.get('/', userController.getAll)
users.post('/register', userController.createUser)
users.post('/login', userController.findByName)
// users.put('/edit', userController.editUser)
// users.delete('/delete', userController.deleteUser)