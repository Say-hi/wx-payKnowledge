// 获取全局应用程序实例对象
const app = getApp()

// 创建页面实例对象
Page({
  /**
   * 页面的初始数据
   */
  data: {
    testImg: app.data.testImg
  },
  showApply () {
    this.setData({
      apply: !this.data.apply
    })
  },
  formSubmit (e) {
    if (!e.detail.value.name) return app.setToast(this, {content: '请输入您的姓名'})
    else if (!e.detail.value.gender) return app.setToast(this, {content: '请输入您的性别'})
    else if (!e.detail.value.job) return app.setToast(this, {content: '请输入您的工作'})
    else if (app.checkMobile(e.detail.value.phone)) return app.setToast(this, {content: '请输入正确的手机号码'})
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad () {
    app.setBar('活动详情')
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
