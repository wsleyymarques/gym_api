import { Router } from 'express'
import { WorkoutExerciseController } from '../controllers/WorkoutExerciseController'

const router = Router()
const controller = new WorkoutExerciseController()

router.post('/:id/exercises', controller.addExerciseToWorkout.bind(controller))

router.get('/:id/exercises', controller.getAllWorkoutExercise.bind(controller))

export default router