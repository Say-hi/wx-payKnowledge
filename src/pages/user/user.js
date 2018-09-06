// 获取全局应用程序实例对象
const app = getApp()

// 创建页面实例对象
Page({
  /**
   * 页面的初始数据
   */
  data: {
    imgDomain: app.data.imgDomain,
    testImg: app.data.testImg,
    tabArr2: [],
    userOrderArr: [
      {
        picture: 'https://c.jiangwenqiang.com/workProject/payKnowledge/user_order1.png',
        title: '待付款',
        url: '../order/order?type=1'
      },
      {
        picture: 'https://c.jiangwenqiang.com/workProject/payKnowledge/user_order2.png',
        title: '待发货',
        url: '../order/order?type=2'
      },
      {
        picture: 'https://c.jiangwenqiang.com/workProject/payKnowledge/user_order3.png',
        title: '待收货',
        url: '../order/order?type=3'
      },
      {
        picture: 'https://c.jiangwenqiang.com/workProject/payKnowledge/user_order4.png',
        title: '待评价',
        url: '../order/order?type=4'
      }
    ],
    userServiceArr: [
      {
        picture: 'https://c.jiangwenqiang.com/workProject/payKnowledge/user-service1.png',
        title: '我的订阅',
        url: '../userSubscription/userSubscription'
      },
      {
        picture: 'https://c.jiangwenqiang.com/workProject/payKnowledge/user-service2.png',
        title: '预约生产',
        url: '../userCoProduction/userCoProduction'
      },
      {
        picture: 'https://c.jiangwenqiang.com/workProject/payKnowledge/user-service3.png',
        title: '优惠卷',
        url: '../coupon/coupon?type=我的优惠卷'
      },
      {
        picture: 'https://c.jiangwenqiang.com/workProject/payKnowledge/user-service4.png',
        title: '我的活动',
        url: '../activityList/activityList?type=我的活动'
      }
    ],
    userOperationArr: [
      {
        t: '会员中心',
        url: '../vipCenter/vipCenter'
      },
      {
        t: '我的账户',
        url: '../userAccount/userAccount'
      },
      {
        t: '脑籽排行',
        url: '../ranking/ranking'
      },
      {
        t: '我的消息',
        url: '../userMessage/userMessage'
      }
    ],
    userOtherServiceArr: [
      {
        t: '购物车',
        url: '../car/car',
        type: 'url'
      },
      {
        t: '我的地址',
        type: 'button',
        open_type: 'address'
      },
      {
        t: '联系客服',
        type: 'button',
        open_type: 'contact'
      },
      {
        t: '分享赢积分',
        url: '../share/share',
        type: 'url'
      }
    ]
  },
// 选择地址
  chooseAddress () {
    let that = this
    wx.chooseAddress({
      success (res) {
        if (res.telNumber) { // 获取信息成功
          wx.setStorageSync('addressInfo', res)
          that.setData({
            needSetting: false,
            addressInfo: res
          })
        }
      },
      fail () {
        wx.getSetting({
          success (res) {
            if (!res.authSetting['scope.address']) {
              that.setData({
                needSetting: true
              })
              app.setToast(that, {content: '需授权获取地址信息'})
            }
          }
        })
      }
    })
  },

  openSetting () {
    let that = this
    wx.getSetting({
      success (res) {
        if (!res.authSetting['scope.address']) {
          that.setData({
            needSetting: true
          })
          app.setToast(that, {content: '需授权获取地址信息'})
        } else {
          that.setData({
            needSetting: false
          })
        }
      }
    })
  },
  getUserInfo () {
    let that = this
    app.wxrequest({
      url: app.getUrl().userindex,
      data: {
        key: app.gs()
      },
      success (res) {
        wx.hideLoading()
        if (res.data.code === 1) {
          app.su('userInfoC', res.data.data.user)
          for (let v of res.data.data.nav[0]) {
            v.picture = that.data.imgDomain + v.picture
          }
          for (let v of res.data.data.nav[1]) {
            v.picture = that.data.imgDomain + v.picture
          }
          that.setData({
            info: res.data.data,
            userOrderArr: res.data.data.nav[0],
            userServiceArr: res.data.data.nav[1]
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
  onLoad () {
    app.setBar('我的')
    app.getSelf(this)
    this.setData({
      tabArr2: app.setNav()
    }, this.getUserInfo)
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
    this.getUserInfo()
    // TODO: onPullDownRefresh
  }
})
