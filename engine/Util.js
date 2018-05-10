import config from '../config'
import regeneratorRuntime from './lib/regenerator'
import wx from './wx'

const BASE_WIDTH = 750

export default class Util {
  static convertRpxToPx = async (currentRpx = 0) => {
    const phoneSetting = await wx.getSystemInfo()
    return Math.floor(currentRpx * (phoneSetting.screenWidth / 750))
  }

  static getParamsFromQuery = (query, key) => {
    if (query && query.q) {
      const url = decodeURIComponent(query.q)
      return Util.getQueryString(url, key)
    }

    return null
  }

  static getQueryString = (url, key) => {
    url = url.substr(url.indexOf("?"))
    const reg = new RegExp('(^|&)' + key + '=([^&]*)(&|$)', 'i')
    const r = url.substr(1).match(reg);
    if (r != null) {
      return unescape(r[2]);
    }

    return null;
  }

  // 获取 start 至 end 随机整数
  static getRandom = (start, end) => {
    const range = end - start + 1;
    return Math.floor(Math.random() * range + start);
  }

  /**
   * return 单位 rpx
   */
  static getWindowHeight = () => {
    const { windowWidth, windowHeight } = wx.getSystemInfoSync()
    const scale = BASE_WIDTH / parseFloat(windowWidth)

    return Math.floor(windowHeight * scale)
  }
}
