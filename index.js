import config from '@/config/api'
import Bus from '@/utilities/bus'
import http from './http'
import * as Service from './service'

/**
 * Event bus instance.
 * @type {object}
 */
const bus = Bus()

/**
 * API service instances.
 * @type {Array}
 */
const services = Object.keys(config.services).reduce((services, service) => {
  const instance = {
    destroy: Service.destroy({
      bus,
      http,
      name: service,
      service: config.services[service],
    }),

    index: Service.index({
      bus,
      http,
      name: service,
      service: config.services[service],
    }),

    show: Service.show({
      bus,
      http,
      name: service,
      service: config.services[service],
    }),

    store: Service.store({
      bus,
      http,
      name: service,
      service: config.services[service],
    }),

    update: Service.update({
      bus,
      http,
      name: service,
      service: config.services[service],
    }),

    emit: Service.emit(service, bus),

    off: Service.off(service, bus),

    on: Service.on(service, bus),

    once: Service.once(service, bus),

    subscriptions: Service.subscriptions(service, bus),
  }

  services[service] = instance

  return services
}, {})

export default {
  bus,
  http,
  services,
  service(name) {
    return services[name]
  },
}
