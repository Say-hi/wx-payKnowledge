// 获取全局应用程序实例对象
const app = getApp()
const orderArr = ['sort', 'sales', 'price']
// 创建页面实例对象
Page({
  /**
   * 页面的初始数据
   */
  data: {
    imgDomain: app.data.imgDomain,
    currentTab: 0,
    testImg: app.data.testImg
  },
  tabChoose (e) {
    this.setData({
      angler: e.currentTarget.dataset.index * 1 === this.data.currentTab * 1 ? !this.data.angler : 0,
      currentTab: e.currentTarget.dataset.index
    }, this.getGoods)
  },
  getGoods () {
    let that = this
    app.wxrequest({
      url: app.getUrl().goods,
      data: {
        category_id: that.data.id,
        order: orderArr[that.data.currentTab],
        by: !that.data.angler ? 'asc' : 'desc'
      },
      success (res) {
        wx.hideLoading()
        if (res.data.code === 1) {
          that.setData({
            goodsList: that.data.goodsList.concat(res.data.data.data),
            more: res.data.data.data.length < res.data.data.per_page ? 1 : 0
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
    app.setBar('商品列表')
    app.getSelf(this)
    this.setData({
      id: options.id,
      pid: options.pid
    }, this.getGoods)
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
