// 获取全局应用程序实例对象
const app = getApp()

// 创建页面实例对象
Page({
  /**
   * 页面的初始数据
   */
  data: {
    imgDomain: app.data.imgDomain,
    release_add_img: 'https://c.jiangwenqiang.com/workProject/payKnowledge/release_add_img.png',
    upImgArr: []
  },
  formSubmit (e) {
    if (!e.detail.value.name) return app.setToast(this, {content: '请输入标题'})
    if (!e.detail.value.content || e.detail.value.content.length < 10) return app.setToast(this, {content: '请输入不少于10字的内容'})
    if (!this.data.upImgArr.length) return app.setToast(this, {content: '请至少上传一张图片'})
    let pictures = []
    let that = this
    for (let v of this.data.upImgArr) {
      pictures.push(v.id)
    }
    pictures = pictures.join(',')
    app.wxrequest({
      url: app.getUrl().releaseCommunity,
      data: {
        key: app.gs(),
        title: e.detail.value.name,
        content: e.detail.value.content,
        pictures
      },
      success (res) {
        wx.hideLoading()
        if (res.data.code === 1) {
          wx.showToast({
            title: '发布成功',
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
  },
  addImg () {
    let that = this
    app.wxUploadImg((res, v) => {
      that.data.upImgArr.push({url: v, id: res.id})
      that.setData({
        upImgArr: that.data.upImgArr
      })
    })
  },
  showImg (e) {
    app.showImg(e)
  },
  del (e) {
    this.data.upImgArr.splice(e.currentTarget.dataset.index, 1)
    this.setData({
      upImgArr: this.data.upImgArr
    })
  },
  inputValue (e) {
    app.inputValue(e, this)
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad () {
    app.setBar('发布动态')
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
