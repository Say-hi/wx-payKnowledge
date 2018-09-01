// 获取全局应用程序实例对象
const app = getApp()

// 创建页面实例对象
Page({
  /**
   * 页面的初始数据
   */
  data: {
    imgDomain: app.data.imgDomain,
    testImg: app.data.testImg
  },
  showApply () {
    this.setData({
      apply: !this.data.apply
    })
  },
  sexChoose () {
    let that = this
    wx.showActionSheet({
      itemList: ['男', '女'],
      itemColor: '#cd9b00',
      success (res) {
        that.setData({
          sexChoose: res.tapIndex === 0 ? '男' : res.tapIndex === 1 ? '女' : ''
        })
      }
    })
  },
  formSubmit (e) {
    let {name, sex, work, phone} = e.detail.value
    if (!name) return app.setToast(this, {content: '请输入您的姓名'})
    else if (!sex) return app.setToast(this, {content: '请输入您的性别（男或女）'})
    else if (!work) return app.setToast(this, {content: '请输入您的工作'})
    else if (app.checkMobile(phone)) return app.setToast(this, {content: '请输入正确的手机号码'})
    let that = this
    console.log(1)
    wx.showActionSheet({
      itemList: ['微信支付', '余额支付'],
      itemColor: '#cd9b00',
      success (res) {
        console.log(res)
        if (res.tapIndex * 1 === 0) {
          app.wxrequest({
            url: app.getUrl().activityApply,
            data: {
              key: app.gs(),
              activity_id: that.data.info.id,
              name,
              work,
              phone,
              sex: sex === '男' ? 1 : 2,
              pay_type: 1
            },
            success (res) {
              wx.hideLoading()
              if (res.data.code === 1) {
                app.wxpay(Object.assign(JSON.parse(res.data.data), {
                  success (res) {
                    wx.showToast({
                      title: '报名成功'
                    })
                    setTimeout(() => {
                      wx.navigateBack()
                    }, 1200)
                    console.log('success', res)
                  },
                  fail (res) {
                    wx.showToast({
                      title: '支付失败'
                    })
                    console.log('fail', res)
                  }
                }))
              } else {
                app.setToast(that, {content: res.data.msg})
              }
            }
          })
        } else if (res.tapIndex * 1 === 1) {
          app.wxrequest({
            url: app.getUrl().activityApply,
            data: {
              key: app.gs(),
              activity_id: that.data.info.id,
              name,
              work,
              phone,
              sex: sex === '男' ? 1 : 2,
              pay_type: 0
            },
            success (res) {
              wx.hideLoading()
              if (res.data.code === 1) {
                wx.showToast({
                  title: '报名成功'
                })
                setTimeout(() => {
                  wx.navigateBack()
                }, 1200)
              } else {
                wx.showToast({
                  title: '支付失败'
                })
                app.setToast(that, {content: res.data.msg})
              }
            }
          })
        }
      }
    })
  },
  getDetail (id) {
    let that = this
    app.wxrequest({
      url: app.getUrl().activity,
      data: {
        key: app.gs(),
        id: id
      },
      success (res) {
        wx.hideLoading()
        if (res.data.code === 1) {
          app.WP('content', 'html', res.data.data.content, that, 0)
          res.data.data.start_time = app.momentFormat(res.data.data.start_time, 'YYYY.M.D')
          res.data.data.end_time = app.momentFormat(res.data.data.end_time, 'YYYY.M.D')
          that.setData({
            info: res.data.data
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
    app.setBar('活动详情')
    app.getSelf(this)
    this.getDetail(options.id)
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
