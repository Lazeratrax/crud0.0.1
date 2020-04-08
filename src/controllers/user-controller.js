const service = require('../services/user-service')
class UserController {
    constructor(){}
    addUser = async (req, res) => {
        try {
            const result = await service.add(req.body)
            res.status(201).send(result)
        } catch (e) {
            res.status(400).send({error:e.message})
        }
    }
    deleteUser = async (req, res) => {
        try {
            const result = await service.del(req.params.id)
            res.status(201).send(result)
        } catch (e) {
            res.status(400).send({error: e.message})
        }
    }
    updateUser = async (req, res) => {
        try {
            const result = await service.update(req.body)
            res.status(201).send(result)
        } catch (e) {
            res.status(400).send({error: e.message})
        }
    }

    getUser = async (req, res) => {
        try {
            const result = await service.get(req.params.id)
            res.send(result)
        } catch (e) {
            res.status(400).send({error:e.message})
        }
    }
    getAllUser = async (req, res) => {
        try {
            const result = await service.getAll()
            res.send(result)
        } catch (e) {
            res.status(400).send({error:e.message})
        }
    }

}

module.exports = UserController;
