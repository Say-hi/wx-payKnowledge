// 获取全局应用程序实例对象
const app = getApp()

// 创建页面实例对象
Page({
  /**
   * 页面的初始数据
   */
  data: {
    title: 'createColunms',
    create_success: 'https://c.jiangwenqiang.com/workProject/payKnowledge/create_success.png'
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
          if (res.data.data.user.is_column <= 0) {
            app.setToast(that, {content: '您的等级不可创建专栏'}, 2000)
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
  formSubmit (e) {
    if (!e.detail.value.name) return app.setToast(this, {content: '请输入专栏名'})
    else if (!e.detail.value.content) return app.setToast(this, {content: '请输入专栏简介'})
    let that = this
    app.wxrequest({
      url: app.getUrl().operationcolumn,
      data: {
        key: app.gs(),
        name: e.detail.value.name,
        info: e.detail.value.content,
        id: that.data.options.id || ''
      },
      success (res) {
        wx.hideLoading()
        if (res.data.code === 1) {
          that.setData({
            createSuccess: true
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
  onLoad (options) {
    this.setData({
      options
    })
    app.setBar(options.type || '创建专栏')
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
