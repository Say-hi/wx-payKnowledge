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
  getVipD () {
    let that = this
    app.wxrequest({
      url: app.getUrl().help,
      data: {
        id: 1
      },
      success (res) {
        wx.hideLoading()
        if (res.data.code === 1) {
          app.WP('content', 'html', res.data.data.content, that, 0)
          that.setData({
            vipDesc: res.data.data
          })
        } else {
          app.setToast(that, {content: res.data.msg})
        }
      }
    })
  },
  showDescC () {
    this.setData({
      showMask: !this.data.showMask
    })
  },
  getUserVip () {
    let that = this
    app.wxrequest({
      url: app.getUrl().usergroup,
      data: {
        key: app.gs()
      },
      success (res) {
        wx.hideLoading()
        if (res.data.code === 1) {
          that.setData({
            info: res.data.data
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
    app.setBar('会员中心')
    app.getSelf(this)
    this.getVipD()
    this.getUserVip()
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
