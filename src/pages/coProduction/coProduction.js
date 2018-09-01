// 获取全局应用程序实例对象
const app = getApp()

// 创建页面实例对象
Page({
  /**
   * 页面的初始数据
   */
  data: {
    currentTab: 0,
    title: 'coProduction'
  },
  chooseTab (e) {
    this.setData({
      currentTab: e.currentTarget.dataset.index
    })
    let s = e.currentTarget.dataset.index * 1 === 0 ? 'content' : 'review'
    app.WP('content', 'html', this.data.info[s], this, 0)
  },
  getData () {
    let that = this
    app.wxrequest({
      url: app.getUrl().workshop,
      data: {
        workshop_id: that.data.options.id
      },
      success (res) {
        wx.hideLoading()
        if (res.data.code === 1) {
          app.WP('content', 'html', res.data.data.content, that, 0)
          that.setData({
            info: res.data.data
          })
        } else {
          app.setToast(that, {content: res.data.msg})
        }
      }
    })
  },
  goUrl (e) {
    app.su('yuyue', this.data.info.condition)
    wx.navigateTo({
      url: e.currentTarget.dataset.url
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad (options) {
    app.setBar('微工坊')
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
