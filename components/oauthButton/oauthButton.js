import { Engine, regeneratorRuntime } from '../../engine/index.js'

Component({
  properties: {
    eventName: {
      type: String
    },
    buttonStyle: {
      type: String
    },
    needOauth: {
      type: Boolean,
      value: true,
      observer: function (newVal, oldVal) {
        this.setData({ needOauth: newVal })
      }
    }
  },
  methods: {
    userInfoHandler: async function (e) {
      const hasLogin = await Engine.hasLogin()
      if (!hasLogin) {
        await Engine.login()
      }

      this.triggerOauthFinishEvent()
    },
    triggerOauthFinishEvent: async function () {
      this.triggerEvent(this.data.eventName)
    }
  },
})
