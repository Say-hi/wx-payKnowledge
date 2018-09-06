// 获取全局应用程序实例对象
const app = getApp()

// 创建页面实例对象
Page({
  /**
   * 页面的初始数据
   */
  data: {
    imgDomain: app.data.imgDomain,
    shopImg: 'https://c.jiangwenqiang.com/workProject/payKnowledge/gd1.png',
    title: 'orderStatus'
  },
  call () {
    app.call(this.data.order.shop_phone)
  },
  getSecond () {
    let that = this
    app.wxrequest({
      url: app.getUrl().orderorder,
      data: {
        key: app.gs(),
        order_id: that.data.options.id
      },
      success (res) {
        wx.hideLoading()
        if (res.data.code === 1) {
          that.setData({
            addressInfo: {
              userName: res.data.data.name,
              telNumber: res.data.data.phone,
              provinceName: res.data.data.province,
              cityName: res.data.data.city,
              detailInfo: res.data.data.address,
              countyName: res.data.data.area
            },
            menuArr: res.data.data.goods,
            order: res.data.data
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
    app.setBar('订单信息')
    app.getSelf(this)
    this.setData({
      options,
      type: options.status
    }, this.getSecond)
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
