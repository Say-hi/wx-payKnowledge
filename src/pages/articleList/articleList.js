// 获取全局应用程序实例对象
const app = getApp()

// 创建页面实例对象
Page({
  /**
   * 页面的初始数据
   */
  data: {
    basedomain: app.data.basedomain,
    imgDomain: app.data.imgDomain,
    page: 0,
    listArr: [],
    testImg: app.data.testImg
  },
  zan (e) {
    app.dianzan(e, 'listArr', this)
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
  ds (e) {
    let {index, integral} = e.detail
    this.data.listArr[index].integral += (integral * 1)
    this.setData({
      listArr: this.data.listArr
    })
  },
  getData () {
    let that = this
    app.wxrequest({
      url: app.getUrl().articles,
      data: {
        key: app.gs(),
        page: ++that.data.page,
        keyword: that.data.options.content
      },
      success (res) {
        wx.hideLoading()
        if (res.data.code === 1) {
          that.setData({
            listArr: that.data.listArr.concat(res.data.data.data),
            more: res.data.data.data.length < res.data.data.per_page ? 1 : 0
          })
        } else {
          app.setToast(that, {content: '未搜索到相关内容'})
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
    app.setBar('文章列表')
    app.getSelf(this)
    this.setData({
      options
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
