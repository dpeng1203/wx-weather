// pages/list/list.js
const dayMap = ['星期天','星期一','星期二','星期三','星期四','星期五','星期六']
Page({
  data: {
    weekWeather: [1,2,3,4,5,6,7],
    city: '广州市'
  },

  onLoad (options) {
      this.setData({
        city: options.city
      })
      this.getWeekWeather()
  },
  onPullDownRefresh() {
    this.getWeekWeather(() => {
      wx.stopPullDownRefresh()
    })
  },

  getWeekWeather (callback) {
      wx.request({
        url: 'https://test-miniprogram.com/api/weather/future',
        data: {
          city: this.city,
          time: new Date().getTime()
        },
        success: res => {
          console.log(res)
          let result = res.data.result
          this.setWeekWeather(result)
        },
        complete: () => {
          callback && callback()
        }
      })
  },
  setWeekWeather (result) {
        let weekWeather = []
        for(let i =0 ; i < 7; i++) {
          let date = new Date()
          date.setDate(date.getDate() + i)
          weekWeather.push({
              day: dayMap[(date.getDate()+4)%7 ],
              date: `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`,
              temp: `${result[i].minTemp}° - ${result[i].maxTemp}°`,
              iconPath: '/images/' + result[i].weather + '-icon.png'
          })
        }
        this.setData ({
          weekWeather: weekWeather
        }) 
  }


})