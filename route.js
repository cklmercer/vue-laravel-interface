import qs from 'qs'

/**
 * Generate an service API endpoint.
 * @param {object} service
 * @param {string} action
 * @param {object} query
 * @return {string}
 */
export const url = (service, action, query = {}) => {
  const options = service[action]
  const parameters = format(options.parameters, query)
  const uri = '/' + paramitize(parameters.uri, options.uri, query)
  const queryObject = parameters.query.reduce((qso, parameter) => {
    qso[parameter] = query[parameter]

    return qso
  }, {})

  const queryString = qs.stringify(queryObject, { encodeValuesOnly: true })

  const url = queryString ? `${uri}?${queryString}` : uri

  return url
}

/**
 * Format the parameters for a service route.
 * @param {array} uri
 * @param {object} query
 */
export const format = (uri, query) => {
  const parameters = {
    query: [],
    uri: [],
  }

  return Object.keys(query).reduce((groups, parameter) => {
    if (uri.includes(parameter)) {
      groups.uri.push(parameter)
    } else {
      groups.query.push(parameter)
    }

    return groups
  }, parameters)
}

/**
 * Populate a service route with its required parameters.
 * @param {Array} parameters
 * @param {string} uri
 * @param {object} query
 * @return {string}
 */
export const paramitize = (parameters, uri, query) => {
  return parameters.reduce((uri, parameter) => {
    if (typeof query[parameter] === 'undefined') {
      throw new Error(`Could not generate route. Required parameter "${parameter}" was not provided.`)
    }

    return uri.replace(`{${parameter}}`, query[parameter])
  }, uri)
}
