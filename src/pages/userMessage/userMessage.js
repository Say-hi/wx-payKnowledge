// 获取全局应用程序实例对象
const app = getApp()

// 创建页面实例对象
Page({
  /**
   * 页面的初始数据
   */
  data: {
    page: 0,
    lists: [],
    testImg: app.data.testImg,
    title: 'userMessage'
  },
  getVideoList () {
    let that = this
    app.wxrequest({
      url: app.getUrl().usermessage,
      data: {
        key: app.gs(),
        page: ++that.data.page
      },
      success (res) {
        wx.hideLoading()
        if (res.data.code === 1) {
          for (let v of res.data.data.data) {
            v.create_time = app.moment(v.create_time)
          }
          that.setData({
            lists: that.data.lists.concat(res.data.data.data),
            more: res.data.data.data.length < res.data.data.per_page ? 1 : 0
          })
        } else {
          app.setToast(that, {content: res.data.msg})
        }
      }
    })
  },
  onReachBottom () {
    if (this.data.more) return app.setToast(this, {content: '别扯了，没有啦~~'})
    else this.getVideoList()
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad () {
    app.setBar('我的消息')
    app.getSelf(this)
    this.getVideoList()
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
    this.setData({
      page: 0,
      lists: []
    }, this.getVideoList)
    // TODO: onPullDownRefresh
  }
})
