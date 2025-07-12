import { Router } from 'express'
import { WorkoutExerciseController } from '../controllers/WorkoutExerciseController'

const router = Router()
const controller = new WorkoutExerciseController()

// POST /workoutExercise/:id/exercises
router.post('/:id/exercises', controller.addExerciseToWorkout.bind(controller))

// GET /workoutExercise/:id/exercises
router.get('/:id/exercises', controller.getAllWorkoutExercise.bind(controller))

export default router