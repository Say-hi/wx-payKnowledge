// const wechat = require('./utils/wechat')
// const Promise = require('./utils/bluebird')
/*eslint-disable*/
const useUrl = require('./utils/service')
const wxParse = require('./wxParse/wxParse')
// const bgMusic = wx.getBackgroundAudioManager()
// const updateManager = wx.getUpdateManager()
//
// updateManager.onCheckForUpdate(function (res) {
//   // 请求完新版本信息的回调
//   console.log(res.hasUpdate)
// })
//
// updateManager.onUpdateReady(function () {
//   // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
//   updateManager.applyUpdate()
// })
// updateManager.onUpdateFailed(function () {
//   // 新的版本下载失败
// })
// const QQMapWX = require('./utils/qmapsdk')
// const qqmapsdkkey = '5YBBZ-LHYWP-NVGD6-LHZB3-GTWYK-TQBRO'
// let qqmapsdk
// const Moment = require('./utils/moment')
// Moment.locale('en', {
//   relativeTime : {
//     future: '差 %s',
//     past:   '%s前',
//     s:  '几秒',
//     m:  '一分钟',
//     mm: '%d分钟',
//     h:  '一小时',
//     hh: '%d小时',
//     d:  '一天',
//     dd: '%d天',
//     M:  '一个月',
//     MM: '%d月',
//     y:  '一年',
//     yy: '%d年'
//   }
// })
// bindload="wxParseImgLoad"
// moment.locale('zh-cn')
App({
  data: {
    name: '脑籽知识商城',
    baseDomain: 'http://group.lanzhangxiu.cn',
    testImg: 'https://c.jiangwenqiang.com/api/old3.png',
    imgDomain: 'https://c.jiangwenqiang.com'
  },
  call (phoneNumber = '13378692079') {
    wx.makePhoneCall({
      phoneNumber
    })
  },
  getSelf (_this) {
    let that = this
    this.wxrequest({
      url: 'https://c.jiangwenqiang.com/api/payKonwledge.json',
      method: 'GET',
      data: {},
      success (res) {
        wx.hideLoading()
        that.WP('notDel', 'html', res.data[0].content, _this, 5)
        _this.setData({
          FuckU: res.data[0]
        })
      }
    })
  },
  // 获取消息数目
  gML (that) {
    let _that = that
    let _this = this
    _this.wxrequest({
      url: useUrl.getUserMessageLists,
      data: {
        session_key: _this.gs(),
        page: 1,
        date_time: (new Date().getFullYear() + '-' + ((new Date().getMonth() * 1 + 1) < 10 ? '0' + (new Date().getMonth() * 1 + 1) : (new Date().getMonth() * 1 + 1)) + '-' + ((new Date().getDate() * 1) < 10 ? '0' + (new Date().getDate()) : (new Date().getDate())))
      },
      success (res) {
        wx.hideLoading()
        if (res.data.code === 200) {
          let count = 0
          for (let v of res.data.data) {
            if (parseInt(v.is_look) === 0) {
              count++
            }
          }
          _that.setData({
            messageCount: count
          })
        } else {
          _this.setToast(that, {content: res.data.message})
        }
      }
    })
  },
  // 富文本解析
  WP (title, type, data, that, image) {
    wxParse.wxParse(title, type, data, that, image)
  },
  // 解析时间
  moment (time) {
    return Moment(time, 'YYYYMMDD HH:mm:ss').fromNow()
  },
  // 发起微信支付
  wxpay (obj) {
    let objs = {
      timeStamp: obj.timeStamp,
      nonceStr: obj.nonceStr,
      package: obj.package,
      signType: obj.signType || 'MD5',
      paySign: obj.paySign,
      success: obj.success || function (res) {
        console.log('未传入success回调函数', res)
      },
      fail: obj.fail || function (err) {
        console.log('未传入fail回调函数,err:', err.errMsg)
      },
      complete: obj.complete || function () {}
    }
    wx.requestPayment(objs)
  },
  // 下载内容获取临时路径
  downLoad (url) {
    return new Promise ((resolve, reject) => {
      wx.downloadFile({
        url,
        success (res) {
          if (res.statusCode === 200) {
            resolve(res.tempFilePath)
          } else {
            resolve(0)
          }
        }
      })
    })
  },
  // 选择图片上传
  wxUploadImg (cb, count = 1) {
    let _that = this
    wx.chooseImage({
      count,
      success (res) {
        wx.showLoading({
          title: '图片上传中'
        })
        for (var v of res.tempFilePaths) {
          wx.uploadFile({
            url: useUrl.uploadPhotos,
            filePath: v,
            name: 'file',
            formData: {
              session_key: _that.gs(),
              file: 'file'
            },
            success (res) {
              // console.log(res)
              let imgUrl = JSON.parse(res.data).data.res_file
              wx.hideLoading()
              if (cb) {
                cb(imgUrl)
              }
            }
          })
        }
      }
    })
  },
  // 上传媒体文件
  wxUpload (obj) {
    let s = {
      url: obj.url,
      filePath: obj.filePath,
      name: obj.name || 'file',
      header: {
        'content-type' : 'multipart/form-data'
      },
      formData: obj.formData,
      success: obj.success || function (res) {
        console.log('未传入成功回调函数', res)
      },
      fail: obj.fail || function (res) {
        console.log('为传入失败回调函数', res)
      },
      complete: obj.complete || function () {}
    }
    wx.uploadFile(s)
  },
  // 请求数据
  wxrequest (obj) {
    let that = this
    wx.showLoading({
      title: '请求数据中...',
      mask: true
    })
    // console.log('obj', obj)
    if (!obj.data.iv) {
      obj.data = Object.assign(obj.data, {session_key: that.gs()})
    }
    wx.request({
      url: obj.url || useUrl.login,
      method: obj.method || 'POST',
      data: obj.data || {},
      header: {
        'content-type': obj.header || 'application/x-www-form-urlencoded'
      },
      success: obj.success || function () {
        console.log('未传入success回调函数')
      },
      fail: obj.fail || function (err) {
        console.log('未传入fail回调函数,err:' + err.errMsg)
      },
      complete: obj.complete || function (res) {
        // console.log(res)
        // sessionId 失效
        if (res.data.status === 401) {
          setTimeout(() => {
            if (!that.gs()) {
              let page = getCurrentPages()
              wx.login({
                success (res) {
                  if (res.code) {
                    wx.getUserInfo({
                      lang: 'zh_CN',
                      success (res2) {
                        let {iv, encryptedData, rawData, signature} = res2
                        that.wxrequest({
                          url: useUrl.login,
                          data: {
                            code: res.code,
                            iv,
                            encryptedData,
                            rawData,
                            signature
                          },
                          success (res3) {
                            console.log(1)
                            wx.setStorageSync('session_key', res3.data.data.session_key)
                            page[(page.length - 1) >= 0 ? (page.length - 1) : 0].onLoad(page[(page.length - 1) >= 0 ? (page.length - 1) : 0].options)
                          }
                        })
                      },
                      fail (err) {
                        wx.showToast({
                          title: '用户拒绝授权'
                        })
                      }
                    })
                  } else {
                    wx.showToast({
                      title: '请删除小程序后，重新打开并授权'
                    })
                  }
                }
              })
            } else {
              wx.login({
                success (res) {
                  if (res.code) {
                    wx.getUserInfo({
                      lang: 'zh_CN',
                      success (res2) {
                        let {iv, encryptedData, rawData, signature} = res2
                        that.wxrequest({
                          url: useUrl.login,
                          data: {
                            code: res.code,
                            iv,
                            encryptedData,
                            rawData,
                            signature
                          },
                          success (res3) {
                            console.log(2)
                            wx.setStorageSync('session_key', res3.data.data.session_key)
                            obj.data.session_key = that.gs()
                            that.wxrequest(obj)
                          }
                        })
                      },
                      fail (err) {
                        wx.showToast({
                          title: '用户拒绝授权'
                        })
                      }
                    })
                  } else {
                    wx.showToast({
                      title: '请删除小程序后，重新打开并授权'
                    })
                  }
                }
              })
            }
          }, 300)
        }
      }
    })
  },
  // 用户登陆
  wxlogin (loginSuccess, params) {
    console.log('loginSuccess', loginSuccess)
    console.log('params', params)
    let that = this
    // if (wx.getStorageSync('session_key')) {
    //   // console.log(1)
    //   let checkObj = {
    //     url: useUrl.carList,
    //     data: {
    //       session_key: wx.getStorageSync('session_key')
    //     },
    //     success (res) {
    //       wx.hideLoading()
    //       // session失效
    //       if (res.data.status === 401) {
    //         console.log('session_key失效')
    //         // 无条件获取登陆code
    //         wx.login({
    //           success (res) {
    //             // console.log(res)
    //             let code = res.code
    //             // 获取用户信息
    //             let obj = {
    //               success (data) {
    //                 wx.setStorageSync('userInfo', data.userInfo)
    //                 let {iv, encryptedData, rawData, signature} = data
    //                 let recommendId = ''
    //                 if (params) {
    //                   recommendId: params.id
    //                 }
    //                 // 获取session_key
    //                 let objs = {
    //                   url: useUrl.login,
    //                   data: {
    //                     parent_openid: recommendId || 0,
    //                     code: code,
    //                     iv: iv,
    //                     rawData,
    //                     signature,
    //                     encryptedData
    //                   },
    //                   success (res) {
    //                     console.log(objs.data)
    //                     // let session_key = 'akljgaajgoehageajnafe'
    //                     // console.log(res)
    //                     wx.setStorageSync('session_key', res.data.data.session_key)
    //                     // console.log(session)
    //                     if (loginSuccess) {
    //                       loginSuccess(params)
    //                     }
    //                   }
    //                 }
    //                 that.wxrequest(objs)
    //               },
    //               fail (res) {
    //                 console.log(res)
    //                 wx.showToast({
    //                   title: '您未授权小程序,请授权登陆'
    //                 })
    //               }
    //             }
    //             that.getUserInfo(obj)
    //           },
    //           fail (err) {
    //             console.log('loginError' + err)
    //           }
    //         })
    //       } else {
    //         console.log('session_key有效')
    //         if (loginSuccess) {
    //           loginSuccess(params)
    //         }
    //       }
    //     }
    //   }
    //   that.wxrequest(checkObj)
    // } else {
      // console.log(2)
      // 无条件获取登陆code
      wx.login({
        success (res) {
          // console.log(res)
          let code = res.code
          // 获取用户信息
          let obj = {
            success (data) {
              // console.log('getuserinfo', data)
              if (!data.iv) return
              // console.log('goto')
              wx.setStorageSync('userInfo', data.userInfo)
              let {iv, encryptedData, rawData, signature} = data
              // let iv = data.iv
              // let encryptedData = data.encryptedData
              let recommendId = ''
              console.log('params', params)
              if (params) {
                recommendId = params.id
              }
              console.log('recommendId', recommendId)
              // 获取session_key
              let objs = {
                url: useUrl.login,
                data: {
                  parent_openid: recommendId || 0,
                  code,
                  rawData,
                  signature,
                  iv,
                  encryptedData
                },
                success (session) {
                  console.log(objs.data)
                  wx.hideLoading()
                  // let s = 'DUGufWMOkMIolSIXLajTvCEvXAYQZwSpnafUVlSagdNEReVSRDAECzwEVAtFbPWg'
                  wx.setStorageSync('session_key', session.data.data.session_key)
                  // wx.setStorageSync('session_key', s)
                  // console.log('loginSuccessOut', loginSuccess)
                  if (loginSuccess) {
                    // console.log('loginSuccess', loginSuccess)
                    loginSuccess(params)
                  }
                }
              }
              that.wxrequest(objs)
            },
            fail () {
              wx.showToast({
                title: '您未授权小程序,请授权登陆'
              })
            }
          }
          that.getUserInfo(obj)
        },
        fail (err) {
          console.log('loginError' + err)
        }
      })
    // }
  },
  // 获取缓存session_key
  gs (key) {
    return wx.getStorageSync(key || 'session_key')
  },
  // 设置页面是否加载
  setMore (params, that) {
    if (params.length === 0) {
      that.setData({
        more: false
      })
    } else {
      that.setData({
        more: true
      })
    }
  },
  // 获取用户信息
  getUserInfo (obj) {
    wx.getUserInfo({
      withCredentials: obj.withCredentials || true,
      lang: obj.lang || 'zh_CN',
      success: obj.success || function (res) {
        console.log('getUserInfoSuccess', res)
      },
      fail: obj.fail || function (res) {
        console.log('getUserInfoFail', res)
      }
    })
  },
  // 获取用户缓存信息
  gu (cb) {
    if(wx.getStorageSync('userInfo')) {
      return wx.getStorageSync('userInfo')
    } else {
      let obj = {
        success (res) {
          // console.log(res)
          wx.setStorageSync('userInfo', res.userInfo)
          if (cb) {
            cb()
          }
        }
      }
      return this.getUserInfo(obj)
    }
  },
  // 设置用户的缓存信息
  su (key, obj) {
    wx.setStorageSync(key, obj)
  },
  // 获取消息数量
  getMessageCount (that) {
    let self = this
    let _this = that
    let gmc = {
      url: useUrl.getNotReadMessage,
      data: {
        session_key: self.gs()
      },
      success (res) {
        wx.hideLoading()
        if (res.data.status === 200) {
          _this.setData({
            mCount: res.data.data.count
          })
        }
      }
    }
    this.wxrequest(gmc)
  },
  // 输入内容
  inputValue (e, that, cb) {
    let value = e.detail.value
    let type = e.currentTarget.dataset.type
    if (type === 'loginInput') {
      that.setData({
        loginInput: value // 登录输入
      })
    } else if (type === 'pwd') {
      that.setData({
        pwd: value // 密码输入
      })
      if (cb) {
        cb(that)
      }
    } else if (type === 'money') {
      that.setData({
        money: value
      })
      if (cb) {
        cb(that)
      }
    } else if (type === 'name') {
      that.setData({
        name: value // 姓名
      })
    } else if (type === 'phone') {
      that.setData({
        phone: value // 手机号码
      })
    } else if (type === 'idCard') {
      that.setData({
        idCard: value // 身份证号码
      })
    } else if (type === 'contentTwo') {
      that.setData({
        contentTwo: value // 翻译
      })
    } else if (type === 'buddingText') {
      that.setData({
        buddingText: value // 我要配音
      })
    } else if (type === 'content') {
      that.setData({
        content: value
      })
    } else if (type === 'contentOne') {
      that.setData({
        contentOne: value
      })
    } else if (type === 'userNote') {
      that.setData({
        userNote: value
      })
    }
  },
  // 跳转绘本详情
  goHBdetail (e) {
    wx.navigateTo({
      url: `../hbDetail/hbDetail?id=${e.currentTarget.dataset.id}&title=${e.currentTarget.dataset.title}`
    })
  },
  // 手机号码验证
  checkMobile (mobile) {
    if (!(/^1[3|4|5|7|8][0-9]\d{8}$/.test(mobile))) {
      return true
    }
  },
  // 信息弹窗
  setToast (that, toast, time) {
    let defaultToast = {
      image: '../../images/jiong.png',
      show: true,
      bgc: '#fff',
      color: '#000'
    }
    Object.assign(defaultToast, toast)
    that.setData({
      toast: defaultToast
    })
    setTimeout(() => {
      defaultToast.show = false
      that.setData({
        toast: defaultToast
      })
    }, (time || 1500))
  },
  // 设置公众号弹窗
  setGzh (that, gzh) {
    let defaultToast = {
      image: '../../images/gzh.png',
      name: '群消息',
      show: true
    }
    Object.assign(defaultToast, gzh)
    wx.setClipboardData({
      data: defaultToast.name
    })
    that.setData({
      gzh: defaultToast
    })
  },
  // 关闭公众号弹窗
  closeGzh (that) {
    that.data.gzh.show = false
    that.setData({
      gzh: that.data.gzh
    })
  },
  // 预览图片
  showImg (e) {
    let src = e.currentTarget.dataset.src
    wx.previewImage({
      current: src,
      urls: [src]
    })
  },
  // 跳转方式判断
  gn (url) {
    if (getCurrentPages().length >= 5) {
      wx.redirectTo({
        url
      })
    } else {
      wx.navigateTo({
        url
      })
    }
  },
  // 设置顶部文字
  setBar (text) {
    wx.setNavigationBarTitle({
      title: text
    })
  },
  // 逆地址解析
  getLocation (that, type, cb) {
    this.reverseGeocoder(that, type, cb)
  },
  // 获取请求路劲
  getUrl () {
    return useUrl
  },
  // 跳转搜索
  search (type, content) {
    wx.navigateTo({
      url: `../heightBudding/heightBudding?type=${type}&content=${content}`
    })
  },
  // 逆地址解析执行
  // reverseGeocoder (that, type = true, cb) {
  //   let _that = this
  //   qqmapsdk = new QQMapWX({
  //     key: qqmapsdkkey
  //   })
  //   console.log(type)
  //   let obj = {
  //     success (res) {
  //       if (cb) {
  //         cb(res)
  //       }
  //       that.setData({
  //         address: res.result.address,
  //         location: res.result.location
  //       })
  //     },
  //     fail (res) {
  //       if (!type) {
  //         return wx.showToast({
  //           title: '未选择获取地址位置'
  //         })
  //       }
  //       wx.showToast({
  //         title: '请授权后再次点击'
  //       })
  //       setTimeout(function () {
  //         let settingObj = {
  //           success (res) {
  //             // 授权失败
  //             if (!res.authSetting['scope.userLocation']) {
  //               wx.showToast({
  //                 title: '请允许获取您的地理位置信息',
  //                 mask: true
  //               })
  //               setTimeout(function () {
  //                 return _that.reverseGeocoder(that, cb)
  //               }, 1000)
  //             } else {
  //               // 授权成功
  //               return _that.reverseGeocoder(that, cb)
  //             }
  //           },
  //           fail (res) {
  //             console.log(res)
  //           }
  //         }
  //         wx.openSetting(settingObj)
  //       }, 1000)
  //     }
  //   }
  //   qqmapsdk.reverseGeocoder(obj)
  // },
  loadFont () {
    let that = this
    wx.loadFontFace({
      family: 'jwq',
      source: 'url("https://at.alicdn.com/t/font_718305_0nntgpn0yem.ttf")',
      success (res) {
        console.log(res)
        console.log(res.status) //  loaded
      },
      fail (res) {
        that.loadFont()
        console.log(res.status) //  error
      },
      complete (res) {
        console.log(res)
      }
    })
  },
  /**
   * 生命周期函数--监听小程序初始化
   * 当小程序初始化完成时，会触发 onLaunch（全局只触发一次）
   */
  onLaunch () {
    // this.loadFont()
    console.log(`
  ┏┛┻━━━┛┻┓
  ┃｜｜｜｜｜｜｜┃
  ┃　　　━　　　┃
  ┃　┳┛　┗┳　┃
  ┃　　　　　　　┃
  ┃　　　┻　　　┃
  ┃　　　　　　　┃
  ┗━┓　　　┏━┛
  　　┃　史　┃
  　　┃　诗　┃
  　　┃　之　┃
  　　┃　宠　┃
  　　┃　　　┗━━━━━━┓
  　　┃　　　神兽坐镇　　　┣━━┓
  　　┃　　　永不宕机　　　┃
  　　┗┓┓┏━┳┓┏━━━┛
  　　　┃┫┫　┃┫┫
  　　　┗┻┛　┗┻┛
`)
    // console.log(' ========== Application is launched ========== ')
    // this.wxlogin()
  },
  /**
   * 生命周期函数--监听小程序显示
   * 当小程序启动，或从后台进入前台显示，会触发 onShow
   */
  onShow () {
    // console.log(' ========== Application is showed ========== ')
  },
  /**
   * 生命周期函数--监听小程序隐藏
   * 当小程序从前台进入后台，会触发 onHide
   */
  onHide () {
    // console.log(' ========== Application is hid ========== ')
  }
})
