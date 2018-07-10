// 获取全局应用程序实例对象
const app = getApp()

// 创建页面实例对象
Page({
  /**
   * 页面的初始数据
   */
  data: {
    shopImg: 'https://c.jiangwenqiang.com/workProject/payKnowledge/gd1.png',
    testImg: app.data.testImg,
    active: 2,
    sendMoney: 0,
    timeIndex: 0,
    shopIndex: 0,
    focus: true,
    orderInfo: {},
    timeArr: [
      '站点常规配送时间',
      '00:00-01:00',
      '01:00-02:00',
      '02:00-03:00',
      '03:00-04:00',
      '04:00-05:00',
      '05:00-06:00',
      '06:00-07:00',
      '07:00-08:00',
      '08:00-09:00',
      '09:00-10:00',
      '10:00-11:00',
      '11:00-12:00',
      '12:00-13:00',
      '13:00-14:00',
      '14:00-15:00',
      '15:00-16:00',
      '16:00-17:00',
      '17:00-18:00',
      '18:00-19:00',
      '19:00-20:00',
      '20:00-21:00',
      '21:00-22:00',
      '22:00-23:00',
      '23:00-00:00'
    ],
    shopArr: [{pickup_name: '选择您附近的门店地址'}],
    payBottom: [
      {
        img: 'https://c.jiangwenqiang.com/workProject/payKnowledge/paybottom1.png',
        t: '微信支付'
      },
      {
        img: 'https://c.jiangwenqiang.com/workProject/payKnowledge/paybottom2.png',
        t: '账户余额'
      }
    ]
  },
  fuckScore (e) {
    this.setData({
      fuck_score: e.detail.value
    })
    this.calculateMoney()
  },
  bindPickerChange (e) {
    this.setData({
      timeIndex: e.detail.value
    })
  },
  bindShopPickerChange (e) {
    this.setData({
      shopIndex: e.detail.value * 1
    })
  },
  chooseSendType (e) {
    if (this.data.lostTime) return
    this.setData({
      active: e.currentTarget.dataset.index
    })
  },
  // 选择地址
  chooseAddress () {
    if (this.data.lostTime) return
    let that = this
    wx.chooseAddress({
      success (res) {
        if (res.telNumber) { // 获取信息成功
          wx.setStorageSync('addressInfo', res)
          that.setData({
            needSetting: false,
            addressInfo: res
          })
        }
      },
      fail () {
        wx.getSetting({
          success (res) {
            if (!res.authSetting['scope.address']) {
              that.setData({
                needSetting: true
              })
              app.setToast(that, {content: '需授权获取地址信息'})
            }
          }
        })
      }
    })
  },
  // 获取设置
  openSetting () {
    let that = this
    wx.getSetting({
      success (res) {
        if (res.authSetting['scope.address']) {
          that.setData({
            needSetting: false
          })
          that.chooseAddress()
        }
      }
    })
  },
  // 支付方式展示
  payShow () {
    this.setData({
      showActionSheet: !this.data.showActionSheet
    })
  },
  // 选择支付方式
  choosePay () {
    // if (!this.data.lostTime) {
    //   // if (!this.data.shopIndex) return app.setToast(this, {content: '请选择您附近的门店地址'})
    //   // if (this.data.active * 1 === 1) {
    //
    //   // }
    // }
    // if (!this.data.addressInfo) return app.setToast(this, {content: '请选择您的收货地址'})
    // let that = this
    this.payShow()
    // wx.showActionSheet({
    //   itemList: ['微信支付', '猫豆支付', '找人代付'],
    //   itemColor: '#333',
    //   success (res) {
    //     if (that.data.lostTime) {
    //       if (res.tapIndex === 2) {
    //         app.su('otherPayInfo', that.data.info.goods_list)
    //         wx.redirectTo({
    //           url: '../otherPay/otherPay?id=' + that.data.info.order_id + '&calculateMoney=' + (that.data.info.total_amount * 1 + that.data.info.user_money * 1)
    //         })
    //       } else if (res.tapIndex === 0) {
    //         that.wechatPay()
    //       } else if (res.tapIndex === 1) {
    //         that.setData({
    //           maodouPay: true
    //         })
    //         // that.catPay()
    //       }
    //     } else if (that.data.orderInfo.order_id) {
    //       if (res.tapIndex === 2) {
    //         app.su('otherPayInfo', that.data.info.goods_list)
    //         wx.redirectTo({
    //           url: '../otherPay/otherPay?id=' + that.data.orderInfo.order_id + `&calculateMoney=${that.data.orderInfo.order_amount || that.data.calculateMoney}`
    //         })
    //       } else if (res.tapIndex === 0) {
    //         that.wechatPay()
    //       } else if (res.tapIndex === 1) {
    //         that.setData({
    //           maodouPay: true
    //         })
    //         // that.catPay()
    //       }
    //     } else {
    //       that.submitOrder(res)
    //     }
    //   }
    // })
  },
  // 计算价格
  calculateMoney () {
    let money = (this.data.useCoupon ? this.data.fuck_score ? this.data.allMoney - this.data.useCoupon.coupon.money - this.data.userInfo.pay_points / 100 : this.data.allMoney - this.data.useCoupon.coupon.money : this.data.fuck_score ? this.data.allMoney - this.data.userInfo.pay_points / 100 : this.data.allMoney).toFixed(2)
    if (money <= 0) {
      money = '0.00'
    }
    this.setData({
      calculateMoney: money
    })
  },
  // 倒计时
  showLostTime (startTime) {
    let endTime = startTime * 1000 + 900000 // 超时15分钟
    let timer = setInterval(() => {
      if (endTime - new Date().getTime() <= 0) {
        // todo 取消订单
        clearInterval(timer)
        app.setToast(this, {content: '该订单超时支付已取消'})
        setTimeout(() => {
          wx.navigateBack({
            delta: 1
          })
        }, 1500)
        return
      }
      let lost = parseInt((endTime - (new Date().getTime())) / 1000)
      this.setData({
        timeText: parseInt(lost / 60) === 0 ? lost % 60 + '秒' : parseInt(lost / 60) + '分' + lost % 60 + '秒'
      })
    }, 100)
  },
  // 获取购物车列表
  getCarList (options) {
    let that = this
    let data = {}
    this.setData({
      options
    })
    if (options.type === 'buyNow') {
      data = Object.assign({action: 'buy_now', goods_id: options.id, goods_num: options.num})
    } else if (options.type === 'bulkpBuy' && options.group_by * 1 === 1) {
      data = Object.assign({action: 'buy_now', group_buy: 0, goods_id: options.id, team_id: options.prom_id, goods_num: options.num})
    } else if (options.type === 'bulkpBuy' && options.group_by * 1 !== 1) {
      data = Object.assign({action: 'buy_now', group_buy: 1, goods_id: options.id, team_id: options.prom_id, goods_num: options.num})
    }
    app.wxrequest({
      url: app.getUrl().cart2,
      data,
      success (res) {
        wx.hideLoading()
        if (res.data.status === 200) {
          that.setData({
            menuArr: res.data.data.cartList,
            sendMoney: res.data.data.cartPriceInfo.shipping_price || 0, // 送货费
            allMoney: res.data.data.cartPriceInfo.total_fee * 1 || 0, // 商品当前总价
            userInfo: res.data.data.user,
            delivery_time: that.data.timeArr[that.data.timeIndex],
            allCount: res.data.data.cartPriceInfo.goods_num,
            shopArr: that.data.shopArr.concat(res.data.data.pickupList),
            shopIndex: res.data.data.pickupList[0].is_latest * 1 === 1 ? 1 : 0,
            coupon: res.data.data.userCartCouponList
          })
          that.calculateMoney()
        } else {
          // console.log(res.data.msg.msg)
          if (res.data.msg.status === 0) {
            app.setToast(that, {content: res.data.msg.msg})
            setTimeout(() => {
              wx.navigateBack({
                delta: 1
              })
            }, 1500)
          } else {
            app.setToast(that, {content: res.data.msg})
          }
        }
      }
    })
  },
  // 提交订单
  submitOrder (res) {
    let that = this
    let data = {
      address: !that.data.addressInfo ? '用户到店自取' : that.data.addressInfo.provinceName + that.data.addressInfo.cityName + that.data.addressInfo.countyName + that.data.addressInfo.detailInfo,
      consignee: !that.data.addressInfo ? '用户到店自取' : that.data.addressInfo.userName,
      mobile: !that.data.addressInfo ? '用户到店自取' : that.data.addressInfo.telNumber,
      pay_points: that.data.fuck_score ? that.data.userInfo.pay_points : 0,
      act: 'submit_order',
      user_note: that.data.userNote || '',
      deliver_type: that.data.active,
      delivery_time: that.data.timeArr[that.data.timeIndex],
      coupon_id: app.gs('useCoupon').id || '',
      pickup_id: that.data.shopArr[that.data.shopIndex].pickup_id
    }
    if (that.data.options.type === 'buyNow') { // 立即购买
      data = Object.assign({
        action: 'buy_now',
        goods_id: that.data.options.id,
        goods_num: that.data.options.num
      }, data)
    } else if (that.data.options.type === 'bulkpBuy') { // 拼团
      data = Object.assign({
        action: 'buy_now',
        goods_id: that.data.options.id,
        goods_num: that.data.options.num,
        group_buy: that.data.options.group_by * 1 === 1 ? '0' : '1',
        team_id: that.data.options.prom_id
      }, data)
    }
    app.wxrequest({
      url: app.getUrl().cart3,
      data,
      success (res2) {
        wx.hideLoading()
        if (res2.data.status === 200) {
          that.setData({
            orderInfo: res2.data.data.order
          })
          if (res.tapIndex === 2) {
            app.su('otherPayInfo', that.data.menuArr)
            wx.redirectTo({
              url: '../otherPay/otherPay?id=' + res2.data.data.order.order_id + `&calculateMoney=${res2.data.data.order.order_amount || that.data.calculateMoney}`
            })
          } else if (res.tapIndex === 0) {
            that.wechatPay()
          } else if (res.tapIndex === 1) {
            that.setData({
              maodouPay: true
            })
            // that.catPay()
          }
        } else {
          app.setToast(that, {content: res2.data.msg})
        }
      }
    })
  },
  // 微信支付
  wechatPay () {
    let that = this
    app.wxrequest({
      url: app.getUrl().payByOrder,
      data: {
        order_id: that.data.orderInfo.order_id || that.data.info.order_id,
        pay_type: 1
      },
      success (res) {
        wx.hideLoading()
        if (res.data.status === 200) {
          app.wxpay(Object.assign({
            success (payRes) {
              if (payRes.errMsg === 'requestPayment:ok') {
                wx.showToast({
                  title: '支付成功',
                  mask: true
                })
                if (that.data.lostTime) {
                  return wx.navigateBack({
                    delta: 1
                  })
                }
                wx.removeStorageSync('goodsStorage')
                wx.removeStorageSync('useCoupon')
                let url = that.data.options.type === 'bulkpBuy' ? '../bulkPOrder/bulkPOrder' : '../order/order?type=2'
                setTimeout(() => {
                  wx.redirectTo({
                    url
                  })
                }, 1400)
              }
            },
            fail () {
              wx.showToast({
                title: '支付失败'
              })
            }
          }, res.data.data))
        } else {
          app.setToast(that, {content: res.data.msg})
        }
      }
    })
  },
  formSubmit (e) {
    if (!e.detail.value.pwd) return app.setToast(this, {content: '请输入猫豆支付密码'})
    this.catPay(e)
  },
  sd () {
    this.setData({
      maodouPay: false
    })
  },
  inputValue (e) {
    app.inputValue(e, this)
  },
  getinput () {
    this.setData({
      focus: false
    })
    this.setData({
      focus: true
    })
  },
  // 猫豆支付
  catPay (e) {
    let that = this
    app.wxrequest({
      url: app.getUrl().payByOrder,
      data: {
        order_id: that.data.orderInfo.order_id || that.data.info.order_id,
        pay_type: 2,
        pwd: e.detail.value.pwd
      },
      success (res) {
        wx.hideLoading()
        if (res.data.status === 200) {
          wx.showToast({
            title: '支付成功',
            mask: true
          })
          if (that.data.lostTime) {
            return wx.navigateBack({
              delta: 1
            })
          }
          wx.removeStorageSync('goodsStorage')
          wx.removeStorageSync('useCoupon')
          let url = that.data.options.type === 'bulkpBuy' ? '../bulkPOrder/bulkPOrder' : '../order/order?type=2'
          setTimeout(() => {
            wx.redirectTo({
              url
            })
          }, 1400)
        } else {
          app.setToast(that, {content: res.data.msg})
        }
      }
    })
  },
  // 设置红包缓存
  setCoupon () {
    app.su('setCoupon', this.data.coupon)
  },
  // 设置使用红包
  useCoupon () {
    this.setData({
      useCoupon: app.gs('useCoupon') || null
    })
    this.calculateMoney()
  },
  getData (id) {
    let that = this
    app.wxrequest({
      url: app.getUrl().orderDetail,
      data: {
        order_id: id
      },
      success (res) {
        wx.hideLoading()
        if (res.data.status === 200) {
          res.data.data.order_info.add_time = new Date(res.data.data.order_info.add_time * 1000).toLocaleString()
          res.data.data.order_info.pay_time = new Date(res.data.data.order_info.pay_time * 1000).toLocaleString()
          let info = res.data.data.order_info
          that.setData({
            active: info.deliver_type,
            addressInfo: {
              userName: info.consignee,
              telNumber: info.mobile,
              provinceName: info.address
            },
            menuArr: info.goods_list,
            sendMoney: info.shipping_price,

            timeIndex: that.data.timeArr.indexOf(info.delivery_time),
            info: res.data.data.order_info
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
    app.setBar('提交订单')
    /*eslint-disable*/
    // new Date(new Date().getTime() + 1500000)
    // type=bulkpBuy&id=3&num=87&group_by=1&prom_id=1
    this.setData({
      options
    })
    this.setData({
      lostTime: options.type === 'second' ? true : false,
      // menuArr: app.gs('goodsStorage'),
      sendTime: new Date(new Date().getTime() + 1500000).toLocaleString(),
      allMoney: options.money || 0
    })
    if (options.time) {
      this.showLostTime(options.time)
      this.getData(options.id)
    } else {
      this.getCarList(options)
    }
    // this.calculateMoney()
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
    this.useCoupon()
    // if (app.gs('useCoupon')) {
    //   this.setData({
    //     useCoupon: app.gs('useCoupon')
    //   })
    // }
    // if (app.gs('addressInfo')) {
    //   this.setData({
    //     addressInfo: app.gs('addressInfo')
    //   })
    // }
    // this.calculateMoney()
    // TODO: onShow
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide () {
    wx.removeStorageSync('useCoupon')
    // TODO: onHide
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload () {
    wx.removeStorageSync('useCoupon')
    // TODO: onUnload
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh () {
    // TODO: onPullDownRefresh
  }
})
