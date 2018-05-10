import { DateExtension, Engine, I18N, Rest, regeneratorRuntime, resources, wx } from './engine/index'

function init() {
  // init i18n
  I18N.registerLocale(resources)
  I18N.setLocale('zh-CN')
  wx.i18n = I18N.i18n
  DateExtension.init()
}

init()

App({
  onShow: async function (options) {
    await Engine.init(Rest)
  },
  onError: function (error) {
    console.error('global error: ', error)
  }
})
