import { user } from "../models/userModel.js";
import { userValidation, userValidationPartial } from "../schemas/userSchema.js";

export class userController {
    static async getAll(req, res) {
        const users = await user.getAll()
        return res.json(users)
    }

    static async findByName(req, res) {
        const results = userValidationPartial(req.body)
        if (results.error){
            return res.status(400)
        }
        const users = await user.findByName({ data: results.data })
        if (users === null) {
            return res.status(404).json({error: 'incorrect credentials'});
        }
        return res.json(users)
    }

    static async createUser(req, res) {
        const results = userValidation(req.body)
        if (results.error) {
            return res.status(400).json({error: results.error.issues[0].message})
        }
        const data = await user.createUser({ data: results.data })
        if (data.error) {
            return res.status(400).json({error: "register error"})
        }
        return res.status(201).json({success: data, data: results.data})
    }

    static async editUser(req, res) {
        const results = userValidationPartial(req.body)
        if (results.error) {
            return res.status(400).json({error: results.error.issues[0].message})
        }
        const data = await user.editUser({id: 1, data: results.data})
        if (data.error){
            return res.status(400).json({error: "error when modifying"})
        }
        return res.json({success: data, data: results.data})
    }

    static async deleteUser(req, res) {
        const { id } = req.query
        if (!id){
            return res.status(404)
        }
        const data = await user.deleteUser(id)
        return res.json({success: data})
    }
}