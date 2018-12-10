import * as router from './route'

/**
 * Mock service to test against.
 * @type {object}
 */
const service = {
  destroy: {
    methods: ['DELETE'],
    parameters: ['font'],
    uri: 'v2/fonts/{font}',
  },
  index: {
    methods: ['GET'],
    parameters: [],
    uri: 'v2/fonts',
  },
  show: {
    methods: ['GET'],
    parameters: ['font'],
    uri: 'v2/fonts/{font}',
  },
  store: {
    methods: ['POST'],
    parameters: [],
    uri: 'v2/fonts',
  },
  update: {
    methods: ['PUT', 'PATCH'],
    parameters: ['font'],
    uri: 'v2/fonts/{font}',
  },
}

describe('services', () => {
  describe('routing', () => {
    test('generating a simple service route', () => {
      const route = router.url(service, 'index')

      expect(route).toEqual('/v2/fonts')
    })

    test('generating a complex service route', () => {
      const route = router.url(service, 'update', {
        font: 'some-font',
        include: ['templates'],
        foo: 'bar',
      })

      expect(route).toEqual('/v2/fonts/some-font?include[0]=templates&foo=bar')
    })

    test('formatting parameters used to generate a service route', () => {
      const parameters = router.format(service.update.parameters, {
        font: 'test-font',
        limit: 30,
        include: ['one', 'two'],
      })

      // uri parameters
      expect(parameters.uri.includes('font')).toBeTruthy()
      expect(parameters.uri.includes('limit')).toBeFalsy()
      expect(parameters.uri.includes('include')).toBeFalsy()

      // query parameters
      expect(parameters.query.includes('limit')).toBeTruthy()
      expect(parameters.query.includes('include')).toBeTruthy()
      expect(parameters.query.includes('font')).toBeFalsy()
    })
  })
})
