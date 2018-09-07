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
    upImgArr: []
  },
  chooseClass (e) {
    this.setData({
      classArrId: e.currentTarget.dataset.id,
      currentClassIndex: e.currentTarget.dataset.index,
      classArrText: this.data.classArr[e.currentTarget.dataset.index].name
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
    else if (!this.data.classArrId) return app.setToast(this, {content: '请选择文章分类'})
    let that = this
    let s = ''
    for (let v of this.data.upImgArr) {
      s += v.id + ','
    }
    app.wxrequest({
      url: app.getUrl().operationarticle,
      data: {
        key: app.gs(),
        category_id: that.data.classArrId,
        column_id: that.data.columnId,
        title: that.data.name,
        pictures: s,
        content: that.data.content
      },
      success (res) {
        wx.hideLoading()
        if (res.data.code === 1) {
          wx.showToast({
            title: '发布待审核',
            mask: true
          })
          setTimeout(() => {
            wx.navigateBack()
          }, 1000)
        } else {
          app.setToast(that, {content: res.data.msg})
        }
      }
    })
  },
  addImg () {
    let that = this
    app.wxUploadImg((res, v) => {
      that.data.upImgArr.push({
        url: v,
        id: res.id
      })
      that.setData({
        upImgArr: that.data.upImgArr
      })
    })
  },
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
  getLeft () {
    let that = this
    app.wxrequest({
      url: app.getUrl().getArticleCagegory,
      data: {},
      success (res) {
        wx.hideLoading()
        if (res.data.code === 1) {
          that.setData({
            classArr: res.data.data
          }, that.getUserVip)
        } else {
          app.setToast(that, {content: res.data.msg})
        }
      }
    })
  },
  getId () {
    let that = this
    app.wxrequest({
      url: app.getUrl().usercolumns,
      data: {
        key: app.gs()
      },
      success (res) {
        wx.hideLoading()
        if (res.data.code === 1) {
          if (res.data.data.data.length <= 0) {
            that.setData({
              noRelease: true
            })
            wx.navigateTo({
              url: '../createColunms/createColunms'
            })
            return
          }
          that.setData({
            noRelease: false,
            columnId: res.data.data.data[0].id
          }, that.getLeft)
        } else {
          app.setToast(that, {content: res.data.msg})
        }
      }
    })
  },
  getUserVip () {
    let that = this
    app.wxrequest({
      url: app.getUrl().usergroup,
      data: {
        key: app.gs()
      },
      success (res) {
        wx.hideLoading()
        if (res.data.code === 1) {
          if (res.data.data.user.is_column <= 0) {
            app.setToast(that, {content: '您的等级不可发布文章'}, 2000)
            setTimeout(() => {
              wx.navigateBack()
            }, 1500)
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
  onLoad () {
    app.setBar('发布文章')
    app.getSelf(this)
    this.getId()
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
