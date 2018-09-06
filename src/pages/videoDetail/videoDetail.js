// 获取全局应用程序实例对象
const app = getApp()

// 创建页面实例对象
Page({
  /**
   * 页面的初始数据
   */
  data: {
    testImg: app.data.testImg,
    page: 0,
    commentArr: [],
    imgDomain: app.data.imgDomain
  },
  play (e) {
    this.setData({
      play: !this.data.play
    })
  },
  getUserInfo () {
    let that = this
    app.wxrequest({
      url: app.getUrl().info,
      data: {
        key: app.gs(),
        user_id: that.data.info.user_id
      },
      success (res) {
        wx.hideLoading()
        if (res.data.code === 1) {
          that.setData({
            userInfo: res.data.data
          })
        } else {
          app.setToast(that, {content: res.data.msg})
        }
      }
    })
  },
  // random (array) {
  //   if (typeof array !== 'object' || array.length <= 0) return console.log('传入有效数组')
  //   return array.sort(() => {
  //     return .5 - Math.random()
  //   })
  // },
  giveTip (e) {
    // this.setData({
    //   componentsData: {
    //     user_id: e.currentTarget.dataset.userid,
    //     obj_id: e.currentTarget.dataset.id,
    //     type: e.currentTarget.dataset.type,
    //     index: e.currentTarget.dataset.index
    //   }
    // })
    app.setComponentsData(this, e)
  },
  getDetail (id) {
    let that = this
    app.wxrequest({
      url: app.getUrl().video,
      data: {
        key: app.gs(),
        video_id: id
      },
      success (res) {
        wx.hideLoading()
        if (res.data.code === 1) {
          let m = (res.data.data.duration / 60).toFixed(0)
          let s = res.data.data.duration % 60
          res.data.data.duration = m + '`' + s + '``'
          that.setData({
            info: res.data.data
          }, that.getComment)
        } else {
          app.setToast(that, {content: res.data.msg})
        }
      }
    })
  },
  getComment () {
    let that = this
    app.wxrequest({
      url: app.getUrl().comment,
      data: {
        key: app.gs(),
        type: 1,
        obj_id: that.data.info.id,
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
          }, that.getUserInfo)
        } else {
          app.setToast(that, {content: res.data.msg})
        }
      }
    })
  },
  onReachBottom () {
    if (this.data.more) return app.setToast(this, {content: '别扯了，没有啦~~'})
    else this.getComment()
  },
  ds (e) {
    let {integral} = e.detail
    this.data.info.integral += (integral * 1)
    this.setData({
      info: this.data.info
    })
  },
  zan (e) {
    app.dianzan(e, 'info', this)
  },
  zan2 (e) {
    app.dianzan(e, 'commentArr', this)
  },
  inputValue (e) {
    app.inputValue(e, this)
  },
  upComment () {
    let that = this
    app.upComment(this, this.data.info.id, 'video', () => {
      that.data.info.comment += 1
      that.setData({
        page: 0,
        info: that.data.info,
        commentArr: []
      }, that.getComment)
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad (options) {
    app.setBar('视频课程')
    app.getSelf(this)
    this.getDetail(options.id)
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
    }, this.getComment)
    // TODO: onPullDownRefresh
  }
})
