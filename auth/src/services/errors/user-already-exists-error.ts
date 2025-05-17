export class UserAlreadyExistsError extends Error {
    constructor() {
        super("This email is already registered in the system.")
    }
}