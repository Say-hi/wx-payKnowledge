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
    testImg: app.data.testImg,
    urlArr: ['subscribe', ['uservideos', 'usercommunitys', 'userarticles', 'userquerys'], 'usercolumns'],
    currentIndex: 0,
    currentReleaseIndex: 0,
    playImg: 'https://c.jiangwenqiang.com/workProject/payKnowledge/play_btn.png',
    tabArr: [
      '我的订阅',
      '我的发布',
      '我的专栏'
    ],
    lists: [],
    tabReleaseArr: [
      '视频',
      '动态',
      '文章',
      '提问'
    ]
  },
  goDetail (e) {
    if (e.currentTarget.dataset.type === 'quesiton') {
      app.su('answerObj', Object.assign(this.data.lists[e.currentTarget.dataset.index], {username: app.gs('userInfoC').username, avatar: app.gs('userInfoC').avatar}))
    } else if (e.currentTarget.dataset.type === 'dynamic') app.su('answerObj', this.data.lists[e.currentTarget.dataset.index])
    wx.navigateTo({
      url: e.currentTarget.dataset.url
    })
  },
  showImg (e) {
    app.showImg(e)
  },
  zan (e) {
    app.dianzan(e, 'lists', this)
  },
  play (e) {
    this.setData({
      play: !this.data.play
    })
  },
  tabChoose (e) {
    if (e.currentTarget.dataset.type === 'release') {
      this.setData({
        currentReleaseIndex: e.currentTarget.dataset.index
      })
    } else {
      this.setData({
        currentIndex: e.currentTarget.dataset.index
      })
    }
    this.setData({
      lists: [],
      page: 0
    }, this.getVideoList)
  },
  getVideoList () {
    let that = this
    let type = this.data.currentIndex * 1 !== 1 ? this.data.urlArr[this.data.currentIndex] : this.data.urlArr[1][this.data.currentReleaseIndex]
    app.wxrequest({
      url: app.getUrl()[type],
      data: {
        key: app.gs(),
        page: ++that.data.page
      },
      success (res) {
        wx.hideLoading()
        if (res.data.code === 1) {
          if (type === 'usercolumns') {
            if (res.data.data.total <= 0) {
              that.setData({
                noHave: 1
              })
              return
            }
            that.setData({
              noHave: res.data.data.total * 1 === 0 ? 1 : 0,
              columnInfo: res.data.data.data[0] || {},
              columnId: res.data.data.data[0].id || 0
            })
            return that.getArticle()
          }
          for (let v of res.data.data.data) {
            v.create_time = app.moment(v.create_time)
          }
          if (type === 'uservideos') {
            for (let v of res.data.data.data) {
              if (!v.duration) {
                v.duration = '未知时长'
                continue
              }
              let m = (v.duration / 60).toFixed(0)
              let s = v.duration % 60
              v.duration = m + '`' + s + '``'
            }
          }
          that.setData({
            lists: that.data.lists.concat(res.data.data.data),
            more: res.data.data.data.length < res.data.data.per_page ? 1 : 0
          })
        } else {
          app.setToast(that, {content: res.data.msg})
        }
      }
    })
  },
  getArticle () {
    let that = this
    app.wxrequest({
      url: app.getUrl().articles,
      data: {
        key: app.gs(),
        column_id: that.data.columnId
      },
      success (res) {
        wx.hideLoading()
        if (res.data.code === 1) {
          for (let v of res.data.data.data) {
            v.create_time = app.moment(v.create_time)
          }
          that.setData({
            lists: that.data.lists.concat(res.data.data.data),
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
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad () {
    app.setBar('我的订阅')
    app.getSelf(this)
    this.getVideoList()
    this.setData({
      userInfo: app.gs('userInfoC')
    })
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
      lists: []
    }, this.getVideoList)
    // TODO: onPullDownRefresh
  }
})
