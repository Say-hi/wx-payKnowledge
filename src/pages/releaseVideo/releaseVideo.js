// 获取全局应用程序实例对象
const app = getApp()

// 创建页面实例对象
Page({
  /**
   * 页面的初始数据
   */
  data: {
    imgDomain: app.data.imgDomain
  },
  videoOperation (e) {
    let that = this
    if (e.currentTarget.dataset.type === 'add') {
      wx.chooseVideo({
        success (res) {
          that.setData({
            videoSrc: res.tempFilePath
          })
        }
      })
    } else if (e.currentTarget.dataset.type === 'del') {
      that.setData({
        videoSrc: false
      })
    }
  },
  formSubmit (e) {
    if (!this.data.videoSrc) return app.setToast(this, {content: '请上传本地视频'})
    if (!e.detail.value.desc) return app.setToast(this, {content: '请输入描述信息'})
    let that = this
    that.setData({
      success: true
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad () {
    app.setBar('发布视频')
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
