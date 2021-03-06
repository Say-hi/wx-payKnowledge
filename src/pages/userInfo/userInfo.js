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
    let that = this
    let u = this.data.userInfoArr
    app.wxrequest({
      url: app.getUrl().useredit,
      data: {
        code: '123',
        key: app.gs(),
        avatar: u[0].id || u[0].r,
        username: u[1].r,
        sex: u[2].r === '男' ? 1 : 2,
        nickname: u[3].r,
        mobile: u[4].r,
        signature: u[5].r
      },
      success (res) {
        wx.hideLoading()
        if (res.data.code === 1) {
          wx.showToast({
            title: '更新成功'
          })
          // wx.navigateBack()
        } else {
          app.setToast(that, {content: res.data.msg})
        }
      }
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
      app.wxUploadImg((res1, res2) => {
        console.log(res1)
        console.log(res2)
        that.data.userInfoArr[0].r = res2
        that.data.userInfoArr[0]['id'] = res1.id
        that.setData({
          userInfoArr: that.data.userInfoArr
        })
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
  getData () {
    let u = this.data.userInfoArr
    let s = app.gs('userInfoC')
    u[0].r = s.avatar
    u[1].r = s.username
    // u[2].r = s.username
    u[3].r = s.nickname
    u[4].r = s.mobile || '未绑定手机号码'
    u[5].r = s.signature || '暂无个性签名'
    this.setData({
      userInfoArr: u
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad () {
    app.setBar('个人资料')
    app.getSelf(this)
    this.getData()
    // this.setData({
      // user
    // })
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
