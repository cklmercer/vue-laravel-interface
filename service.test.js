import MockAdapter from 'axios-mock-adapter'
import axios from 'axios'
import Bus from '@/utilities/bus'
import { url as route } from './route'
import * as Service from './service'

/**
 * Mock HTTP adapter to intercept requests.
 * @type {object}
 */
const http = new MockAdapter(axios)

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

/**
 * Mock request config.
 * @type {object}
 */
const Config = () => ({
  bus: Bus(),
  http: axios,
  name: 'font',
  service,
})

describe('services ', () => {
  describe('service', () => {
    test('generating a function to submit a service "destroy" request', async () => {
      const query = { font: 'test-font' }
      const url = route(service, 'destroy', query)

      http.onDelete(url).reply(200, { message: 'success' })

      const request = Service.destroy(Config())

      return request({ query }).then(response => {
        expect(response.message).toEqual('success')
      })
    })

    test('generating a function to submit a service "index" request', async () => {
      const url = route(service, 'index')

      http.onGet(url).reply(200, { message: 'success' })

      const request = Service.index(Config())

      return request().then(response => {
        expect(response.message).toEqual('success')
      })
    })

    test('generating a function to submit a service "show" request', async () => {
      const query = { font: 'test-font' }
      const url = route(service, 'show', query)

      http.onGet(url).reply(200, { message: 'success' })

      const request = Service.show(Config())

      return request({ query }).then(response => {
        expect(response.message).toEqual('success')
      })
    })

    test('generating a function to submit a service "store" request', async () => {
      const query = { font: 'test-font' }
      const url = route(service, 'store', query)

      http.onPost(url).reply(200, { message: 'success' })

      const request = Service.store(Config())

      return request({ query }).then(response => {
        expect(response.message).toEqual('success')
      })
    })

    test('generating a function to submit a service "update" request', async () => {
      const query = { font: 'test-font' }
      const url = route(service, 'update', query)

      http.onPatch(url).reply(200, { message: 'success' })

      const request = Service.update(Config())

      return request({ query }).then(response => {
        expect(response.message).toEqual('success')
      })
    })

    test('emitting a "success" event after a successful request', () => {
      const url = route(service, 'index')

      http.onGet(url).reply(200, { message: 'success' })

      const config = Config()
      const request = Service.index(config)
      const fn = jest.fn()

      config.bus.on('font.index.success', fn)

      return request().then(() => {
        expect(fn).toHaveBeenCalledTimes(1)
      })
    })

    test('emitting a "success" event after a successful request', () => {
      const url = route(service, 'index')

      http.onGet(url).reply(401, { message: 'error' })

      const config = Config()
      const request = Service.index(config)
      const fn = jest.fn()

      config.bus.on('font.index.error', fn)

      return request().catch(() => {
        expect(fn).toHaveBeenCalledTimes(1)
      })
    })

    test('generating a function to emit an event for a service', () => {
      const { bus } = Config()
      const fn = jest.fn()
      const emit = Service.emit('font', bus)

      bus.on('font.test', fn)
      emit('test', {})

      expect(fn).toHaveBeenCalledTimes(1)
    })

    test('generating a function to register an event handler for a service', () => {
      const { bus } = Config()
      const fn = jest.fn()
      const on = Service.on('font', bus)

      on('test', fn)
      bus.emit('font.test', {})
      bus.emit('font.test', {})

      expect(fn).toHaveBeenCalledTimes(2)
    })

    test('generating a function to register a single-use event handler for a service', () => {
      const { bus } = Config()
      const fn = jest.fn()
      const once = Service.once('font', bus)

      once('test', fn)
      bus.emit('font.test', {})
      bus.emit('font.test', {})

      expect(fn).toHaveBeenCalledTimes(1)
    })

    test('generating a function to remove an event handler from a service', () => {
      const { bus } = Config()
      const fn = jest.fn()
      const off = Service.off('font', bus)

      bus.on('font.test', fn)
      off('test', fn)
      bus.emit('font.test', {})

      expect(fn).toHaveBeenCalledTimes(0)
    })

    test('generating a function to retrieved the event handlers for a service', () => {
      const { bus } = Config()
      const fn = jest.fn()
      const subscriptions = Service.subscriptions('font', bus)

      bus.on('font.test', fn)

      expect(subscriptions()).toHaveLength(1)

      bus.on('font.test-2', fn)

      expect(subscriptions()).toHaveLength(2)

      bus.off('font.test', fn)

      expect(subscriptions()).toHaveLength(1)

      bus.off('font.test-2', fn)

      expect(subscriptions()).toHaveLength(0)
    })
  })
})
