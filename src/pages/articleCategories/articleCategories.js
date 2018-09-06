// 获取全局应用程序实例对象
const app = getApp()
const windowHeight = wx.getSystemInfoSync().windowHeight
// 创建页面实例对象
Page({
  /**
   * 页面的初始数据
   */
  data: {
    imgDomain: app.data.imgDomain,
    page: 0,
    basedomain: app.data.basedomain,
    testImg: app.data.testImg,
    show: true,
    height: windowHeight - 55,
    leftArr: [],
    left: 0,
    rightArr: [],
    tabArr2: []
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
      page: 0,
      rightArr: [],
      left: e.currentTarget.dataset.index,
      playChoose: -1
    }, this.getRight)
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
          app.setToast(that, {content: res.data.msg})
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
          app.setToast(that, {content: res.data.msg})
        }
      }
    })
  },
  getLeft () {
    let that = this
    app.wxrequest({
      url: app.getUrl().getArticleCagegory,
      data: {},
      success (res) {
        wx.hideLoading()
        if (res.data.code === 1) {
          that.setData({
            leftArr: res.data.data
          }, that.getRight)
        } else {
          app.setToast(that, {content: res.data.msg})
        }
      }
    })
  },
  getRight () {
    let that = this
    app.wxrequest({
      url: app.getUrl().articles,
      data: {
        key: app.gs(),
        page: ++that.data.page,
        category_id: that.data.leftArr[that.data.left].id
      },
      success (res) {
        wx.hideLoading()
        if (res.data.code === 1) {
          for (let v of res.data.data.data) {
            if (v.integral >= 1000) {
              v['integralK'] = Math.floor(v.integral / 1000) + 'K'
            }
            if (v.integral >= 1000000) {
              v['integralK'] = Math.floor(v.integral / 1000000) + 'BW'
            }
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
  onreachbottom () {
    if (this.data.more) return app.setToast(this, {content: '别扯了，没有啦~~'})
    else this.getRight()
  },
  ds (e) {
    let {index, integral} = e.detail
    this.data.rightArr[index].integral += (integral * 1)
    if (this.data.rightArr[index].integral >= 1000) this.data.rightArr[index]['integralK'] = Math.floor(this.data.rightArr[index].integral / 1000) + 'K'
    if (this.data.rightArr[index].integral >= 1000000) this.data.rightArr[index]['integralK'] = Math.floor(this.data.rightArr[index].integral / 1000000) + 'BW'
    this.setData({
      rightArr: this.data.rightArr
    })
  },
  zan (e) {
    app.dianzan(e, 'rightArr', this)
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad (options) {
    // app.setBar('文章分类')
    app.getSelf(this)
    this.setData({
      tabArr2: app.setNav()
    })
    this.getLeft()
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
