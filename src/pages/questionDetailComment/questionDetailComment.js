// 获取全局应用程序实例对象
const app = getApp()

// 创建页面实例对象
Page({
  /**
   * 页面的初始数据
   */
  data: {
    page: 0,
    communityArr: [],
    title: 'questionDetailComment'
  },
  inputValue (e) {
    app.inputValue(e, this)
  },
  answerOperation (e) {
    let that = this
    if (e.currentTarget.dataset.type === 'cancel') {
      this.setData({
        showAnswer: !that.data.showAnswer
      })
    } else {
      if (!that.data.pwd) return app.setToast(that, {content: '请输入您的回复'})
      app.wxrequest({
        url: app.getUrl().operationComment,
        data: {
          key: app.gs(),
          type: 3,
          obj_id: that.data.answerObj.id,
          content: that.data.pwd
        },
        success (res) {
          wx.hideLoading()
          if (res.data.code === 1) {
            that.setData({
              page: 0,
              showAnswer: !that.data.showAnswer,
              communityArr: []
            }, that.getData)
          } else {
            app.setToast(that, {content: res.data.msg})
          }
        }
      })
    }
  },
  getData () {
    let that = this
    app.wxrequest({
      url: app.getUrl().comment,
      data: {
        key: app.gs(),
        type: 3,
        obj_id: that.data.options.id,
        page: ++that.data.page
      },
      success (res) {
        wx.hideLoading()
        if (res.data.code === 1) {
          for (let v of res.data.data.data) {
            v.create_time = app.moment(v.create_time)
          }
          that.setData({
            total: res.data.data.total,
            communityArr: that.data.communityArr.concat(res.data.data.data),
            more: res.data.data.data.length < res.data.data.per_page ? 1 : 0
          })
        } else {
          app.setToast(that, {content: res.data.msg})
        }
      }
    })
  },
  onReachBottom () {
    if (this.data.more) return app.setToast(this, {content: '别扯了，没有啦~~'})
    else this.getData()
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad (options) {
    app.getSelf(this)
    this.setData({
      options,
      answerObj: app.gs('answerObj')
    }, this.getData)
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
