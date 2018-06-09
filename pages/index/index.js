// 引入SDK核心类
const QQMapWX = require('../../libs/qqmap-wx-jssdk.js');

const UNPROMPTED = 0
const UNAUTHORIZED = 1
const AUTHORIZED = 2
    
const UNPROMPTED_TIPS = "点击获取当前位置"
const UNAUTHORIZED_TIPS = "点击开启位置权限"
const AUTHORIZED_TIPS = ""

const weatherMap = {
  'sunny': '晴天',
  'cloudy': '多云',
  'overcast': '阴',
  'lightrain': '小雨',
  'heavyrain': '大雨',
  'snow': '雪'
}
const weatherColorMap = {
  'sunny': '#cbeefd',
  'cloudy': '#deeef6',
  'overcast': '#c6ced2',
  'lightrain': '#bdd5e1',
  'heavyrain': '#c5ccd0',
  'snow': '#aae1fc'
}

Page({
  data: {
    items: [],
    todayTemp: '',
    todayDate: '',
    nowWeatherBackground: '',
    city: '广州市',
    locationTipsText: UNPROMPTED_TIPS,
    locationAuthType: UNPROMPTED  
  },

  onPullDownRefresh () {
      this.getNow( () => {
        wx.stopPullDownRefresh()
      })
  },

  onLoad() {
    this.qqmapsdk = new QQMapWX({
      key: 'PLVBZ-PB6CK-PWOJO-AQMRX-3QPV7-FIFIN'
    })
    this.getLocation()
    //this.getNow()
  },

  getNow ( callback ) {
    console.log(1)
    wx.request({
      url: 'https://test-miniprogram.com/api/weather/now',
      data: { city:  this.data.city },

      success: res => {
      // console.log(res)
        let result = res.data.result
        this.setNow(result)
        this.setHour(result)
        this.setTaday(result)
        console.log(2)
      },

      complete: () => {
        callback && callback()
      }
    })
  },

  setNow(result) {
    let temp = result.now.temp + '°'
    let weather = result.now.weather
    //console.log(temp, weather)
    this.setData({
      nowTemp: temp,
      nowWeather: weatherMap[weather],
      nowWeatherBackground: '/images/' + weather + '-bg.png'
    }),
    wx.setNavigationBarColor({
      frontColor: '#000000',
      backgroundColor: weatherColorMap[weather],
    })
  },

  setHour (result) {
    let items = []
    let nowHour = new Date().getHours()
    let forecast = result.forecast
    for (let i = 0; i < 24; i += 3) {
      items.push({
        time: (i + nowHour) % 24 + '时',
        icon: '/images/' + forecast[i / 3].weather + '-icon.png',
        temp: forecast[i / 3].temp + '°'
      })
    }
    items[0].time = '现在'
    this.setData({
      items: items
    })
  },

  setTaday (result) {
    console.log(3)
      let date = new Date()
      this.setData({
        todayTemp: `${result.today.minTemp}° - ${result.today.maxTemp}°`,
        todayDate: `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()} 今天`
      })
  },
  onTapDayWeather() {
      wx.navigateTo({
        url: '/pages/list/list?city=' + this.data.city,
      })
  },
  onTapLocation () {
    if (this.data.locationAuthType === UNAUTHORIZED)
        wx.openSetting({})
    else
        this.getLocation()
  },
  getLocation() {
    wx.getLocation({
      success: res => {
        this.setData({
          locationAuthType: AUTHORIZED,
          locationTipsText: AUTHORIZED_TIPS
        })
        this.qqmapsdk.reverseGeocoder({
          location: {
            latitude: res.latitude, 
            longitude: res.longitude
          },
          success: res => {
            let city = res.result.address_component.city
            this.setData({
              city: city
            }) 
            this.getNow()
          }
        })
      },
      fail: () => {
        this.setData({
             locationAuthType: UNAUTHORIZED,
             locationTipsText: UNAUTHORIZED_TIPS
        })
      }
    })
  }
})