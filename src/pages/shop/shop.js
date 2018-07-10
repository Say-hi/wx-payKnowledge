// 获取全局应用程序实例对象
const app = getApp()

// 创建页面实例对象
Page({
  /**
   * 页面的初始数据
   */
  data: {
    testImg: app.data.testImg,
    redbag: 'https://c.jiangwenqiang.com/workProject/payKnowledge/redbag_close.png',
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
        url: '../activityList/activityList?type=coProduction'
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
        url: '../shop/shop',
        active: true
      },
      {
        i: 'https://c.jiangwenqiang.com/workProject/payKnowledge/bottom4.png',
        t: '我的',
        url: '../user/user'
      }
    ]
  },
  redbagChange () {
    this.setData({
      redBag: !this.data.redBag,
      redbag: 'https://c.jiangwenqiang.com/workProject/payKnowledge/redbag_close.png',
      showOpen: false
    })
  },
  openBag () {
    this.setData({
      showOpen: true
    })
    setTimeout(() => {
      this.setData({
        redbag: 'https://c.jiangwenqiang.com/workProject/payKnowledge/redbag_open.png'
      })
    }, 1100)
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad () {
    app.setBar('商城')
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
