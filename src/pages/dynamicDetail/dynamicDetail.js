// 获取全局应用程序实例对象
const app = getApp()

// 创建页面实例对象
Page({
  /**
   * 页面的初始数据
   */
  data: {
    page: 0,
    imgDomain: app.data.imgDomain,
    commentArr: [],
    autoFocus: true,
    testImg: app.data.testImg
  },
  zan (e) {
    app.dianzan(e, 'commentArr', this)
  },
  answerOperation (e) {
    let that = this
    if (e.currentTarget.dataset.type === 'cancel') {
      this.setData({
        showAnswer: !that.data.showAnswer
      })
    } else {
      app.upComment(this, this.data.info.id, 'qun', () => {
        that.setData({
          page: 0,
          showAnswer: !that.data.showAnswer,
          commentArr: []
        }, that.getComment)
      })
    }
  },
  showImg (e) {
    app.showImg(e)
  },
  // upComment () {
  //
  // },
  inputValue (e) {
    app.inputValue(e, this)
  },
  giveTip (e) {
    app.setComponentsData(this, e)
    // this.setData({
    //   componentsData: {
    //     name: '123' + e.currentTarget.dataset.index,
    //     id: e.currentTarget.dataset.index + 1,
    //     url: app.data.testImg,
    //     index: e.currentTarget.dataset.index
    //   }
    // })
  },
  getComment () {
    let that = this
    app.wxrequest({
      url: app.getUrl().comment,
      data: {
        key: app.gs(),
        type: 2,
        obj_id: that.data.info.id,
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
            commentArr: that.data.commentArr.concat(res.data.data.data),
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
    else this.getComment()
  },
  ds (e) {
    let {index, integral} = e.detail
    this.data.commentArr[index].integral += (integral * 1)
    this.setData({
      commentArr: this.data.commentArr
    })
  },
  goComment (e) {
    app.goComment(e, 'commentArr', this)
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad () {
    app.setBar('动态详情')
    app.getSelf(this)
    this.setData({
      info: app.gs('answerObj')
    }, this.getComment)
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
