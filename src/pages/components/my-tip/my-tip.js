// components/component-tag-name.js
const app = getApp()
Component({
  externalClasses: ['mask', 'mask-in'],
  properties: {
    propUser: {
      type: Object,
      value: {
        name: '默认用户',
        id: -1,
        url: app.data.testImg
      },
      observer (newValue, oldValue, changePath) {
        this._showMask(newValue, oldValue, changePath)
      }
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
