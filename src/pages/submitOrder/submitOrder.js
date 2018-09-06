// 获取全局应用程序实例对象
const app = getApp()

// 创建页面实例对象
Page({
  /**
   * 页面的初始数据
   */
  data: {
    imgDomain: app.data.imgDomain,
    shopImg: 'https://c.jiangwenqiang.com/workProject/payKnowledge/gd1.png',
    testImg: app.data.testImg,
    active: 2,
    sendMoney: 0,
    timeIndex: 0,
    shopIndex: 0,
    focus: true,
    orderInfo: {},
    timeArr: [],
    shopArr: [{pickup_name: '选择您附近的门店地址'}],
    payBottom: [
      {
        img: 'https://c.jiangwenqiang.com/workProject/payKnowledge/paybottom2.png',
        t: '账户余额',
        index: 0
      },
      {
        img: 'https://c.jiangwenqiang.com/workProject/payKnowledge/paybottom1.png',
        t: '微信支付',
        index: 1
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
    if (!this.data.addressInfo) return app.setToast(this, {content: '请选择收货地址'})
    this.payShow()
  },
  pay (e) {
    if (this.data.options.type === 'second') return this.secondPay(e)
    let that = this
    let data = {
      key: app.gs(),
      province: that.data.addressInfo.provinceName,
      city: that.data.addressInfo.cityName,
      area: that.data.addressInfo.countyName,
      address: that.data.addressInfo.detailInfo,
      name: that.data.addressInfo.userName,
      phone: that.data.addressInfo.telNumber,
      // cart_id: that.data.options.cart_id || '',
      message: that.data.pwd || '无留言',
      integral: this.data.fuck_score ? this.data.order.integral : 0,
      ticket_id: this.data.useCoupon ? this.data.useCoupon.id : '',
      pay_type: e.currentTarget.dataset.index
    }
    if (this.data.options.seckill) {
      data = Object.assign(data, {
        goods_id: that.data.options.goods_id,
        number: that.data.options.num
      })
    } else {
      data = Object.assign(data, {
        cart_id: that.data.options.cart_id
      })
    }
    app.wxrequest({
      url: app.getUrl().create,
      data,
      success (res) {
        wx.hideLoading()
        if (res.data.code === 1) {
          if (e.currentTarget.dataset.index * 1 === 1) {
            app.wxpay(Object.assign(JSON.parse(res.data.data), {
              success (res) {
                wx.showToast({
                  title: '购买成功',
                  mask: true
                })
                setTimeout(() => {
                  wx.redirectTo({
                    url: '../order/order?type=2'
                  })
                }, 1200)
              },
              fail () {
                wx.showToast({
                  title: '支付失败',
                  mask: true
                })
                setTimeout(() => {
                  wx.redirectTo({
                    url: '../order/order?type=1'
                  })
                }, 1200)
              }
            }))
          } else if (e.currentTarget.dataset.index * 1 === 0) {
            if (res.data.code === 1) {
              wx.showToast({
                title: '购买成功',
                mask: true
              })
              setTimeout(() => {
                wx.redirectTo({
                  url: '../order/order?type=2'
                })
              }, 1200)
            } else {
              wx.showToast({
                title: '支付失败',
                mask: true
              })
              setTimeout(() => {
                wx.redirectTo({
                  url: '../order/order?type=1'
                })
              }, 1200)
            }
          }
        } else {
          app.setToast(that, {content: res.data.msg})
        }
      }
    })
  },
  // 计算价格
  calculateMoney () {
    let money = (this.data.useCoupon ? this.data.fuck_score ? this.data.order.cart.total - this.data.useCoupon.amount - (this.data.order.integral * this.data.order.integral_transform) : this.data.order.cart.total - this.data.useCoupon.amount : this.data.fuck_score ? this.data.order.cart.total - (this.data.order.integral * this.data.order.integral_transform) : this.data.order.cart.total).toFixed(2)
    if (money <= 0) {
      money = '0.00'
    }
    this.setData({
      calculateMoney: money
    })
  },
  // 倒计时
  showLostTime (startTime) {
    let endTime = startTime * 1000 + 3600000 // 超时1小时
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
  setCoupon (e) {
    if (this.data.order.ticket.length < 1) return app.setToast(this, {content: '您没有适合此订单的优惠卷'})
    app.su('setCoupon', this.data.order.ticket)
    wx.navigateTo({
      url: e.currentTarget.dataset.url
    })
  },
  // 设置使用红包
  useCoupon () {
    this.setData({
      useCoupon: app.gs('useCoupon') || null
    })
    setTimeout(() => {
      this.calculateMoney()
    }, 50)
  },
  // 创建订单
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
  // 先确认订单
  getConfirm () {
    let that = this
    let data = {}
    if (this.data.options.type === 'second') return this.getSecond()
    if (that.data.options.cart_id) {
      data = {
        key: app.gs(),
        cart_id: that.data.options.cart_id || ''
      }
    } else if (that.data.options.seckill > 0) {
      data = {
        key: app.gs(),
        number: that.data.options.num,
        goods_id: that.data.options.goods_id,
        seckill_id: that.data.options.seckill
      }
    } else if (that.data.options.seckill < 0) {
      data = {
        key: app.gs(),
        number: that.data.options.num,
        goods_id: that.data.options.goods_id
      }
    }
    app.wxrequest({
      url: app.getUrl().confim,
      data,
      success (res) {
        wx.hideLoading()
        if (res.data.code === 1) {
          that.setData({
            order: res.data.data,
            addressInfo: app.gs('addressInfo')
          }, that.calculateMoney)
        } else {
          app.setToast(that, {content: res.data.msg})
        }
      }
    })
  },
  // getSecond
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
          if (res.data.data.status >= 1) {
            wx.showToast({
              title: '已完成支付',
              mask: true
            })
            setTimeout(() => {
              wx.navigateBack()
            }, 1000)
            return
          }
          that.setData({
            addressInfo: {
              userName: res.data.data.name,
              telNumber: res.data.data.phone,
              provinceName: res.data.data.province,
              cityName: res.data.data.city,
              detailInfo: res.data.data.address,
              countyName: res.data.data.area
            },
            order: res.data.data
          })
        } else {
          app.setToast(that, {content: res.data.msg})
        }
      }
    })
  },
  secondPay (e) {
    let that = this
    app.wxrequest({
      url: app.getUrl().doPay,
      data: {
        key: app.gs(),
        order_id: that.data.options.id,
        pay_type: e.currentTarget.dataset.index
      },
      success (res) {
        wx.hideLoading()
        if (res.data.code === 1) {
          if (e.currentTarget.dataset.index * 1 === 1) {
            app.wxpay(Object.assign(JSON.parse(res.data.data), {
              success (res) {
                wx.showToast({
                  title: '购买成功',
                  mask: true
                })
                setTimeout(() => {
                  wx.navigateBack()
                }, 1200)
              },
              fail () {
                wx.showToast({
                  title: '支付失败',
                  mask: true
                })
                setTimeout(() => {
                  wx.navigateBack()
                }, 1200)
              }
            }))
          } else if (e.currentTarget.dataset.index * 1 === 0) {
            if (res.data.code === 1) {
              wx.showToast({
                title: '购买成功',
                mask: true
              })
              setTimeout(() => {
                wx.navigateBack()
              }, 1200)
            } else {
              wx.showToast({
                title: '支付失败',
                mask: true
              })
              setTimeout(() => {
                wx.navigateBack()
              }, 1200)
            }
          }
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
    }, this.getConfirm)
    // this.setData({
    //   lostTime: options.type === 'second' ? true : false,
    //   // menuArr: app.gs('goodsStorage'),
    //   sendTime: new Date(new Date().getTime() + 1500000).toLocaleString(),
    //   allMoney: options.money || 0
    // })
    // if (options.time) {
    //   this.showLostTime(options.time)
    //   this.getData(options.id)
    // } else {
    //   this.getCarList(options)
    // }
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
