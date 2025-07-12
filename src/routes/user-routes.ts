import { Router } from 'express'
import {UserController} from "../controllers/UserController";

const userController = new UserController()
const router = Router()

router.post('/', userController.create.bind(userController))
router.post('/google', userController.createWithGoogle.bind(userController))
router.post('/login', userController.login.bind(userController))
router.post('/login/google', userController.loginWithGoogle.bind(userController))
router.get('/', userController.getAll.bind(userController))
router.get('/:id', userController.getUserById.bind(userController))
router.put('/:id/password', userController.changePassword.bind(userController))
router.put('/:id/name', userController.changeUserName.bind(userController))

export default router