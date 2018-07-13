// 获取全局应用程序实例对象
const app = getApp()

// 创建页面实例对象
Page({
  /**
   * 页面的初始数据
   */
  data: {
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
    imgArr: [],
    textArr: ['差', '一般', '还行', '好', '非常好']
  },
  upImage () {
    let that = this
    wx.chooseImage({
      count: 1, // 默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success (res) {
        // console.log('图片上传', res)
        app.wxUpload({
          url: app.getUrl().orderImageUpload,
          filePath: res.tempFilePaths[0],
          formData: {},
          success (res2) {
            res2 = JSON.parse(res2.data)
            if (res2.status === 200) {
              that.data.imgArr.push(res2.data.image_url)
              that.setData({
                imgArr: that.data.imgArr
              })
            } else {
              app.setToast(that, {content: res2.msg})
            }
          }
        })
      }
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
  getOrderInfo (id) {
    let that = this
    app.wxrequest({
      url: app.getUrl().addComment,
      data: {
        order_id: id,
        sign: 0
      },
      success (res) {
        wx.hideLoading()
        if (res.data.status === 200) {
          that.setData({
            info: res.data.data.order_info,
            goods: res.data.data.goods_list
          })
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
    this.setData({
      options
    })
    this.getOrderInfo(options.id)
    app.setBar('评价')
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
