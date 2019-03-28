import httpHelper from '../../utils/request'
import { CuPage } from '../../base/index'
import userInfo from '../../mixins/userInfo'
const regeneratorRuntime = require('../../utils/runtime')
function noop () {}
noop(regeneratorRuntime)
CuPage({
  mixins: [userInfo],
  data: {
    xing: 'li',
    xing2: '',
    name: 'Hello World',
    firstName: '',
    watchName: ''
  },
  computed: {
    quanming () {
      return this.data.xing + this.data.name
    }
  },
  watch: {
    name (val, old ) {
      this.setData({
        watchName: val
      })
    }
  },
  onShow: async function () {

    const rsp = await httpHelper.post({
      url: 'secret/list',
      data: this.params()
    })
    console.log(rsp)
  },
  params () {
    const { upDown = true, pageSize = 10, last = 0 } = this.data
    let result = {
      size: pageSize,
      last,
      upDown
    }
    return result
  },
  changeName: function () {
    this.getUserName()
    this.setData({
      name: 'lishanjun',
      xing: 'zahng'
    })
  }
})
