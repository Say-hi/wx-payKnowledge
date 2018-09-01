// 获取全局应用程序实例对象
const app = getApp()

// 创建页面实例对象
Page({
  /**
   * 页面的初始数据
   */
  data: {
    testImg: app.data.testImg
  },
  getData () {
    let that = this
    app.wxrequest({
      url: app.getUrl().commentInfo,
      data: {
        key: app.gs(),
        id: that.data.options.id
      },
      success (res) {
        wx.hideLoading()
        if (res.data.code === 1) {
          that.setData({
            info: res.data.data
          })
        } else {
          app.setToast(that, {content: res.data.msg})
        }
      }
    })
  },
  upReply () {
    if (!this.data.pwd) return app.setToast(this, {content: '请输入回复内容'})
    let that = this
    app.wxrequest({
      url: app.getUrl().reply,
      data: {
        key: app.gs(),
        comment_id: that.data.info.id,
        content: that.data.pwd
      },
      success (res) {
        wx.hideLoading()
        if (res.data.code === 1) {
          that.getData()
        } else {
          app.setToast(that, {content: res.data.msg})
        }
      }
    })
  },
  inputValue (e) {
    app.inputValue(e, this)
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad (options) {
    app.setBar('评论详情')
    app.getSelf(this)
    this.setData({
      options
    }, this.getData)
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
