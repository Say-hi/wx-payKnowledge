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
  getDurationTime (e) {
    if (!this.data.duration) {
      this.setData({
        duration: e.detail.duration
      })
    }
  },
  videoOperation (e) {
    let that = this
    if (e.currentTarget.dataset.type === 'add') {
      wx.chooseVideo({
        success (resOut) {
          wx.showLoading({
            title: '视频上传中...'
          })
          app.wxUpload({
            url: app.getUrl().upload,
            filePath: resOut.tempFilePath,
            formData: {
              key: app.gs(),
              file: 'file'
            },
            success (res) {
              wx.hideLoading()
              let upData = JSON.parse(res.data)
              if (upData.code === 1) {
                that.setData({
                  videoSrc: {
                    url: resOut.tempFilePath,
                    id: upData.data.id
                  }
                })
              } else {
                app.setToast(that, {content: upData.msg})
              }
            }
          })
        }
      })
    } else if (e.currentTarget.dataset.type === 'del') {
      that.setData({
        videoSrc: {
          url: '',
          id: 0
        }
      })
    }
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
          if (res.data.data.user.is_video <= 0) {
            app.setToast(that, {content: '您的等级不可发布视频'}, 2000)
            setTimeout(() => {
              wx.navigateBack()
            }, 1500)
          }
        } else {
          app.setToast(that, {content: res.data.msg})
        }
      }
    })
  },
  imageOperation (e) {
    let that = this
    if (e.currentTarget.dataset.type === 'add') {
      app.wxUploadImg((res, v) => {
        that.setData({
          imageSrc: {url: v, id: res.id}
        })
      })
    } else if (e.currentTarget.dataset.type === 'del') {
      that.setData({
        imageSrc: {url: '', id: 0}
      })
    }
  },
  formSubmit (e) {
    if (!this.data.videoSrc.id) return app.setToast(this, {content: '请上传本地视频'})
    else if (!this.data.imageSrc.id) return app.setToast(this, {content: '请上传视频封面图'})
    else if (!e.detail.value.desc) return app.setToast(this, {content: '请输入描述信息'})
    let that = this
    app.wxrequest({
      url: app.getUrl().operationvideo,
      data: {
        key: app.gs(),
        title: e.detail.value.desc,
        picture: that.data.imageSrc.id,
        video: that.data.videoSrc.id,
        duration: Math.floor(that.data.duration)
      },
      success (res) {
        wx.hideLoading()
        if (res.data.code === 1) {
          wx.showToast({
            title: '发布待审核',
            mask: true
          })
          setTimeout(() => {
            wx.navigateBack()
          }, 1200)
        } else {
          app.setToast(that, {content: res.data.msg})
        }
      }
    })
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
