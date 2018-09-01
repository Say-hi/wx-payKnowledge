// 获取全局应用程序实例对象
const app = getApp()

// 创建页面实例对象
Page({
  /**
   * 页面的初始数据
   */
  data: {
    imgDomain: app.data.imgDomain,
    page: 0,
    rightArr: []
  },
  ds (e) {
    let {index, integral} = e.detail
    this.data.rightArr[index].integral += (integral * 1)
    this.setData({
      rightArr: this.data.rightArr
    })
  },
  giveTip (e) {
    // this.setData({
    //   componentsData: {
    //     name: '123' + e.currentTarget.dataset.index,
    //     id: e.currentTarget.dataset.index + 1,
    //     url: app.data.testImg,
    //     index: e.currentTarget.dataset.index
    //   }
    // })
    app.setComponentsData(this, e)
  },
  getRight () {
    let that = this
    app.wxrequest({
      url: app.getUrl().articles,
      data: {
        key: app.gs(),
        page: ++that.data.page,
        column_id: that.data.options.id
      },
      success (res) {
        wx.hideLoading()
        if (res.data.code === 1) {
          for (let v of res.data.data.data) {
            v.create_time = app.moment(v.create_time)
          }
          that.setData({
            rightArr: that.data.rightArr.concat(res.data.data.data),
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
    else this.getRight()
  },
  zan (e) {
    app.dianzan(e, 'info', this)
  },
  zan2 (e) {
    app.dianzan(e, 'rightArr', this)
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad (options) {
    app.setBar('专栏文章列表')
    app.getSelf(this)
    this.setData({
      options,
      info: app.gs('answerObj')
    }, this.getRight)
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
