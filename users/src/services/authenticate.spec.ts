import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'
import { hash } from 'bcryptjs'
import { beforeEach, describe, expect, it } from 'vitest'
import { AuthenticateUseCase } from './authenticate'
import { InvalidCredentialsError } from './errors/invalid-credentials-error'

let usersRepository: InMemoryUsersRepository
let sut: AuthenticateUseCase

describe('Authenticate use cases Tests', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository()
    sut = new AuthenticateUseCase(usersRepository)
  })

  it('shoud to be able to authenticate a user', async () => {
    await usersRepository.create({
      name: 'Jonny test',
      email: 'jonnytest@gmail.com',
      password_hash: await hash('jtest1234', 6),
    })

    const { user } = await sut.execute({
      email: 'jonnytest@gmail.com',
      password: 'jtest1234',
    })

    expect(user.name).toEqual('Jonny test')
  })

  it('shoud not to be able to authenticate a user with wrong email', async () => {
    await expect(() =>
      sut.execute({
        email: 'jonnytest@gmail.com',
        password: 'jtest1234',
      }),
    ).rejects.toBeInstanceOf(InvalidCredentialsError)
  })

  it('shoud not to be able to authenticate a user with wrong password', async () => {
    await usersRepository.create({
      name: 'Jonny test',
      email: 'jonnytest@gmail.com',
      password_hash: await hash('jtest1234', 6),
    })

    await expect(() =>
      sut.execute({
        email: 'jonnytest@gmail.com',
        password: 'ktest1234',
      }),
    ).rejects.toBeInstanceOf(InvalidCredentialsError)
  })
})
