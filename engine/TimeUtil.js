import regeneratorRuntime from './lib/regenerator.js'

export default class TimeUtil {
  static MINUTE_SECONDS = 60
  static HOUR_SECONDS = 60 * 60
  static DAY_SECONDS = 60 * 60 * 24

  static setInterval = (callback, interval, timeoutRef = {}) => {
    timeoutRef.id = setTimeout(() => {
      callback()
      TimeUtil.setInterval(callback, interval, timeoutRef)
    }, interval)

    const clearHandle = () => {
      clearTimeout(timeoutRef.id)
    }

    return clearHandle
  }

  static clearInterval = (clearHandle) => {
    if (clearHandle) {
      clearHandle()
    }
  }

  static getTimeAndUnit = (second) => {
    if (second < TimeUtil.MINUTE_SECONDS) {
      return { time: second, unit: 'second' }
    }

    if (second < TimeUtil.HOUR_SECONDS) {
      const minute = second / TimeUtil.MINUTE_SECONDS + ''
      const dotPosition = minute.indexOf('.')
      if (dotPosition === -1) {
        return { time: minute, unit: 'minute' }
      }

      return {time: minute.substring(0, dotPosition + 2), unit: 'minute'}
    }

    if (second < TimeUtil.DAY_SECONDS) {
      const hour = second / TimeUtil.HOUR_SECONDS + ''
      const dotPosition = hour.indexOf('.')
      if (dotPosition === -1) {
        return { time: hour, unit: 'hour' }
      }

      return {time: hour.substring(0, dotPosition + 2), unit: 'hour'}
    }

    const day = second / TimeUtil.DAY_SECONDS + ''
    const dotPosition = day.indexOf('.')
    if (dotPosition === -1) {
      return { time: day, unit: 'day' }
    }

    return {time: day.substring(0, dotPosition + 2), unit: 'day'}
  }

  static parseTimeFields = (data) => {
    for (const field in data) {
      if ((typeof(data[field]) === 'object' || typeof(data[field]) === 'array')  && data[field]) {
        Engine.parseTimeFields(data[field])
      } else {
        if (field.match(/At$/) || field.match(/Time$/)) {
          data[field] = new Date(data[field].replace(/-/g, '/'))
        }
      }
    }

    return data
  }
}
