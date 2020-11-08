Component({
  properties: {
  },
  data: {
  },
  methods: {
    toMySecret () {
      wx.navigateTo({
        url: '/pages/secret/index'
      })
    },
    closePop () {
      this.triggerEvent('closePop')
    },
    again () {
      this.triggerEvent('closePop', true)
    }
  }
})
