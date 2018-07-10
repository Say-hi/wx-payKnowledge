// 获取全局应用程序实例对象
const app = getApp()

// 创建页面实例对象
Page({
  /**
   * 页面的初始数据
   */
  data: {
    testImg: app.data.testImg,
    active: 0,
    tabArr: [
      {
        img: app.data.testImg,
        name: '社群'
      },
      {
        img: app.data.testImg,
        name: '问答专区'
      }
    ]
  },
  goDetail (e) {
    wx.navigateTo({
      url: e.currentTarget.dataset.url
    })
  },
  showImg (e) {
    app.showImg(e)
  },
  changeTab (e) {
    this.setData({
      active: e.currentTarget.dataset.index
    })
  },
  giveTip (e) {
    this.setData({
      componentsData: {
        name: '123' + e.currentTarget.dataset.index,
        id: e.currentTarget.dataset.index + 1,
        url: app.data.testImg,
        index: e.currentTarget.dataset.index
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad (options) {
    if (options) {
      this.setData({
        active: options.active || 0
      })
    }
    app.setBar('社群中心')
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
