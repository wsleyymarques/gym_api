import {Router} from "express";
import userRoutes from "./user-routes";
import exerciseRoutes from "./exercise-routes";
import workoutRoutes from "./workout-routes";
import workoutExerciseRoutes from "./workoutExercise-routes";

const router = Router()

router.use('/users',userRoutes)
router.use('/exercise',exerciseRoutes)
router.use('/workout',workoutRoutes)
router.use('/workoutExercise',workoutExerciseRoutes)

export default router