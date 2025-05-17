import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'
import { compare } from 'bcryptjs'
import { beforeEach, describe, expect, it } from 'vitest'
import { UserAlreadyExistsError } from './errors/user-already-exists-error'
import { RegisterUseCase } from './register'

let usersRepository: InMemoryUsersRepository
let sut: RegisterUseCase

describe('Register use cases tests', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository()
    sut = new RegisterUseCase(usersRepository)
  })

  it('should to be able to register a new user', async () => {
    const { user } = await sut.execute({
      name: 'Jonny Test',
      email: 'jonnytest@gmail.com',
      password: 'jtest1234',
    })

    expect(user.id).toEqual(expect.any(String))
    expect(usersRepository.items.length).toBe(1)
    expect(usersRepository.items[0]).contain({
      name: 'Jonny Test',
      email: 'jonnytest@gmail.com',
    })
  })

  it('should hash user password upon user registration', async () => {
    const { user } = await sut.execute({
      name: 'Jonny Test',
      email: 'jonnytest@gmail.com',
      password: 'jtest1234',
    })

    const isPasswordCorrectlyHashed = await compare(
      'jtest1234',
      user.password_hash,
    )

    expect(isPasswordCorrectlyHashed).toBe(true)
  })

  it('should not to be able to register with same email twice', async () => {
    await sut.execute({
      name: 'Jonny Test',
      email: 'jonnytest@gmail.com',
      password: 'jtest1234',
    })

    await expect(() =>
      sut.execute({
        name: 'Jonny Test',
        email: 'jonnytest@gmail.com',
        password: 'jtest1234',
      }),
    ).rejects.toBeInstanceOf(UserAlreadyExistsError)
  })
})
