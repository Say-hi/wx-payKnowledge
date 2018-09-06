// 获取全局应用程序实例对象
const app = getApp()

// 创建页面实例对象
Page({
  /**
   * 页面的初始数据
   */
  data: {
    imgDomain: app.data.imgDomain,
    img: 'http://img02.tooopen.com/images/20150928/tooopen_sy_143912755726.jpg',
    scoreArr: [
      {
        t: '商品质量',
        c: 4,
        tr: '非常好'
      },
      {
        t: '物流服务',
        c: 4,
        tr: '非常好'
      },
      {
        t: '站点服务',
        c: 4,
        tr: '非常好'
      }
    ],
    textArr: ['差', '一般', '还行', '好', '非常好']
  },
  inputValue (e) {
    this.data.goods[e.currentTarget.dataset.index]['upContent'] = e.detail.value
    this.setData({
      goods: this.data.goods
    })
  },
  upImage (e) {
    let that = this
    app.wxUploadImg((res, v) => {
      that.data.goods[e.currentTarget.dataset.index]['imgArr'].push({url: v, id: res.id})
      that.setData({
        goods: that.data.goods
      })
    })
  },
  getSecond () {
    let that = this
    app.wxrequest({
      url: app.getUrl().orderorder,
      data: {
        key: app.gs(),
        order_id: that.data.options.id
      },
      success (res) {
        wx.hideLoading()
        if (res.data.code === 1) {
          for (let v of res.data.data.goods) {
            v['imgArr'] = []
          }
          that.setData({
            goods: res.data.data.goods
          })
        } else {
          app.setToast(that, {content: res.data.msg})
        }
      }
    })
  },
  del (e) {
    let that = this
    that.data.goods[e.currentTarget.dataset.oindex]['imgArr'].splice(e.currentTarget.dataset.index, 1)
    that.setData({
      goods: that.data.goods
    })
  },
  starChoose (e) {
    this.data.scoreArr[e.currentTarget.dataset.oindex].c = e.currentTarget.dataset.index
    this.data.scoreArr[e.currentTarget.dataset.oindex].tr = this.data.textArr[e.currentTarget.dataset.index]
    this.setData({
      scoreArr: this.data.scoreArr
    })
  },
  confirm (e) {
    if (!e.detail.value.content.trim().length) return app.setToast(this, {content: '请输入评论内容'})
    let that = this
    let goodsId = ''
    for (let v of that.data.goods) {
      goodsId += v.goods_id + ','
    }
    app.wxrequest({
      url: app.getUrl().addComment,
      data: {
        order_id: that.data.options.id,
        sign: 'save',
        content: e.detail.value.content,
        service_rank: that.data.scoreArr[2].c,
        goods_rank: that.data.scoreArr[0].c,
        deliver_rank: that.data.scoreArr[1].c,
        goods_id: goodsId.substring(0, goodsId.length - 1),
        comment_img: JSON.stringify(that.data.imgArr)
      },
      success (res) {
        wx.hideLoading()
        if (res.data.status === 200) {
          wx.showToast({
            title: '评价成功',
            mask: true
          })
          setTimeout(() => {
            wx.navigateBack({
              delta: 1
            })
          }, 1400)
        } else {
          app.setToast(that, {content: res.data.msg})
        }
      }
    })
  },
  upComment () {
    let that = this
    let data = {
      key: app.gs(),
      order_id: that.data.options.id,
      quality: that.data.scoreArr[0].c * 1 + 1,
      shop_service: that.data.scoreArr[2].c * 1 + 1,
      deliver_service: that.data.scoreArr[1].c * 1 + 1
    }
    let s = {}
    for (let v of that.data.goods) {
      s['content[' + v.goods_id + ']'] = v.upContent || '默认好评'
      if (v.imgArr.length > 0) {
        s['pictures[' + v.goods_id + ']'] = ''
        for (let m of v.imgArr) {
          s['pictures[' + v.goods_id + ']'] += m.id + ','
        }
      }
    }
    console.log(Object.assign(data, s))
    app.wxrequest({
      url: app.getUrl().ordercomment,
      data: Object.assign(data, s),
      success (res) {
        wx.hideLoading()
        if (res.data.code === 1) {
          wx.showToast({
            title: '评论成功',
            mask: true
          })
          setTimeout(() => {
            wx.navigateBack()
          }, 1000)
        } else {
          app.setToast(that, {content: res.data.msg})
        }
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad (options) {
    app.setBar('评价')
    app.getSelf(this)
    this.setData({
      options
    }, this.getSecond)
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
