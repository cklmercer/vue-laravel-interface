import { url as route } from './route'

/*
|-----------------------------------------------------------------------------------------------
| HTTP Function Generators
|-----------------------------------------------------------------------------------------------
*/

/**
 * Generate a function to submit a 'destroy' request to the given service.
 * @param {string} service
 * @return {function}
 */
export const destroy = ({ bus, http, name, service }) => ({ data, headers, query } = {}) => {
  const request = {
    data,
    headers: headers || {},
    method: 'DELETE',
    url: route(service, 'destroy', query),
  }

  return http(request)
    .then(response => onSuccess(bus, name, 'destroy', response))
    .catch(error => onError(bus, name, 'destroy', error))
}

/**
 * Generate a function to submit an 'index' request to the given service.
 * @param {string} service
 * @return {function}
 */
export const index = ({ bus, http, name, service }) => ({ data, headers, query } = {}) => {
  const request = {
    data,
    headers: headers || {},
    method: 'GET',
    url: route(service, 'index', query),
  }

  return http(request)
    .then(response => onSuccess(bus, name, 'index', response))
    .catch(error => onError(bus, name, 'index', error))
}

/**
 * Generate a function to submit a 'show' request to the given service.
 * @param {string} service
 * @return {function}
 */
export const show = ({ bus, http, name, service }) => ({ data, headers, query } = {}) => {
  const request = {
    data,
    headers: headers || {},
    method: 'GET',
    url: route(service, 'show', query),
  }

  return http(request)
    .then(response => onSuccess(bus, name, 'show', response))
    .catch(error => onError(bus, name, 'show', error))
}

/**
 * Generate a function to submit a 'store' request to the given service.
 * @param {string} service
 * @return {function}
 */
export const store = ({ bus, http, name, service }) => ({ data, headers, query } = {}) => {
  const request = {
    data,
    headers: headers || {},
    method: 'POST',
    url: route(service, 'store', query),
  }

  return http(request)
    .then(response => onSuccess(bus, name, 'store', response))
    .catch(error => onError(bus, name, 'store', error))
}

/**
 * Generate a function to submit an 'update' request to the given service.
 * @param {string} service
 * @return {function}
 */
export const update = ({ bus, http, name, service }) => ({ data, headers, query } = {}) => {
  const request = {
    data,
    headers: headers || {},
    method: 'PATCH',
    url: route(service, 'update', query),
  }

  return http(request)
    .then(response => onSuccess(bus, name, 'update', response))
    .catch(error => onError(bus, name, 'update', error))
}

/*
|-----------------------------------------------------------------------------------------------
| Event Function Generators
|-----------------------------------------------------------------------------------------------
*/

/**
 * Generate a function to emit an event for the given service.
 * @param {string} service
 * @param {object} bus
 * @return {function}
 */
export const emit = (service, bus) => (type, data) => bus.emit(`${service}.${type}`, data)

/**
 * Generate a function to remove an event handler from the given service.
 * @param {string} service
 * @param {object} bus
 * @return {function}
 */
export const off = (service, bus) => (type, handler) => bus.off(`${service}.${type}`, handler)

/**
 * Generate a function to add an event handler for the given service.
 * @param {string} service
 * @param {object} bus
 * @return {function}
 */
export const on = (service, bus) => (type, handler) => bus.on(`${service}.${type}`, handler)

/**
 * Generate a function to add a a single-use event handler to the given service.
 * @param {string} service
 * @param {object} bus
 * @return {function}
 */
export const once = (service, bus) => (type, handler) => bus.once(`${service}.${type}`, handler)

/**
 * Generate a function to retrieve the event handlers for the given service.
 * @param {string} service
 * @param {object} bus
 * @return {function}
 */
export const subscriptions = (service, bus) => () => bus.subscriptions.filter(s => s.type.startsWith(`${service}.`))

/*
|-----------------------------------------------------------------------------------------------
| Event Handlers
|-----------------------------------------------------------------------------------------------
*/

/**
 * Emit an event after a service request results in an error.
 * @param {object} bus
 * @param {string} service
 * @param {string} action
 * @param {*} error
 * @return {Promise}
 */
export const onError = (bus, service, action, error) => {
  const data = error.response ? error.response.data : false

  bus.emit(`${service}.${action}.error`, data || error)

  return Promise.reject(data || error)
}

/**
 * Emit an event after a service request results in a successful response.
 * @param {object} bus
 * @param {string} service
 * @param {string} action
 * @param {object} response
 * @param {*} response.data
 * @return {Promise}
 */
export const onSuccess = (bus, service, action, { data } = {}) => {
  bus.emit(`${service}.${action}.success`, data)

  return Promise.resolve(data)
}
