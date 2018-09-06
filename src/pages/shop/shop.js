// 获取全局应用程序实例对象
const app = getApp()

// 创建页面实例对象
Page({
  /**
   * 页面的初始数据
   */
  data: {
    page: 0,
    imgDomain: app.data.imgDomain,
    testImg: app.data.testImg,
    redbag: '',
    indicatorColor: 'rgba(0, 0, 0, 0.4)',
    indicatorActiveColor: '#ffffff',
    tabArr: [
      {
        i: 'https://c.jiangwenqiang.com/workProject/payKnowledge/shop1.png',
        t: '整点秒杀',
        url: '../killList/killList'
      },
      {
        i: 'https://c.jiangwenqiang.com/workProject/payKnowledge/shop2.png',
        t: '微工坊',
        // url: '../activityList/activityList?type=coProduction'
        url: '../activityList/activityList?type=微工坊列表'
      },
      {
        i: 'https://c.jiangwenqiang.com/workProject/payKnowledge/shop3.png',
        t: '商品分类',
        url: '../categories/categories'
      },
      {
        i: 'https://c.jiangwenqiang.com/workProject/payKnowledge/shop4.png',
        t: '优惠卷',
        url: '../coupon/coupon'
      },
      {
        i: 'https://c.jiangwenqiang.com/workProject/payKnowledge/shop5.png',
        t: '红包',
        url: '',
        fn: 'redbagChange'
      }
    ],
    tabArr2: [],
    goodsList: []
  },
  getGoods () {
    let that = this
    app.wxrequest({
      url: app.getUrl().goods,
      data: {
        page: ++that.data.page,
        recommend: 1
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
  redpack () {
    let that = this
    app.wxrequest({
      url: app.getUrl().redpack,
      data: {
        key: app.gs()
      },
      success (res) {
        wx.hideLoading()
        if (res.data.code === 1) {

        } else {
          app.setToast(that, {content: res.data.msg})
        }
      }
    })
  },
  redbagChange () {
    if (!this.data.info.redpack.id) return app.setToast(this, {content: '暂无红包可领'})
    this.setData({
      redBag: !this.data.redBag,
      redbag: this.data.imgDomain + this.data.info.redpack.picture,
      showOpen: false
    })
  },
  openBag () {
    this.setData({
      showOpen: true
    })
    setTimeout(() => {
      this.setData({
        redbag: this.data.imgDomain + this.data.info.redpack.picture_open
      }, this.redpack)
    }, 1100)
  },
  shopIndex () {
    let that = this
    app.wxrequest({
      url: app.getUrl().shopIndex,
      data: {},
      success (res) {
        wx.hideLoading()
        if (res.data.code === 1) {
          that.setData({
            info: res.data.data,
            redbag: that.data.imgDomain + res.data.data.redpack.picture
          }, that.getGoods)
        } else {
          app.setToast(that, {content: res.data.msg})
        }
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad () {
    app.setBar('商城')
    app.getSelf(this)
    this.shopIndex()
    this.setData({
      tabArr2: app.setNav()
    })
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
      goodsList: []
    }, this.shopIndex)
    // TODO: onPullDownRefresh
  }
})
