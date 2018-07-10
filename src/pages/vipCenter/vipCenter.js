// 获取全局应用程序实例对象
const app = getApp()

// 创建页面实例对象
Page({
  /**
   * 页面的初始数据
   */
  data: {
    title: 'vipCenter',
    testImg: app.data.testImg,
    vipLvArr: [
      {
        l: 'LV1.ASDF',
        r: true
      },
      {
        l: 'LV2.ASDF',
        r: false
      },
      {
        l: 'LV3.ASDasdfasdfF',
        r: false
      },
      {
        l: 'LV4.AasdfSDF',
        r: false,
        apply: true
      }
    ],
    cipCenterImg: 'https://c.jiangwenqiang.com/workProject/payKnowledge/vip_center.png'
  },
  showDescC () {
    this.setData({
      showMask: !this.data.showMask
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad () {
    app.setBar('会员中心')
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
