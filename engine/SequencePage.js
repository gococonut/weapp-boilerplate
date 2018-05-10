import Engine from './Engine'
import regeneratorRuntime from './lib/regenerator.js'

export const SequencePage = (options) => {
  if (options.onLoad) {
    const tempOnload = options.onLoad
    options.onLoad = async function (options) {
      await Engine.engineInitPromise
      tempOnload.call(this, options)
    }
  }

  if (options.onShow) {
    const tempOnShow = options.onShow
    options.onShow = async function () {
      await Engine.engineInitPromise
      tempOnShow.call(this)
    }
  }

  return Page(options)
}
