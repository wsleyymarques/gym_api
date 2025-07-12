import { DefaultRepository } from './default-repository'

export class WorkoutRepository extends DefaultRepository<'workout'> {
    constructor() {
        super('workout')
    }
}