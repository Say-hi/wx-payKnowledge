// 获取全局应用程序实例对象
const app = getApp()

// 创建页面实例对象
Page({
  /**
   * 页面的初始数据
   */
  data: {
    title: 'userInfo',
    focus: true,
    time: '获取验证码',
    userInfoArr: [
      {
        l: '头像',
        r: app.data.testImg,
        type: 'img'
      },
      {
        l: '姓名',
        r: '阿斯顿发',
        type: 'realName'
      },
      {
        l: '性别',
        r: '男',
        type: 'gender'
      },
      {
        l: '昵称',
        r: '阿斯顿发',
        type: 'nickName'
      },
      {
        l: '手机号码',
        r: '1231442341234',
        type: 'phone'
      },
      {
        l: '个性签名',
        r: '阿斯蒂芬乐扣乐扣撒旦发射阿斯蒂芬乐扣乐扣撒旦发射阿斯蒂芬乐扣乐扣撒旦发射阿斯蒂芬乐扣乐扣撒旦发射',
        type: 'sign'
      }
    ]
  },
  inputValue (e) {
    app.inputValue(e, this)
  },
  getNumber () {
    if (app.checkMobile(this.data.phone)) {
      return wx.showToast({
        title: '请输入正确的11位手机号码'
      })
    }
    this.setData({
      numberDisabled: true
    })
    let time = 60
    let that = this
    let timer = setInterval(function () {
      if (time <= 0) {
        clearInterval(timer)
        that.setData({
          numberDisabled: false,
          time: '重获验证码'
        })
        return
      }
      that.setData({
        time: --time + 's'
      })
    }, 1000)
    // 请求手机验证码
    app.wxrequest({
      url: app.getUrl().getForgetPassword,
      data: {
        mobile: that.data.phone
      },
      success (res) {
        wx.hideLoading()
        if (res.data.status === 200) {
          app.setToast(that, {title: '短信状态', content: '短信发送成功，请注意查收！'})
        } else {
          app.setToast(that, {content: res.data.msg})
        }
      }
    })
  },
  upData () {
    wx.navigateBack({
      delta: 1
    })
  },
  formSubmit (e) {
    if (!e.detail.value.content) return app.setToast(this, {content: '请输入内容后再确定'})
    let t = e.detail.value.content
    let changeData = this.data.userInfoArr
    if (this.data.type === 'realName') {
      changeData[1].r = t
    } else if (this.data.type === 'nickName') {
      changeData[3].r = t
    } else if (this.data.type === 'phone') {
      if (app.checkMobile(t)) return app.setToast(this, {content: '请输入正确的11位手机号'})
      changeData[4].r = t
    } else if (this.data.type === 'sign') {
      changeData[5].r = t
    }
    this.setData({
      userInfoArr: changeData
    })
    this.maskChange()
  },
  maskChange () {
    this.setData({
      maskShow: !this.data.maskShow
    })
  },
  userInfoChange (e) {
    let that = this
    let type = e.currentTarget.dataset.type
    let changeData = this.data.userInfoArr
    if (type === 'img') {
      changeData[0].r = 'https://c.jiangwenqiang.com/workProject/payKnowledge/user_order1.png'
      this.setData({
        userInfoArr: changeData
      })
    } else if (type === 'gender') {
      wx.showActionSheet({
        itemList: ['男', '女'],
        success (res) {
          if (!res.tapIndex) {
            changeData[2].r = '男'
          } else {
            changeData[2].r = '女'
          }
          that.setData({
            userInfoArr: changeData
          })
        },
        fail () {}
      })
    } else {
      this.setData({
        type
      })
      this.maskChange()
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad () {
    app.setBar('个人资料')
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
