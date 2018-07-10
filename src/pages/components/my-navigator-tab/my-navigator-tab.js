// components/component-tag-name.js
const app = getApp()
Component({
  externalClasses: ['mask', 'mask-in'],
  properties: {
    propNav: {
      type: Array,
      value: [
        {
          i: 'https://c.jiangwenqiang.com/workProject/payKnowledge/bottom1.png',
          t: '发现',
          url: '../index/index',
          active: true
        },
        {
          i: 'https://c.jiangwenqiang.com/workProject/payKnowledge/bottom2.png',
          t: '分类',
          url: '../articleCategories/articleCategories'
        },
        {
          i: 'https://c.jiangwenqiang.com/workProject/payKnowledge/bottom3.png',
          t: '商城',
          url: '../shop/shop'
        },
        {
          i: 'https://c.jiangwenqiang.com/workProject/payKnowledge/bottom4.png',
          t: '我的',
          url: '../bulkPurchase/bulkPurchase'
        }
      ]
    }
  },
  data: {
    testImg: app.data.testImg,
    naozai: 'https://c.jiangwenqiang.com/workProject/payKnowledge/naozai.png',
    currentIndex: -1,
    numArr: ['2', '5', '10', '20', '50', '100']
  },
  methods: {
    _choosePay (e) {
      this.setData({
        currentIndex: e.currentTarget.dataset.index
      })
    },
    _formSubmit () {

    },
    _close () {
      this.setData({
        show: false,
        currentIndex: -1
      })
    },
    _showMask (newValue, oldValue, changePath) {
      if (!newValue) {
        this.setData({
          show: false
        })
      } else {
        this.setData({
          show: true
        })
      }
    }
  }
})
