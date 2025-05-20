import { env } from '@/env'
import axios from 'axios'

export const auth = axios.create({
  baseURL: env.AUTH_SERVICE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
})

auth.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true

      try {
        const { data } = await auth.post('/token/refresh', null, {
          withCredentials: true,
        })

        // Atualiza headers
        auth.defaults.headers.common.Authorization = `Bearer ${data.token}`
        originalRequest.headers.Authorization = `Bearer ${data.token}`

        return auth(originalRequest)
      } catch (refreshError) {
        console.error('Erro ao tentar refresh token:', refreshError)
        return Promise.reject(refreshError)
      }
    }

    return Promise.reject(error)
  },
)

export async function verify(token: string) {
  const response = await auth.post(
    '/token/verify',
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  )

  return response.data
}
