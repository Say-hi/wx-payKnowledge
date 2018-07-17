// 获取全局应用程序实例对象
const app = getApp()
let timer = null
// 创建页面实例对象
Page({
  /**
   * 页面的初始数据
   */
  data: {
    testImg: app.data.testImg,
    indicatorColor: 'rgba(0, 0, 0, 0.4)',
    indicatorActiveColor: '#ffffff',
    show: true,
    hot: 'https://c.jiangwenqiang.com/workProject/payKnowledge/hot.png',
    tabArr: [
      {
        i: 'https://c.jiangwenqiang.com/workProject/payKnowledge/tab1.png',
        t: '视频课程',
        url: '../videoList/videoList'
      },
      {
        i: 'https://c.jiangwenqiang.com/workProject/payKnowledge/tab2.png',
        t: '社群中心',
        url: '../communityCenter/communityCenter'
      },
      {
        i: 'https://c.jiangwenqiang.com/workProject/payKnowledge/tab3.png',
        t: '精品专栏',
        url: '../colunmsList/colunmsList'
      },
      {
        i: 'https://c.jiangwenqiang.com/workProject/payKnowledge/tab4.png',
        t: '活动专区',
        url: '../activityList/activityList'
      }
    ],
    tabArr2: [
      {
        i: 'https://c.jiangwenqiang.com/workProject/payKnowledge/bottom1.png',
        t: '发现',
        url: '../index/index',
        active: true
      },
      {
        i: 'https://c.jiangwenqiang.com/workProject/payKnowledge/bottom2.png',
        t: '分类',
        url: '../articleCategories/articleCategories'
      },
      {
        i: 'https://c.jiangwenqiang.com/workProject/payKnowledge/bottom3.png',
        t: '商城',
        url: '../shop/shop'
      },
      {
        i: 'https://c.jiangwenqiang.com/workProject/payKnowledge/bottom4.png',
        t: '我的',
        url: '../user/user'
      }
    ]
  },
  // 关闭新人礼包
  close () {
    if (this.data.small) return
    this.setData({
      small: true
    })
    setTimeout(() => {
      this.setData({
        show: false
      })
    }, 500)
  },
  // 打电话
  calls () {
    app.call(this.data.shopInfo[1].r)
  },
  // 秒杀逻辑
  setKill () {
    let that = this
    if (timer) clearInterval(timer)
    function kill () {
      let shutDown = 0
      // console.log(that.data.killArr)
      if (!that.data.killArr) return
      for (let [i] of that.data.killArr.entries()) {
        let nowData = new Date().getTime() // 毫秒数
        // console.log('startTime', new Date(that.data.killArr[i].startTime))
        let startTime = that.data.killArr[i].start_time * 1000
        let endTime = that.data.killArr[i].end_time * 1000
        // console.log(nowData, startTime, endTime)
        if (nowData < startTime) { // 未开始
          that.data.killArr[i].status = 1
          that.data.killArr[i].h = Math.floor((startTime - nowData) / 3600000)
          that.data.killArr[i].m = Math.floor((startTime - nowData) % 3600000 / 60000)
          that.data.killArr[i].s = Math.floor((startTime - nowData) % 60000 / 1000)
        } else if (nowData > startTime && nowData < endTime) { // 进行中
          that.data.killArr[i].status = 2
          that.data.killArr[i].h = Math.floor((endTime - nowData) / 3600000)
          that.data.killArr[i].m = Math.floor((endTime - nowData) % 3600000 / 60000)
          that.data.killArr[i].s = Math.floor((endTime - nowData) % 60000 / 1000)
        } else { // 已结束
          if (that.data.killArr[i].status === 3) {
            ++shutDown
            continue
          }
          that.data.killArr[i].status = 3
          that.data.killArr[i].h = '已'
          that.data.killArr[i].m = '结'
          that.data.killArr[i].s = '束'
        }
        that.setData({
          killArr: that.data.killArr
        })
      }
      if (shutDown === that.data.killArr.length) clearInterval(timer)
    }
    kill()
    timer = setInterval(() => {
      kill()
    }, 1000)
  },

  getLocation () {
    let that = this
    wx.getLocation({
      type: 'gcj02',
      success (res) {
        that.setData({
          latitude: res.latitude,
          longitude: res.longitude
        })
        app.su('userLocation', res)
        that.getIndex()
      }
    })
  },

  getIndex () {
    let that = this
    app.wxrequest({
      url: app.getUrl().index,
      data: {
        act: 'index',
        latitude: that.data.latitude || '',
        longitude: that.data.longitude || ''
      },
      success (res) {
        wx.hideLoading()
        // console.log(res)
        if (res.data.status === 200) {
          that.setData({
            bannerArr: res.data.data.ad1List,
            bannerArr2: res.data.data.ad2List,
            announcement: res.data.data.noticeList[0].title,
            newGoodsList: res.data.data.newGoodsList,
            killArr: res.data.data.FSList,
            SOGList: res.data.data.SOGList
          })
          that.setKill()
          for (let v of res.data.data.cpl) {
            v.use_start_time = new Date(v.use_start_time).toLocaleString()
            v.use_end_time = new Date(v.use_end_time).toLocaleString()
          }
          that.setData({
            cpl: res.data.data.cpl
          })
          let count = 0
          setInterval(() => {
            if (count >= res.data.data.noticeList.length) {
              count = 0
            }
            that.setData({
              announcement: res.data.data.noticeList[count].title
            })
            count++
          }, 5000)
        } else {
          app.setToast(that, {content: res.data.msg})
        }
      }
    })
  },

  MaskGetUserInfo (e) {
    if (e.detail.iv) {
      this.setData({
        needUserInfo: false
      })
      app.wxlogin(this.getLocation)
    }
  },
  giveTip (e) {
    this.setData({
      componentsData: {
        name: '123' + e.currentTarget.dataset.index,
        id: e.currentTarget.dataset.index + 1,
        url: app.data.testImg,
        index: e.currentTarget.dataset.index
      }
    })
  },
  zan (e) {
    console.log(e)
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad (options) {
    app.setBar('发现')
    app.getSelf(this)
    /*eslint-disable*/
    this.setData({
      show: app.gs('userInfo') ? false : true
    })
    if (!app.gs('userInfo')) {
      this.setData({
        needUserInfo: true
      })
      // app.wxlogin(this.getLocation, {id: options.id})
    } else {
      // app.wxlogin(this.getLocation, {id: options.id})
      // this.getLocation()
    }
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady () {
    // console.log(' ---------- onReady ----------')
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow () {
    this.setKill()
    // console.log(' ---------- onShow ----------')
  },
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide () {
    clearInterval(timer)
    // console.log(' ---------- onHide ----------')
  },
  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload () {
    clearInterval(timer)
    // console.log(' ---------- onUnload ----------')
  },
  onShareAppMessage () {

  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh () {
    // console.log(' ---------- onPullDownRefresh ----------')
  }
})
