// 获取全局应用程序实例对象
const app = getApp()
const windowHeight = wx.getSystemInfoSync().windowHeight
// 创建页面实例对象
Page({
  /**
   * 页面的初始数据
   */
  data: {
    basedomain: app.data.basedomain,
    testImg: app.data.testImg,
    show: true,
    height: windowHeight - 55,
    leftArr: [
      {
        label: '分类分类分'
      },
      {
        label: '分类2'
      }
    ],
    left: 0,
    rightArr: []
  },
  // 搜索
  search (e) {
    app.search(this.data.type, e.detail.value)
  },
  goDetail (e) {
    wx.navigateTo({
      url: `../detail/detail?id=${e.currentTarget.dataset.id}`
    })
  },
  leftChoose (e) {
    this.setData({
      left: e.currentTarget.dataset.index,
      playChoose: -1
    })
    // this.getData(this.data.value, e.currentTarget.dataset.place)
  },
  // 播放音乐
  play (e) {
    if (e.currentTarget.dataset.index * 1 === this.data.playChoose * 1) {
      this.setData({
        playChoose: -1
      })
      return wx.stopBackgroundAudio()
    }
    this.setData({
      playChoose: e.currentTarget.dataset.index
    })
    this.playMusic(this.data.basedomain + this.data.rightArr[this.data.playChoose].soundUrl)
  },
  playMusic (src) {
    wx.playBackgroundAudio({
      dataUrl: src.replace('|', '')
    })
  },
  // 获取数据
  getData (type, place) {
    let that = this
    // let url = app.getUrl().template + `?SESSIONID=${app.gs()}` + (type ? `&type=${type}` : '') + (place ? `&place=${place}` : '') + '&air=2'
    let url = app.getUrl().template + `?SESSIONID=${app.gs()}`
    app.wxrequest({
      url,
      data: {
        type,
        place,
        air: 2
      },
      success (res) {
        wx.hideLoading()
        if (res.data.code === '200') {
          that.setData({
            rightArr: res.data.result || []
          })
        } else {
          app.setToast(that, {content: res.data.message})
        }
      }
    })
  },
  // 获取场所类型
  placeList (type) {
    let that = this
    app.wxrequest({
      url: app.getUrl().placeList + `?SESSIONID=${app.gs()}`,
      data: {},
      success (res) {
        wx.hideLoading()
        if (res.data.code === '200') {
          that.setData({
            leftArr: res.data.result
          })
          that.getData(type, res.data.result[0].value)
        } else {
          app.setToast(that, {content: res.data.message})
        }
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad (options) {
    app.setBar('商品分类')
    app.getSelf(this)
    // if (options.type === '广告' || options.type === '彩铃' || options.type === '专题') {
    //   app.setBar(options.type)
    //   this.setData({
    //     show: true,
    //     type: options.type,
    //     value: options.value
    //   })
    //   this.placeList(options.value)
    // } else {
    //   app.setBar(options.type)
    //   this.setData({
    //     show: false,
    //     value: options.value
    //   })
    //   this.getData(options.value, '')
    // }
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
    wx.stopBackgroundAudio()
    // TODO: onHide
  },
  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload () {
    wx.stopBackgroundAudio()
    // TODO: onUnload
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh () {
    // TODO: onPullDownRefresh
  }
})
