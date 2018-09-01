// 获取全局应用程序实例对象
const app = getApp()
const baseDomain = 'http://192.168.0.154/api/v1/'
// 创建页面实例对象
Page({
  /**
   * 页面的初始数据
   */
  data: {
    testArr: [
      {
        name: '点击登陆',
        fun: 'getCode'
      },
      {
        name: '其他操作',
        fun: 'getName'
      }
    ]
  },
  getCode () {
    wx.login({
      success (res) {
        app.wxrequest({
          url: `${baseDomain}token/user`,
          data: {
            code: res.code
          },
          success (res2) {
            app.su('Token', res2.data.token)
          }
        })
      }
    })
  },
  getName () {
    app.wxrequest({
      url: '',
      data: {
        token: app.gs('Token')
      },
      success (res) {
        console.log(res) // 输出返回结果
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad () {
    app.getSelf(this)
    // TODO: onLoad
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady () {
    // TODO: onReady
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow () {
    // TODO: onShow
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide () {
    // TODO: onHide
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload () {
    // TODO: onUnload
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh () {
    // TODO: onPullDownRefresh
  }
})
