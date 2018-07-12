// 获取全局应用程序实例对象
const app = getApp()

// 创建页面实例对象
Page({
  /**
   * 页面的初始数据
   */
  data: {
    playImg: 'https://c.jiangwenqiang.com/workProject/payKnowledge/play_btn.png',
    showCenterPlayBtn: false,
    showFullscreenBtn: false,
    testImg: app.data.testImg,
    imgDomain: app.data.imgDomain
  },
  goDetail (e) {
    wx.navigateTo({
      url: `../videoDetail/videoDetail?id=${e.currentTarget.dataset.id}`
    })
  },
  play (e) {
    this.setData({
      play: !this.data.play
    })
  },
  giveTip (e) {
    this.setData({
      componentsData: {
        name: '123' + e.currentTarget.dataset.index,
        id: e.currentTarget.dataset.index + 1,
        url: app.data.testImg,
        index: e.currentTarget.dataset.index
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad () {
    app.setBar('视频课程')
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
