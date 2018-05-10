import EventEmitter from './lib/eventemitter3'
import { Scopes } from './Enum'
import Storage from './Storage'
import config from '../config.js'
import regeneratorRuntime from './lib/regenerator.js'
import wx from './wx.js'

export default class Engine {
  static engineInitPromise = null
  static engineInitPromiseResolve = null
  static engineInitPromiseReject = null

  static init = async (rest) => {
    if (Engine.engineInitPromise !== null) {
      return
    }

    Engine.engineInitPromise = new Promise((resolve, reject) => {
      Engine.engineInitPromiseResolve = resolve
      Engine.engineInitPromiseReject = reject
    })

    try {
      Engine.rest = rest
      await Engine.login()
    } catch (error) {
      Engine.engineInitPromiseReject(error)
      Engine.hideLoading()
      return
    }

    Engine.engineInitPromiseResolve()
  }

  // 微信登录 或 第三方登录
  static login = async () => {
    const { code } = await wx.login()

    let encryptedData, iv, userInfo
    try {
      ({ userInfo, encryptedData, iv } = await wx.getUserInfo({ withCredentials: true }))
    } catch (error) {
      ({ userInfo, encryptedData, iv } = await Engine.getUserInfoWithPermissionModal())
    }

    await Storage.setItem('userInfo', userInfo )
  }

  static setRestBaseData = (data) => {
    Engine.rest.data = { ...Engine.rest.data, ...data }
  }

  static async getUserInfoWithPermissionModal () {
    const res = await wx.showModal({
      title: '温馨提示',
      content: '您已经拒绝微信授权，请开启权限，否则将无法使用当前小程序',
      confirmText: '开启',
      showCancel: false,
    })


    if (res.confirm) {
      const setting =  await wx.openSetting()
      if (setting.authSetting['scope.userInfo']) {
        return await wx.getUserInfo({ withCredentials: true })
      }

      return Engine.getUserInfoWithPermissionModal()
    }
  }

  static engineInitPromiseResolve = () => {
    Engine.engineInitPromise.resolve()
  }

  static engineInitPromiseReject = (error) => {
    Engine.engineInitPromise.reject(error)
  }

  static loadingCount = 0

  static showLoading = (title) => {
    Engine.loadingCount++
    if (title) {
      wx.showLoading({ title })
      return
    }

    wx.showLoading({ title: '努力加载中...'})
  }

  static hideLoading = () => {
    Engine.loadingCount--
    if (Engine.loadingCount < 0) {
      Engine.loadingCount = 0
    }

    if (Engine.loadingCount > 0) {
      return
    }

    setTimeout(wx.hideLoading, 150)
  }

  static hasLogin = async () => {
    const userInfo = Storage.getItem('userInfo')
    if (userInfo) {
      return true
    }

    return false
  }
}
