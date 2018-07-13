// 获取全局应用程序实例对象
const app = getApp()

// 创建页面实例对象
Page({
  /**
   * 页面的初始数据
   */
  data: {
    orderList: [],
    currentIndex: 0,
    typeArr: ['', 'WAITPAY', 'WAITSEND', 'WAITRECEIVE', 'FINISH'],
    page: 0
  },
  chooseTab (e) {
    this.setData({
      currentIndex: e.currentTarget.dataset.index,
      orderList: [],
      page: 0
    })
    if (this.data.type !== '5') this.getOrderList(this.data.typeArr[e.currentTarget.dataset.index])
    else this.getreturnGoodsList()
  },
  delOrder (e) {
    wx.showToast({
      title: '模拟删除'
    })
  },
  getOrderList (type = '') {
    let that = this
    app.wxrequest({
      url: app.getUrl().orderList,
      data: {
        type,
        P: ++this.data.page
      },
      success (res) {
        wx.hideLoading()
        wx.stopPullDownRefresh()
        // console.log(res)
        if (res.data.status === 200) {
          that.setData({
            orderList: that.data.orderList.concat(res.data.data.list),
            more: res.data.data.list.length < 10 ? 0 : 1
          })
        } else {
          app.setToast(that, {content: res.data.msg})
        }
      }
    })
  },
  getreturnGoodsList () {
    let that = this
    app.wxrequest({
      url: app.getUrl().refundOrderList,
      data: {
        refund_status: that.data.currentIndex,
        p: ++this.data.page
      },
      success (res) {
        wx.hideLoading()
        wx.stopPullDownRefresh()
        if (res.data.status === 200) {
          that.setData({
            orderList: that.data.orderList.concat(res.data.data.list),
            more: res.data.data.list.length < 10 ? 0 : 1
          })
        } else {
          app.setToast(that, {content: res.data.msg})
        }
      }
    })
  },
  // 提醒发货
  orderMsg (e) {
    let that = this
    app.wxrequest({
      url: app.getUrl().orderMsg,
      data: {
        order_id: e.currentTarget.dataset.id,
        pickup_id: e.currentTarget.dataset.pid
      },
      success (res) {
        wx.hideLoading()
        if (res.data.status === 200) {
          app.setToast(that, {content: '已提醒商家发货'})
        } else {
          app.setToast(that, {content: res.data.msg})
        }
      }
    })
  },
  cancel (e) {
    let that = this
    wx.showModal({
      title: '是否取消',
      content: '小主三思哦',
      success (Mres) {
        if (Mres.confirm) {
          app.wxrequest({
            url: app.getUrl().cancelOrder,
            data: {
              order_id: e.currentTarget.dataset.id
            },
            success (res) {
              wx.hideLoading()
              if (res.data.status * 1 === 1) {
                wx.showToast({
                  title: '取消成功',
                  mask: true
                })
                setTimeout(() => {
                  that.setData({
                    orderList: [],
                    page: 1
                  })
                  if (that.data.type !== '5') that.getOrderList(that.data.typeArr[that.data.currentIndex])
                  else that.getreturnGoodsList()
                }, 1400)
              } else {
                app.setToast(that, {content: res.data.msg})
              }
            }
          })
        }
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad (options) {
    this.setData({
      type: options.type
    })
    if (options.type !== '5') {
      this.setData({
        currentIndex: options.type
      })
      this.getOrderList(this.data.typeArr[options.type])
    } else {
      app.setBar('退货退款')
      this.getreturnGoodsList()
    }
    // TODO: onLoad
  },
  onReachBottom () {
    if (!this.data.more) return app.setToast(this, {content: '没有更多信息了'})
    if (this.data.type !== '5') this.getOrderList(this.data.typeArr[this.data.currentIndex])
    else this.getreturnGoodsList()
  },
  onPullDownRefresh () {
    this.setData({
      page: 0,
      orderList: []
    })
    if (this.data.type !== '5') this.getOrderList(this.data.typeArr[this.data.currentIndex])
    else this.getreturnGoodsList()
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
  }
})
