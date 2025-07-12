import { DefaultRepository } from './default-repository'

export class ExerciseRepository extends DefaultRepository<'exercise'> {
    constructor() {
        super('exercise')
    }
}