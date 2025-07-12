import { Router } from 'express'
import {ExerciseController} from "../controllers/ExerciceController";

const exerciseController = new ExerciseController()
const router = Router()

router.post('/', exerciseController.create.bind(exerciseController))
router.get('/', exerciseController.getAll.bind(exerciseController))
router.get('/:id', exerciseController.getExerciseById.bind(exerciseController))

export default router