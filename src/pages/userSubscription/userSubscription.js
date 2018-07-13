// 获取全局应用程序实例对象
const app = getApp()

// 创建页面实例对象
Page({
  /**
   * 页面的初始数据
   */
  data: {
    testImg: app.data.testImg,
    currentIndex: 2,
    currentReleaseIndex: 0,
    playImg: 'https://c.jiangwenqiang.com/workProject/payKnowledge/play_btn.png',
    tabArr: [
      '我的订阅',
      '我的发布',
      '我的专栏'
    ],
    tabReleaseArr: [
      '视频',
      '动态',
      '文章',
      '提问'
    ]
  },
  showImg (e) {
    app.showImg(e)
  },
  play (e) {
    this.setData({
      play: !this.data.play
    })
  },
  tabChoose (e) {
    if (e.currentTarget.dataset.type === 'release') {
      this.setData({
        currentReleaseIndex: e.currentTarget.dataset.index
      })
    } else {
      this.setData({
        currentIndex: e.currentTarget.dataset.index
      })
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad () {
    app.setBar('我的订阅')
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
