// 获取全局应用程序实例对象
const app = getApp()

// 创建页面实例对象
Page({
  /**
   * 页面的初始数据
   */
  data: {
    title: 'userMoney',
    focus: true
  },
  inputValue (e) {
    app.inputValue(e, this)
  },
  recharge () {
    let that = this
    if (!that.data.pwd) return app.setToast(that, {content: '请输入充值金额'})
    app.wxrequest({
      url: app.getUrl().recharge,
      data: {
        key: app.gs(),
        amount: that.data.pwd
      },
      success (res) {
        wx.hideLoading()
        if (res.data.code === 1) {
          app.wxpay(Object.assign(JSON.parse(res.data.data), {
            success (res) {
              wx.showToast({
                title: '充值成功',
                mask: true
              })
              setTimeout(() => {
                wx.navigateBack()
              }, 1000)
            },
            fail () {
              wx.showToast({
                title: '充值失败',
                mask: true
              })
            }
          }))
        } else {
          app.setToast(that, {content: res.data.msg})
        }
      }
    })
  },
  withdraw () {
    let that = this
    if (!that.data.pwd) return app.setToast(that, {content: '请输入提现金额'})
    else if (that.data.pwd > that.data.money) return app.setToast(that, {content: '提现金额不能大于余额'})
    app.wxrequest({
      url: app.getUrl().withdraw,
      data: {
        key: app.gs(),
        amount: that.data.pwd
      },
      success (res) {
        wx.hideLoading()
        if (res.data.code === 1) {
          wx.showToast({
            title: '提现受理中'
          })
        } else {
          app.setToast(that, {content: res.data.msg})
        }
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad (options) {
    app.setBar(options.type)
    this.setData({
      type: options.type,
      money: options.money
    })
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
