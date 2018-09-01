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
    videoList: [],
    playImg: 'https://c.jiangwenqiang.com/workProject/payKnowledge/play_btn.png',
    showCenterPlayBtn: false,
    showFullscreenBtn: false,
    testImg: app.data.testImg
  },
  goDetail (e) {
    wx.navigateTo({
      url: `../videoDetail/videoDetail?id=${e.currentTarget.dataset.id}`
    })
  },
  play (e) {
    this.setData({
      play: !this.data.play
    })
  },
  giveTip (e) {
    app.setComponentsData(this, e)
    // this.setData({
    //   componentsData: {
    //     user_id: e.currentTarget.dataset.userid,
    //     obj_id: e.currentTarget.dataset.id,
    //     type: e.currentTarget.dataset.type,
    //     index: e.currentTarget.dataset.index
    //   }
    // })
  },
  ds (e) {
    let {index, integral} = e.detail
    this.data.videoList[index].integral += (integral * 1)
    this.setData({
      videoList: this.data.videoList
    })
  },
  getVideoList () {
    let that = this
    app.wxrequest({
      url: app.getUrl().videos,
      data: {
        key: app.gs(),
        page: ++that.data.page
      },
      success (res) {
        wx.hideLoading()
        if (res.data.code === 1) {
          for (let v of res.data.data.data) {
            if (!v.duration) {
              v.duration = '未知时长'
              continue
            }
            let m = (v.duration / 60).toFixed(0)
            let s = v.duration % 60
            v.duration = m + '`' + s + '``'
          }
          that.setData({
            videoList: that.data.videoList.concat(res.data.data.data),
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
    else this.getVideoList()
  },
  zan (e) {
    app.dianzan(e, 'videoList', this)
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad () {
    app.setBar('视频课程')
    app.getSelf(this)
    this.getVideoList()
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
    this.setData({
      page: 0,
      videoList: []
    }, this.getVideoList)
    // TODO: onPullDownRefresh
  }
})
