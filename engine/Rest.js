import Engine from './Engine'
import { Scopes } from './Enum'
import config from '../config'
import regeneratorRuntime from './lib/regenerator'
import wx from './wx'

const METHOD = {
  GET: 'GET',
  POST: 'POST',
  PUT: 'PUT',
  DELETE: 'DELETE'
}

export default class Rest {
  static header = {}

  static baseUrl = null

  static data = {}

  static currentRequest = null

  static _request({ url, method, header = {}, data }) {
    return new Promise((resolve, reject) => {
      const requestTag = new Date().getTime()
      Rest.header.cookie = accessToken
      // cache request for 401 error, if 401 happend request it again after auth
      const currentUrl = (Rest.baseUrl || '') + url
      const oauthUrl = config.getOauthUrl()
      if (currentUrl.indexOf(oauthUrl) === -1) {
        Rest.currentRequest = { url, method, header, data }
      }
      console.log(requestTag + ' Request: ', currentUrl, ' Data: ', {...Rest.data, ...data})
      wx.request({
        url: currentUrl,
        method: method || METHOD.GET,
        data: {
          ...Rest.data,
          ...data
        },
        header: {
          ...Rest.header,
          ...header
        },
        success: async (res) => {
          console.log(requestTag + ' Response: ', res)
          if (res.statusCode === 401) {
            await Engine.login()
            if (Engine.rest.currentRequest) {
              const result = await Engine.rest._request(Engine.rest.currentRequest)
              resolve(result)
            }

            return
          }
          if (res.statusCode === 500) {
            console.error('res', res)
            wx.showToast({ title: '服务出错了，请联系管理员', icon: 'none' })
            resolve(res)
            return
          }

          if (res.statusCode === 200 && res.data) {
            res.data = Engine.parseTimeFields(res.data)
          }
          resolve(res)
        },
        fail: (error) => {
          if (error.errMsg.indexOf('请求超时')) {
            wx.showToast({ title: '请求超时', icon: 'none' })
          } else {
            wx.showToast({ title: '当前网络不可用，请检查网络设置', icon: 'none' })
          }
          console.error('request error: ', error)
          reject(error)
        }
      })
    })
  }

  static async get(url, data, showLoading = false, header = {}) {
    showLoading && Engine.showLoading()
    let result
    try {
      result = await Rest._request({ url, method: METHOD.GET, header, data })
    } finally {
      showLoading && Engine.hideLoading()
    }

    return result
  }
  static async post(url, data, showLoading = false, header = {}) {
    showLoading && Engine.showLoading()
    let result
    try {
      result = await Rest._request({ url, method: METHOD.POST, header, data })
    } finally {
      showLoading && Engine.hideLoading()
    }

    return result
  }
  static async put(url, data, showLoading = false, header = {}) {
    showLoading && Engine.showLoading()
    let result
    try {
      result = await Rest._request({ url, method: METHOD.PUT, header, data })
    } finally {
      showLoading && Engine.hideLoading()
    }

    return result
  }
  static async delete(url, data, showLoading = false, header = {}) {
    showLoading && Engine.showLoading()
    let result
    try {
      result = await Rest._request({ url, method: METHOD.DELETE, header, data })
    } finally {
      showLoading && Engine.hideLoading()
    }

    return result
  }
}
