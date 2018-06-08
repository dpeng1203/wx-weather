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
    nowWeatherBackground: ''
  },

  onPullDownRefresh () {
      this.getNow( () => {
        wx.stopPullDownRefresh()
      })
  },

  onLoad() {
    this.getNow()
  },

  getNow ( callback ) {
    wx.request({
      url: 'https://test-miniprogram.com/api/weather/now',
      data: { city: '广州市'},

      success: res => {
       console.log(res)
        let result = res.data.result
        this.setNow(result)
        this.setHour(result)
        this.setTaday(result)
      },

      complete: () => {
        callback && callback()
      }
    })
  },

  setNow(result) {
    let temp = result.now.temp + '°'
    let weather = result.now.weather
    console.log(temp, weather)
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
      let date = new Date()
      this.setData({
        todayTemp: `${result.today.minTemp}° - ${result.today.maxTemp}°`,
        todayDate: `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()} 今天`
      })
  }
})