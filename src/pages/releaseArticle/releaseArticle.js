// 获取全局应用程序实例对象
const app = getApp()

// 创建页面实例对象
Page({
  /**
   * 页面的初始数据
   */
  data: {
    title: 'releaseArticle',
    classArrText: null,
    classArr: [
      '军事',
      '体育',
      '文化',
      '风俗'
    ],
    releaseImg: 'https://c.jiangwenqiang.com/workProject/payKnowledge/release.png',
    release_add_img: 'https://c.jiangwenqiang.com/workProject/payKnowledge/release_add_img.png',
    upImgArr: [
      app.data.testImg, app.data.testImg, app.data.testImg, app.data.testImg
    ]
  },
  chooseClass (e) {
    this.setData({
      currentClassIndex: e.currentTarget.dataset.index,
      classArrText: this.data.classArr[e.currentTarget.dataset.index]
    })
    this.showClassChange()
  },
  showClassChange () {
    if (this.data.showClass) {
      this.setData({
        showHeight: !this.data.showHeight
      })
      setTimeout(() => {
        this.setData({
          showClass: !this.data.showClass
        })
      }, 520)
    } else {
      this.setData({
        showClass: !this.data.showClass
      })
      setTimeout(() => {
        this.setData({
          showHeight: !this.data.showHeight
        })
      }, 20)
    }
  },
  release () {
    if (!this.data.name) return app.setToast(this, {content: '请输入文章标题'})
    else if (!this.data.content) return app.setToast(this, {content: '请输入文章内容'})
    else if (!this.data.currentClassIndex && this.data.currentIndex !== 0) return app.setToast(this, {content: '请选择文章分类'})
  },
  addImg () {},
  showImg (e) {
    app.showImg(e)
  },
  del (e) {
    this.data.upImgArr.splice(e.currentTarget.dataset.index, 1)
    this.setData({
      upImgArr: this.data.upImgArr
    })
  },
  inputValue (e) {
    app.inputValue(e, this)
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad () {
    app.setBar('发布文章')
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
