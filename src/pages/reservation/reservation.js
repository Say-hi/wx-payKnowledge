// 获取全局应用程序实例对象
const app = getApp()

// 创建页面实例对象
Page({
  /**
   * 页面的初始数据
   */
  data: {
    conditionArr: [
      {
        t: '阿斯顿发撒旦法阿斯顿发撒旦法阿斯顿发撒旦法阿斯顿发撒旦法阿斯顿发撒旦法阿斯顿发撒旦法',
        choose: false
      },
      {
        t: '阿斯顿发'
      }
    ],
    title: 'reservation'
  },
  choose (e) {
    let that = this
    that.data.conditionArr[e.currentTarget.dataset.index].choose = !that.data.conditionArr[e.currentTarget.dataset.index].choose
    this.setData({
      conditionArr: that.data.conditionArr
    })
  },

  formSubmit (e) {
    let check = true
    for (let v of this.data.conditionArr) {
      if (v.choose) {
        check = false
        break
      }
    }
    if (!e.detail.value.name) return app.setToast(this, {content: '请输入您的姓名'})
    else if (app.checkMobile(e.detail.value.phone)) return app.setToast(this, {content: '请填写正确的11位手机号'})
    else if (!e.detail.value.condition && check) return app.setToast(this, {content: '请至少填写或勾选一个条件'})
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad () {
    app.setBar('预约报名')
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
