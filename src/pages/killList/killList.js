// 获取全局应用程序实例对象
const app = getApp()

// 创建页面实例对象
Page({
  /**
   * 页面的初始数据
   */
  data: {
    page: 0,
    time: '',
    goodsList: [],
    imgDomain: app.data.imgDomain,
    chooseIndex: -1,
    testImg: app.data.testImg
  },
  getTime () {
    let that = this
    app.wxrequest({
      url: app.getUrl().shopseckill,
      data: {
        page: 1,
        time: '00:00'
      },
      success (res) {
        wx.hideLoading()
        if (res.data.code === 1) {
          let index = 0
          let timeArr = that.data.timeArr || []
          if (!that.data.timeArr) {
            res.data.data.time.push('25:00')
            let times = res.data.data.time
            let now = new Date().getHours()
            for (let [i, v] of times.entries()) {
              if (parseInt(times[i]) <= now && now < parseInt(times[i * 1 + 1])) {
                timeArr.push({
                  time: v,
                  status: '秒杀中'
                })
                index = i
              } else if (parseInt(times[i]) <= now && now >= parseInt(times[i * 1 + 1])) {
                timeArr.push({
                  time: v,
                  status: '已结束'
                })
              } else {
                timeArr.push({
                  time: v,
                  status: '未开始'
                })
              }
            }
            timeArr.pop()
          }
          that.setData({
            timeArr: timeArr,
            chooseIndex: index
          }, that.getData)
        } else {
          app.setToast(that, {content: res.data.msg})
        }
      }
    })
  },
  getData () {
    let that = this
    app.wxrequest({
      url: app.getUrl().shopseckill,
      data: {
        page: ++that.data.page,
        time: that.data.timeArr[that.data.chooseIndex].time
      },
      success (res) {
        wx.hideLoading()
        if (res.data.code === 1) {
          that.setData({
            goodsList: that.data.goodsList.concat(res.data.data.seckill.data),
            more: res.data.data.seckill.data.length < res.data.data.seckill.per_page ? 1 : 0
          })
        } else {
          app.setToast(that, {content: res.data.msg})
        }
      }
    })
  },
  chooseTime (e) {
    this.setData({
      page: 0,
      goodsList: [],
      chooseIndex: e.currentTarget.dataset.index
    }, this.getData)
  },
  onReachBottom () {
    if (this.data.more) return app.setToast(this, {content: '别扯了，没有啦~~'})
    else this.getData()
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad () {
    app.setBar('商品列表')
    app.getSelf(this)
    this.getTime()
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
