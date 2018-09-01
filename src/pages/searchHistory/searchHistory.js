// 获取全局应用程序实例对象
const app = getApp()

// 创建页面实例对象
Page({
  /**
   * 页面的初始数据
   */
  data: {
    title: 'searchHistory',
    searchShow: true
  },
  cleanHistory () {
    this.setData({
      history: [],
      searchShow: false
    })
    wx.removeStorageSync('history')
  },
  chooseTip (e) {
    let index = e.currentTarget.dataset.choose
    this.setData({
      chooseHistory: index
    }, this.search(e.currentTarget.dataset.content))
  },
  search (content) {
    let that = this
    // console.log(content)
    let searcheText = ''
    if (content.detail) searcheText = content.detail.value
    else searcheText = content
    app.wxrequest({
      url: app.getUrl().articles,
      data: {
        key: app.gs(),
        keyword: searcheText
      },
      success (res) {
        wx.hideLoading()
        if (res.data.code === 1 && res.data.data.total > 0) {
          wx.navigateTo({
            url: `/pages/articleList/articleList?content=${searcheText}`
          })
        } else {
          app.setToast(that, {content: '未搜索到相关内容'})
        }
      }
    })
    // 设置缓存
    for (let index in that.data.history) {
      // 搜索项已经存在
      if (that.data.history[index] === searcheText) {
        // console.log(index)
        that.setData({
          chooseHistory: index
        })
        // that.getSearch(that.data.history[index])
        return
      }
    }
    let history = that.data.history
    // console.log(history)
    if (!history) {
      history = [searcheText]
      that.data.history = history
    } else {
      let count = history.unshift(searcheText)
      if (count >= 10) {
        that.data.history.pop()
      }
    }
    this.setData({
      chooseHistory: 0,
      searchShow: true
    })
    // 执行搜索操作
    // this.getSearch(searcheText)
    wx.setStorage({
      key: 'history',
      data: that.data.history,
      success () {
        that.setData({
          history: wx.getStorageSync('history')
        })
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad () {
    app.setBar('搜索')
    app.getSelf(this)
    let history = app.gs('history')
    if (!history) {
      this.setData({
        searchShow: false
      })
    }
    this.setData({
      history: history || []
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
    // TODO: onPullDownRefresh
  }
})
