// 获取全局应用程序实例对象
const app = getApp()

// 创建页面实例对象
Page({
  /**
   * 页面的初始数据
   */
  data: {
    imgDomain: app.data.imgDomain,
    testImg: app.data.testImg
  },
  onShareAppMessage () {
    let that = this
    return {
      title: '脑籽精品文章分享',
      path: `/pages/articleDetail/articleDetail?id=${that.data.options.id}`
    }
  },
  showImg (e) {
    app.showImg(e)
  },
  getData () {
    let that = this
    app.wxrequest({
      url: app.getUrl().article,
      data: {
        key: app.gs(),
        id: that.data.options.id
      },
      success (res) {
        wx.hideLoading()
        if (res.data.code === 1) {
          app.WP('content', 'html', res.data.data.content, that, 0)
          res.data.data.create_time = app.moment(res.data.data.create_time)
          that.setData({
            info: res.data.data
          })
        } else {
          app.setToast(that, {content: res.data.msg})
        }
      }
    })
  },
  giveTip (e) {
    app.setComponentsData(this, e)
    // this.setData({
    //   componentsData: {
    //     name: '123' + e.currentTarget.dataset.index,
    //     id: e.currentTarget.dataset.index + 1,
    //     url: app.data.testImg,
    //     index: e.currentTarget.dataset.index
    //   }
    // })
  },
  ds (e) {
    let {integral} = e.detail
    this.data.info.integral += (integral * 1)
    this.setData({
      info: this.data.info
    })
  },
  zan (e) {
    app.dianzan(e, 'info', this)
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad (options) {
    console.log(options)
    app.setBar('文章详情')
    app.getSelf(this)
    this.setData({
      options
    }, this.getData)
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
