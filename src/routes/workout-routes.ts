import {WorkoutController} from "../controllers/WorkoutController";
import {Router} from "express";

const workoutController = new WorkoutController()
const router = Router()

router.post('/',workoutController.create.bind(workoutController))
router.get('/',workoutController.getAll.bind(workoutController))
router.get('/:id',workoutController.getWorkoutById.bind(workoutController))

export default router