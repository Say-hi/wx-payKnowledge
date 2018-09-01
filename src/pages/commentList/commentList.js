// 获取全局应用程序实例对象
const app = getApp()

// 创建页面实例对象
Page({
  /**
   * 页面的初始数据
   */
  data: {
    page: 0,
    commentArr: [],
    testImg: app.data.testImg,
    imgDomain: app.data.imgDomain
  },
  inputValue (e) {
    app.inputValue(e, this)
  },
  upComment () {
    let that = this
    app.upComment(this, this.data.options.id, 'article', () => {
      that.setData({
        page: 0,
        commentArr: []
      }, that.getData)
    })
  },
  getData () {
    let that = this
    app.wxrequest({
      url: app.getUrl().comment,
      data: {
        key: app.gs(),
        type: 0,
        obj_id: that.data.options.id,
        page: ++that.data.page
      },
      success (res) {
        wx.hideLoading()
        if (res.data.code === 1) {
          for (let v of res.data.data.data) {
            v.create_time = app.momentFormat(v.create_time, 'MM-DD')
          }
          that.setData({
            commentArr: that.data.commentArr.concat(res.data.data.data),
            more: res.data.data.data.length < res.data.data.per_page ? 1 : 0
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
    app.setBar('评论')
    app.getSelf(this)
    this.setData({
      options
    }, this.getData)
    // TODO: onLoad
  },
  onReachBottom () {
    if (this.data.more) return app.setToast(this, {content: '别扯了，没有啦~~'})
    else this.getData()
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
    this.setData({
      page: 0,
      commentArr: []
    }, this.getData)
    // TODO: onPullDownRefresh
  }
})
