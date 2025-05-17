import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'
import { hash } from 'bcryptjs'
import { beforeEach, describe, expect, it } from 'vitest'
import { ResourceNotFoundError } from './errors/resource-not-found-error'
import { GetUserProfileUseCase } from './get-user-profile'

let usersRepository: InMemoryUsersRepository
let sut: GetUserProfileUseCase

describe('Authenticate use cases Tests', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository()
    sut = new GetUserProfileUseCase(usersRepository)
  })

  it('shoud to be able to get a user profile', async () => {
    const createdUser = await usersRepository.create({
      name: 'Jonny test',
      email: 'jonnytest@gmail.com',
      password_hash: await hash('jtest1234', 6),
    })

    const { user } = await sut.execute({
      userId: createdUser.id,
    })

    expect(user.name).toEqual('Jonny test')
  })

  it('shoud not to be able to get a inexistent user profile', async () => {
    await expect(() =>
      sut.execute({
        userId: 'inexistest-user-id',
      }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError)
  })
})
