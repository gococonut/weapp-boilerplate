import regeneratorRuntime from './lib/regenerator'
import wx from './wx'

export default class Storage {
  static setItem = async (key, data) => {
    try {
      await wx.setStorage({ key, data })
    } catch (e) {
      console.error(e)
    }
  }

  static getItem = async (key) => {
    let result = {data: undefined}
    try {
      result = await wx.getStorage({ key })
    } catch (e) {
      result.data = undefined
    }

    return result.data
  }
}
