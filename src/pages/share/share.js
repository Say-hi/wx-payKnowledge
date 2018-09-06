// 获取全局应用程序实例对象
const app = getApp()

// 创建页面实例对象
Page({
  /**
   * 页面的初始数据
   */
  data: {
    title: 'share',
    codeImg: 'https://c.jiangwenqiang.com/api/qrcode.jpg'
  },
  getDesc () {
    let that = this
    app.wxrequest({
      url: app.getUrl().help,
      data: {
        id: 18,
        key: app.gs()
      },
      success (res) {
        wx.hideLoading()
        if (res.data.code === 1) {
          that.setData({
            ss: res.data.data
          })
          app.WP('title', 'html', res.data.data.content, that, 0)
        } else {
          app.setToast(that, {content: res.data.msg})
        }
      }
    })
  },
  savePhoto () {
    let that = this
    wx.downloadFile({
      url: this.data.codeImg,
      success (res) {
        wx.saveImageToPhotosAlbum({
          filePath: res.tempFilePath,
          success () {
            app.setToast(that, {content: '图片保存成功'})
          }
        })
      }
    })
  },
  getData () {
    let that = this
    app.wxrequest({
      url: app.getUrl().getQRCode,
      data: {
        key: app.gs()
      },
      success (res) {
        wx.hideLoading()
        if (res.data.code === 1) {
          that.setData({
            codeImg: res.data.data
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
    app.setBar('分享赢积分')
    app.getSelf(this)
    this.getDesc()
    this.getData()
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
