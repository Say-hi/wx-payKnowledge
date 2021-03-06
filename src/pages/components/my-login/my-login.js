// components/component-tag-name.js
const app = getApp()
Component({
  data: {},
  ready () {
    let that = this
    if (!app.gs()) {
      this.setData({
        show: true
      })
    } else {
      app.wxrequest({
        url: app.getUrl().index,
        data: {
          key: app.gs()
        },
        success (res) {
          wx.hideLoading()
          if (res.data.code === 1) {
            app.su('navArr', res.data.data.nav[0])
          } else if (res.data.code === 401) {
            that.setData({
              show: true
            })
          }
        }
      })
    }
  },
  methods: {
    MaskGetUserInfo (e) {
      if (e.detail.iv) {
        wx.showLoading({
          title: '刷新数据中...'
        })
        app.wxlogin()
      }
    }
  }
})
