// 获取全局应用程序实例对象
const app = getApp()

// 创建页面实例对象
Page({
  /**
   * 页面的初始数据
   */
  data: {
    imgDomain: app.data.imgDomain,
    answerArr: [],
    communityArr: [],
    testImg: app.data.testImg,
    active: 0,
    page: 0,
    tabArr: [
      {
        img: app.data.testImg,
        name: '社群'
      },
      {
        img: app.data.testImg,
        name: '问答专区'
      }
    ]
  },
  goDetail (e) {
    if (e.currentTarget.dataset.type === 'quesiton') app.su('answerObj', this.data.answerArr[e.currentTarget.dataset.index])
    else if (e.currentTarget.dataset.type === 'dynamic') app.su('answerObj', this.data.communityArr[e.currentTarget.dataset.index])
    wx.navigateTo({
      url: e.currentTarget.dataset.url
    })
  },
  showImg (e) {
    app.showImg(e)
  },
  changeTab (e) {
    this.setData({
      active: e.currentTarget.dataset.index
    }, this.tabChange)
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
  getAnswer () {
    let that = this
    app.wxrequest({
      url: app.getUrl().qa,
      data: {
        key: app.gs(),
        page: ++that.data.page
      },
      success (res) {
        wx.hideLoading()
        if (res.data.code === 1) {
          for (let v of res.data.data.data) {
            if (v.answer) {
              v['like'] = v.answer.like || 0
              v['integral'] = v.answer.integral || 0
            }
          }
          that.setData({
            tabArr: res.data.data.nav,
            answerArr: that.data.answerArr.concat(res.data.data.data),
            more: res.data.data.data.length < res.data.data.per_page ? 1 : 0
          })
        } else {
          app.setToast(that, {content: res.data.msg})
        }
      }
    })
  },
  getCommunity () {
    let that = this
    app.wxrequest({
      url: app.getUrl().community,
      data: {
        key: app.gs(),
        page: ++that.data.page
      },
      success (res) {
        wx.hideLoading()
        if (res.data.code === 1) {
          for (let v of res.data.data.data) v.create_time = app.moment(v.create_time)
          that.setData({
            tabArr: res.data.data.nav,
            communityArr: that.data.communityArr.concat(res.data.data.data),
            more: res.data.data.data.length < res.data.data.per_page ? 1 : 0
          })
        } else {
          app.setToast(that, {content: res.data.msg})
        }
      }
    })
  },
  tabChange (bottom) {
    if (bottom) {
      if (!this.data.active) this.getCommunity()
      else this.getAnswer()
      return
    }
    this.setData({
      page: 0,
      answerArr: [],
      communityArr: []
    })
    if (!this.data.active) this.getCommunity()
    else this.getAnswer()
  },
  onReachBottom () {
    if (this.data.more) return app.setToast(this, {content: '别扯了，没有啦~~'})
    else this.tabChange(true)
  },
  ds (e) {
    let {index, integral} = e.detail
    if (this.data.active * 1 === 0) {
      this.data.communityArr[index].integral += (integral * 1)
      this.setData({
        communityArr: this.data.communityArr
      })
    } else {
      this.data.answerArr[index].integral += (integral * 1)
      this.setData({
        answerArr: this.data.answerArr
      })
    }
  },
  zan (e) {
    app.dianzan(e, this.data.active * 1 === 0 ? 'communityArr' : 'answerArr', this)
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad (options) {
    if (options) {
      this.setData({
        active: options.active || 0
      })
    }
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
    this.tabChange()
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
    this.tabChange()
    // TODO: onPullDownRefresh
  }
})
