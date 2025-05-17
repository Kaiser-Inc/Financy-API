export class InvalidCredentialsError extends Error {
  constructor() {
    super('The credentials provided are invalid, try again.')
  }
}
