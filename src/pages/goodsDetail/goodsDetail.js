// 获取全局应用程序实例对象
const app = getApp()
let timer = null
let timer2 = null
// 创建页面实例对象
Page({
  /**
   * 页面的初始数据
   */
  data: {
    imgDomain: app.data.imgDomain,
    testImg: app.data.testImg,
    tabChooseNow: '1',
    tabChooseNow2: '1',
    page: 0,
    commentArr: [],
    num: 1,
    bottomTab: [
      {
        name: '商城',
        img: 'https://c.jiangwenqiang.com/workProject/payKnowledge/gd1.png'
      },
      {
        name: '购物车',
        img: 'https://c.jiangwenqiang.com/workProject/payKnowledge/gd2.png'
      }
    ],
    tipsArr: ['门店自提', '送货上门', '质量保证', '企业认证'],
    nowStartArr: [],
    videoSrc: 'http://wxsnsdy.tc.qq.com/105/20210/snsdyvideodownload?filekey=30280201010421301f0201690402534804102ca905ce620b1241b726bc41dcff44e00204012882540400&bizid=1023&hy=SH&fileparam=302c020101042530230204136ffd93020457e3c4ff02024ef202031e8d7f02030f42400204045a320a0201000400'
  },
  //
  showImage (e) {
    app.showImg(e)
  },
  // 获取商品分享的二维码
  getQrCode () {
    let that = this
    app.wxrequest({
      url: app.getUrl().createQRCode,
      data: {
        scene: `${that.data.options.type}&${that.data.options.id}`,
        // page: 'pages/goodsDetail/goodsDetail'
        page: 'pages/index/index'
      },
      success (res) {
        wx.hideLoading()
        if (res.data.status === 200) {
          that.setData({
            qrCodeUrl: res.data.data.image_url
          })
        } else {
          app.setToast(that, {content: res.data.msg})
        }
      }
    })
  },
  onlyPic () {
    this.setData({
      page: 0,
      onlyPic: !this.data.onlyPic
    }, this.getComment)
  },
  // 顶栏切换
  tabChoose (e) {
    if (e.currentTarget.dataset.index === this.data.tabChooseNow) return
    this.setData({
      tabChooseNow: e.currentTarget.dataset.index
    })
  },
  // 顶栏切换
  tabChoose2 (e) {
    if (e.currentTarget.dataset.index === this.data.tabChooseNow2) return
    this.setData({
      tabChooseNow2: e.currentTarget.dataset.index,
      page: 0,
      commentArr: []
    }, this.getComment)
  },
  // 放大图片
  // showImage (e) {
  //   let showArray = []
  //   for (let v of this.data.bannerArr) {
  //     showArray.push(v.image_url)
  //   }
  //   app.showImg(e, showArray)
  // },
  // 秒杀逻辑
  setKill () {
    let that = this
    if (timer) clearInterval(timer)
    function kill () {
      if (!that.data.info.seckill) return
      let nowData = new Date().getTime() // 毫秒数
      let startTime = new Date(that.data.info.seckill.start_time.replace(/[-]/g, '.')).getTime()
      let endTime = new Date(that.data.info.seckill.end_time.replace(/[-]/g, '.')).getTime()
      if (nowData < startTime) { // 未开始
        that.data.info.status = 1
        that.data.info.h = Math.floor((startTime - nowData) / 3600000)
        that.data.info.m = Math.floor((startTime - nowData) % 3600000 / 60000)
        that.data.info.s = Math.floor((startTime - nowData) % 60000 / 1000)
      } else if (nowData > startTime && nowData < endTime) { // 进行中
        that.data.info.status = 2
        that.data.info.h = Math.floor((endTime - nowData) / 3600000)
        that.data.info.m = Math.floor((endTime - nowData) % 3600000 / 60000)
        that.data.info.s = Math.floor((endTime - nowData) % 60000 / 1000)
      } else { // 已结束
        that.data.info.status = 3
        that.data.info.h = '已'
        that.data.info.m = '结'
        that.data.info.s = '束'
      }
      that.setData({
        info: that.data.info
      })
      if (that.data.info.status === 3) clearInterval(timer)
    }
    kill()
    timer = setInterval(() => {
      kill()
    }, 1000)
  },
  // 倒计时
  lostTime () {
    let that = this
    if (timer2) clearInterval(timer2)
    function kill () {
      let shutDown = 0
      if (!that.data.nowStartArr) return
      for (let [i] of that.data.nowStartArr.entries()) {
        let nowData = new Date().getTime() // 毫秒数
        let endTime = that.data.nowStartArr[i].end_time * 1000
        if (nowData < endTime) { // 进行中
          that.data.nowStartArr[i].status = 2
          that.data.nowStartArr[i].h = Math.floor((endTime - nowData) / 3600000)
          that.data.nowStartArr[i].m = Math.floor((endTime - nowData) % 3600000 / 60000)
          that.data.nowStartArr[i].s = Math.floor((endTime - nowData) % 60000 / 1000)
        } else { // 已结束
          if (that.data.nowStartArr[i].status === 3) {
            ++shutDown
            continue
          }
          that.data.nowStartArr[i].status = 3
          that.data.nowStartArr[i].h = '已'
          that.data.nowStartArr[i].m = '结'
          that.data.nowStartArr[i].s = '束'
        }
        that.setData({
          nowStartArr: that.data.nowStartArr
        })
      }
      if (shutDown === that.data.nowStartArr.length) clearInterval(timer)
    }
    kill()
    timer2 = setInterval(() => {
      kill()
    }, 1000)
  },
  // 返回首页
  backIndex () {
    wx.reLaunch({
      url: '../index/index'
    })
  },
  // 分享选择
  shareShow () {
    let that = this
    let time = 0
    if (this.data.shareChoose) {
      this.setData({
        small: true
      })
      time = 600
    } else {
      this.setData({
        small: false
      })
    }
    setTimeout(() => {
      that.setData({
        shareChoose: !that.data.shareChoose
      })
    }, time)
  },
  // 关闭图片分享
  closeImg () {
    this.setData({
      shareChoose: true,
      showCanvas: false
    })
  },
  // 获取分享的图片
  getSharePic () {
    this.setData({
      showCanvas: !this.data.showCanvas
    })
    this.getCanvasSize()
  },
  // 获取canvas元素px值
  getCanvasSize () {
    let that = this
    wx.showLoading({
      title: '获取分享图片...'
    })
    setTimeout(function () {
      wx.createSelectorQuery().select('#qwe').fields({
        size: true
      }, function (res) {
        that.drawCanvas(res.width, res.height)
      }).exec()
    }, 50)
  },
  // canvas绘制分享图片
  drawCanvas (ctxW, ctxH) {
    let that = this
    let bannerImg = null
    let qrCode = null
    // let three = null
    // let four = null
    app.downLoad(that.data.bannerArr[0].image_url)
      .then((res) => {
        bannerImg = res
        return app.downLoad(that.data.qrCodeUrl)
      })
      .then((res2) => {
        qrCode = res2
        return that.asdf({ctxW, ctxH, bannerImg, qrCode})
      })
  },
  asdf ({ctxW, ctxH, bannerImg, qrCode}) {
    let that = this
    if (bannerImg === 0 || qrCode === 0) return this.drawCanvas()
    wx.hideLoading()
    let ctx = wx.createCanvasContext('myCanvas')
    let XS = that.data.windowWidth / 375
    ctx.setFillStyle('#ffffff')
    ctx.fillRect(0, 0, ctxW, ctxH)
    ctx.drawImage(bannerImg, ctxW / 2 - 90 * XS, 15 * XS, 180 * XS, 170 * XS)
    ctx.setFontSize(18 * XS)
    ctx.setFillStyle('#000000')
    ctx.setTextAlign('left')
    ctx.setTextBaseline('middle')
    ctx.fillText(that.data.goodsInfo.goods_remark.slice(0, 8) + '...', ctxW / 2 - 90 * XS, 170 * XS + 30)
    ctx.setFontSize(22 * XS)
    ctx.setFillStyle('#ff4344')
    ctx.setTextAlign('left')
    ctx.setTextBaseline('middle')
    ctx.fillText('￥' + that.data.goodsInfo.shop_price, ctxW / 2 - 90 * XS, 170 * XS + 60)
    ctx.setFillStyle('#f9f9f9')
    ctx.fillRect(ctxW / 2 - 90 * XS, 170 * XS + 80, ctxW - 30 * XS, 2)
    ctx.setFontSize(12 * XS)
    ctx.setFillStyle('#999999')
    ctx.setTextAlign('left')
    ctx.setTextBaseline('middle')
    ctx.fillText('长按识别小程序码访问', ctxW / 2 - 90 * XS, 170 * XS + 100)
    ctx.drawImage(qrCode, ctxW - 60 * XS, 170 * XS + 100, 50 * XS, 50 * XS)
    ctx.draw()
  },
  // 保存图片到用户相册
  saveImgToUser () {
    wx.canvasToTempFilePath({
      canvasId: 'myCanvas',
      success: function (res) {
        wx.saveImageToPhotosAlbum({
          filePath: res.tempFilePath,
          success () {
            wx.showToast({
              title: '图片保存成功',
              icon: 'success',
              duration: 2000
            })
          }
        })
      }
    })
  },
  // 购买弹窗
  closeBuy (e) {
    if (this.data.type === 'kill' && this.data.goodsInfo.status === 3) return app.setToast(this, {content: '秒杀活动已结束'})
    if (this.data.type === 'special' && !this.data.goodsInfo.activity_is_on) return app.setToast(this, {content: '亲，本商品特价活动已结束'})
    if (e && e.currentTarget.dataset.type === 'buy' && e.currentTarget.dataset.end * 1 === 1) return app.setToast(this, {content: '亲，该拼团已经结束了哦'})
    let that = this
    let time = 0
    if (this.data.buy) {
      this.setData({
        small: true,
        bulkpChoose: -1
      })
      time = 600
    } else {
      this.setData({
        small: false,
        bulkpChoose: typeof e.currentTarget.dataset.index === 'number' ? e.currentTarget.dataset.index : -1,
        bulkpSelf: e.currentTarget.dataset.self ? 1 : 0
      })
    }
    setTimeout(() => {
      that.setData({
        buyType: e ? e.currentTarget.dataset.type || '' : '',
        buy: !that.data.buy
      })
    }, time)
  },
  // 数量选择
  chooseMenuNum (e) {
    if (e.currentTarget.dataset.type === 'del') {
      if (this.data.num === 1) return
      --this.data.num
    } else {
      if (!this.data.num) {
        this.data.num = 1
      } else {
        // if (this.data.goodsInfo.buy_limit <= this.data.num) return app.setToast(this, {content: `亲，每人限购${this.data.goodsInfo.buy_limit}件哦`})
        // if (this.data.nowStartArr.length && this.data.bulkpChoose >= 0) {
        //   if (this.data.nowStartArr[this.data.bulkpChoose].goods_num <= this.data.num && this.data.bulkpChoose >= 0) return app.setToast(this, {content: '超出库存啦'})
        // }
        // if (this.data.goodsInfo.store_count <= this.data.num) return app.setToast(this, {content: '超出库存啦'})
        ++this.data.num
      }
    }
    this.setData({
      num: this.data.num
    })
  },
  // 将选择的物品放置缓存
  setGoodsStorage () {
    let that = this
    let vv = that.data.goodsInfo
    let goodsStorage = app.gs('goodsStorage') || []
    if (!goodsStorage.length) {
      goodsStorage.push(vv)
    } else {
      for (let [i, m] of goodsStorage.entries()) {
        if (m.goods_id === vv.goods_id) { // 缓存中存在该项,重新赋值，跳出循环
          goodsStorage[i] = vv
          break
        } else if (i === goodsStorage.length - 1) {
          goodsStorage.push(vv)
        }
      }
    }
    app.su('goodsStorage', goodsStorage)
  },
  // 将物品添加至后台购物车
  addToCar () {
    let that = this
    app.wxrequest({
      url: app.getUrl().cartupdate,
      data: {
        key: app.gs(),
        goods_id: that.data.info.id,
        number: that.data.num || 1
      },
      success (res) {
        wx.hideLoading()
        if (res.data.code === 1) {
          that.closeBuy()
          app.setToast(that, {content: '已添加至购物车'})
        } else {
          app.setToast(that, {content: res.data.msg})
          that.closeBuy()
        }
      }
    })
  },
  // 购买确认
  buyConfirm () {
    if (this.data.info.seckill && this.data.info.seckill.id) {
      if (this.data.info.status === 3) return app.setToast(this, {content: '该商品秒杀结束了，欢迎您关注下次活动'})
      else if (this.data.info.seckill.quota < this.data.num) return app.setToast(this, {content: `每人最够购买${this.data.info.seckill.quota}`})
    }
    this.closeBuy()
    if (this.data.buyType === 'car') {
      this.addToCar()
    } else {
      wx.navigateTo({
        url: `../submitOrder/submitOrder?type=buynow&goods_id=${this.data.info.id}&num=${this.data.num}&seckill=${this.data.info.seckill ? this.data.info.seckill.id : -1}`
      })
    }
    //
    // if (this.data.buyType === 'car') {
    //   this.addToCar()
    // } else {
    //   if (this.data.type === 'bulkP') {
    //     if (this.data.bulkpChoose >= 0) {
    //       wx.navigateTo({
    //         url: `../submitOrder/submitOrder?type=bulkpBuy&id=${this.data.nowStartArr[this.data.bulkpChoose].goods_id}&num=${this.data.goodsInfo.num || 1}&group_by=${this.data.bulkpSelf}&prom_id=${this.data.nowStartArr[this.data.bulkpChoose].team_id}`
    //       })
    //     } else {
    //       wx.navigateTo({
    //         url: `../submitOrder/submitOrder?type=bulkpBuy&id=${this.data.goodsInfo.goods_id}&num=${this.data.goodsInfo.num || 1}&group_by=${this.data.bulkpSelf}&prom_id=0`
    //       })
    //     }
    //   } else {
    //     wx.navigateTo({
    //       url: `../submitOrder/submitOrder?type=buyNow&id=${this.data.goodsInfo.goods_id}&num=${this.data.goodsInfo.num || 1}`
    //     })
    //   }
    //   // app.su('goodsStorageNow', this.data.goodsInfo)
    // }
  },
  showVideo () {
    this.setData({
      videoShow: !this.data.videoShow
    })
  },
  getGoodsInfo (id) {
    let that = this
    if (this.data.type === 'bulkP') {
      wx.getLocation({
        type: 'gcj02',
        success (res2) {
          that.setData({
            needSetting: false
          })
          app.wxrequest({
            url: app.getUrl().goodsInfo,
            data: {
              id,
              latitude: res2.latitude,
              longitude: res2.longitude
            },
            success (res) {
              wx.hideLoading()
              if (res.data.status === 200) {
                app.WP('introduce', 'html', res.data.data.goods.goods_content, that, 5)
                that.setData({
                  goodsInfo: res.data.data.goods,
                  bannerArr: res.data.data.goodsImagesList,
                  commentStatistics: res.data.data.commentStatistics,
                  nowStartArr: res.data.data.teamList
                })
                that.getComment(1)
                if (that.data.type === 'kill') {
                  that.setKill()
                } else if (that.data.type === 'bulkP') {
                  that.lostTime()
                }
              } else {
                app.setToast(that, {content: res.data.msg})
                setTimeout(() => {
                  wx.reLaunch({
                    url: '../index/index'
                  })
                }, 1400)
              }
            }
          })
        },
        fail (res) {
          console.log('err', res)
          that.setData({
            needSetting: true
          })
          app.setToast(that, {content: '未授权地理位置信息，无法获取附近的拼团'})
        }
      })
    } else {
      app.wxrequest({
        url: app.getUrl().goodsInfo,
        data: {
          id
        },
        success (res) {
          wx.hideLoading()
          if (res.data.status === 200) {
            app.WP('introduce', 'html', res.data.data.goods.goods_content, that, 5)
            that.setData({
              goodsInfo: res.data.data.goods,
              bannerArr: res.data.data.goodsImagesList,
              commentStatistics: res.data.data.commentStatistics
            })
            that.getComment(1)
            if (that.data.type === 'kill') {
              that.setKill()
            } else if (that.data.type === 'bulkP') {
              that.lostTime()
            }
          } else {
            app.setToast(that, {content: res.data.msg})
            setTimeout(() => {
              wx.reLaunch({
                url: '../index/index'
              })
            }, 1400)
          }
        }
      })
    }
  },
  // getComment (commentType) {
  //   let that = this
  //   app.wxrequest({
  //     url: app.getUrl().ajaxComment,
  //     data: {
  //       goods_id: that.data.goodsInfo.goods_id,
  //       commentType,
  //       p: ++that.data.page
  //     },
  //     success (res) {
  //       wx.hideLoading()
  //       if (res.data.status === 200) {
  //         that.getQrCode()
  //         for (let v of res.data.data.commentlist) {
  //           v.add_time = new Date(v.add_time * 1000).toLocaleDateString()
  //         }
  //         that.setData({
  //           commentArr: that.data.commentArr.concat(res.data.data.commentlist),
  //           more: res.data.data.commentlist.length < 10 ? 0 : 1
  //         })
  //       } else {
  //         app.setToast(that, {content: res.data.msg})
  //       }
  //     }
  //   })
  // },
  // 获取设置
  openSetting () {
    let that = this
    wx.openSetting({
      success (res) {
        // console.log(res)
        if (res.authSetting['scope.userLocation']) {
          that.setData({
            needSetting: false
          })
          that.getGoodsInfo(that.data.options.id)
        }
      }
    })
  },
  MaskGetUserInfo (e) {
    if (e.detail.iv) {
      this.setData({
        needUserInfo: false
      })
      app.wxlogin(this.getGoodsInfo, this.options.id)
    }
  },
  getGoods () {
    let that = this
    app.wxrequest({
      url: app.getUrl().product,
      data: {
        id: that.data.options.id
      },
      success (res) {
        wx.hideLoading()
        if (res.data.code === 1) {
          app.WP('content', 'html', res.data.data.content, that, 0)
          that.setData({
            info: res.data.data
          }, that.getComment)
        } else {
          app.setToast(that, {content: res.data.msg})
        }
      }
    })
  },
  getComment () {
    let that = this
    app.wxrequest({
      url: app.getUrl().shopComment,
      data: {
        goods_id: that.data.info.id,
        grade: that.data.tabChooseNow2 * 1 === 1 ? '' : that.data.tabChooseNow2 - 2 <= 2 ? that.data.tabChooseNow2 - 2 : '',
        is_picture: that.data.onlyPic ? 1 : 0,
        page: ++that.data.page
      },
      success (res) {
        wx.hideLoading()
        if (res.data.code === 1) {
          that.setData({
            commentArr: that.data.commentArr.concat(res.data.data.data),
            more: res.data.data.data.length < res.data.data.per_page ? 1 : 0
          }, that.setKill)
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
    app.setBar('商品详情')
    app.getSelf(this)
    this.setData({
      options
    }, this.getGoods)
    // if (options.scene) {
    //   let scene = decodeURIComponent(options.scene).split('&')
    //   options.type = scene[0]
    //   options.id = scene[1]
    // }
    // this.setData({
    //   type: options.type || 'bulkP',
    //   options
    // })
    // let that = this
    // wx.getSystemInfo({
    //   success: function (res) {
    //     that.setData({
    //       pixelRatio: res.pixelRatio,
    //       windowWidth: res.windowWidth,
    //       windowHeight: res.windowHeight
    //     })
    //   }
    // })
    // /*eslint-disable*/
    // this.setData({
    //   show: app.gs('userInfo') ? false : true
    // })
    // if (!app.gs('userInfo')) {
    //   this.setData({
    //     needUserInfo: true
    //   })
    //   app.wxlogin(this.getGoodsInfo, options.id)
    // } else {
    //   this.getGoodsInfo(options.id)
    // }
    // TODO: onLoad
  },
  onReachBottom () {
    if (this.data.tabChooseNow <= 1) return
    else if (this.data.more) return app.setToast(this, {content: '没有更多内容了'})
    this.getComment(this.data.tabChooseNow2)
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
    if (this.data.type === 'kill') {
      this.setKill()
    } else if (this.data.type === 'bulkP') {
      this.lostTime()
    }
    // TODO: onShow
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide () {
    clearInterval(timer)
    clearInterval(timer2)
    // TODO: onHide
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload () {
    clearInterval(timer)
    clearInterval(timer2)
    // TODO: onUnload
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh () {
    // TODO: onPullDownRefresh
  },
  // 分享朋友
  onShareAppMessage () {
    let that = this
    return {
      title: `您的好友${app.gs().nickName || '测试用户'}向您分享了好产品`,
      path: `pages/goodsDetail/goodsDetail?type=${that.data.type}?id=${that.data.goodsInfo.goods_id}`
      // imageUrl: that.data.bannerArr[0].image_url
    }
  }
})
