// 获取全局应用程序实例对象
const app = getApp()

// 创建页面实例对象
Page({
  /**
   * 页面的初始数据
   */
  data: {
    testImg: app.data.testImg,
    tabArr2: [
      {
        i: 'https://c.jiangwenqiang.com/workProject/payKnowledge/bottom1.png',
        t: '发现',
        url: '../index/index'
      },
      {
        i: 'https://c.jiangwenqiang.com/workProject/payKnowledge/bottom2.png',
        t: '分类',
        url: '../articleCategories/articleCategories'
      },
      {
        i: 'https://c.jiangwenqiang.com/workProject/payKnowledge/bottom3.png',
        t: '商城',
        url: '../shop/shop'
      },
      {
        i: 'https://c.jiangwenqiang.com/workProject/payKnowledge/bottom4.png',
        t: '我的',
        url: '',
        active: true
      }
    ],
    userOrderArr: [
      {
        i: 'https://c.jiangwenqiang.com/workProject/payKnowledge/user_order1.png',
        t: '代付款',
        url: '../order/order?type=1'
      },
      {
        i: 'https://c.jiangwenqiang.com/workProject/payKnowledge/user_order2.png',
        t: '待发货',
        url: '../order/order?type=2'
      },
      {
        i: 'https://c.jiangwenqiang.com/workProject/payKnowledge/user_order3.png',
        t: '待收货',
        url: '../order/order?type=3'
      },
      {
        i: 'https://c.jiangwenqiang.com/workProject/payKnowledge/user_order4.png',
        t: '待评价',
        url: '../order/order?type=4'
      }
    ],
    userServiceArr: [
      {
        i: 'https://c.jiangwenqiang.com/workProject/payKnowledge/user-service1.png',
        t: '我的订阅',
        url: '../userSubscription/userSubscription'
      },
      {
        i: 'https://c.jiangwenqiang.com/workProject/payKnowledge/user-service2.png',
        t: '预约生产',
        url: '../userCoProduction/userCoProduction'
      },
      {
        i: 'https://c.jiangwenqiang.com/workProject/payKnowledge/user-service3.png',
        t: '优惠卷',
        url: '../coupon/coupon?type=我的优惠卷'
      },
      {
        i: 'https://c.jiangwenqiang.com/workProject/payKnowledge/user-service4.png',
        t: '我的活动',
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
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad () {
    app.setBar('我的')
    app.getSelf(this)
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
    // TODO: onPullDownRefresh
  }
})
