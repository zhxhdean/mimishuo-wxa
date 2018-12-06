Component({
  properties: {

  },
  data: {
    currentTab: 0,
    items: [
      {
        "iconPath": "../../images/icon/tabbar_square.png",
        "selectedIconPath": "../../images/icon/tabbar_square_on.png",
        "text": ""
      },
      {
        "iconPath": "../../images/icon/tabbar_me.png",
        "selectedIconPath": "../../images/icon/tabbar_me_on.png",
        "text": ""
      }
    ]
  },
  methods: {
    swichNav (e) {
      console.log(e)
      let self = this;
      if (this.data.currentTab === e.target.dataset.current) {
        return false;
      } else {
        self.setData({
          currentTab: e.target.dataset.current
        })
      }
    }
  }
})
