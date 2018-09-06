// 获取全局应用程序实例对象
const app = getApp()

// 创建页面实例对象
Page({
  /**
   * 页面的初始数据
   */
  data: {
    page: 0,
    answerArr: [],
    imgDomain: app.data.imgDomain,
    currentIndex: 0,
    testImg: app.data.testImg,
    tabArr: [
      '审核中',
      '已通过',
      '未通过'
    ]
  },
  tabChoose (e) {
    this.setData({
      page: 0,
      answerArr: [],
      currentIndex: e.currentTarget.dataset.index
    }, this.getData)
  },
  getData () {
    let that = this
    app.wxrequest({
      url: app.getUrl().userworkshops,
      data: {
        key: app.gs(),
        page: ++that.data.page,
        status: that.data.currentIndex
      },
      success (res) {
        wx.hideLoading()
        if (res.data.code === 1) {
          that.setData({
            answerArr: that.data.answerArr.concat(res.data.data.data),
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
    else this.getAnswer()
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad () {
    app.setBar('预约生产')
    app.getSelf(this)
    this.getData()
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
      answerArr: []
    }, this.getData)
  }
})
