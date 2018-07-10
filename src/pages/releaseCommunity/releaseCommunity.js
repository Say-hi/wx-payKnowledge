// 获取全局应用程序实例对象
const app = getApp()

// 创建页面实例对象
Page({
  /**
   * 页面的初始数据
   */
  data: {
    imgDomain: app.data.imgDomain,
    upImgArr: [
      app.data.testImg, app.data.testImg, app.data.testImg, app.data.testImg
    ]
  },
  formSubmit (e) {
    if (!e.detail.value.name) return app.setToast(this, {content: '请输入标题'})
    if (!e.detail.value.content || e.detail.value.content.length < 10) return app.setToast(this, {content: '请输入不少于10字的内容'})
    if (!this.data.upImgArr.length) return app.setToast(this, {content: '请至少上传一张图片'})
  },
  addImg () {},
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
    app.setBar('社群中心')
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
