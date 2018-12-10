import HTTP from 'axios'
import config from '@/config/api'

/**
 * Axios instance to used to submit HTTP requests.
 * @type {object}
 */
const http = HTTP.create({
  baseURL: `${config.http.url}:${config.http.port}`,
  headers: config.http.headers,
})

// Add authentication header when available.
http.interceptors.request.use(request => {
  if (typeof window !== 'object') {
    return request
  }

  const token = window.localStorage.getItem('access_token')

  if (token) {
    request.headers.Authorization = `Bearer ${token}`
  }

  return request
})

// Update access token when available.
http.interceptors.response.use(response => {
  if (typeof window !== 'object' || typeof response.headers !== 'object') {
    return response
  }

  if (typeof response.headers['x-access-token'] === 'string') {
    window.localStorage.setItem('access_token', response.headers['x-access-token'])
  }

  return response
})

export default http
