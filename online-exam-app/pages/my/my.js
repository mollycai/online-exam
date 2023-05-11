// pages/my/my.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    themeArr: {
      id: 'ID',
      lid: '题库',
      time: '作答时间',
      rate: '正确率'
    },
    itemArr: [],
    examList: [],
  },
  // 请求答题记录
  reqRecord(){
    wx.request({
      url: 'http://localhost:2000/getRecord',
      method:'GET',
      success: res => {
        this.setData({
          itemArr: res.data.data
        })
      }
    })
  },
  // 请求题库列表
  reqLab(){
    wx.request({
      url: 'http://localhost:2000/lab',
      method:'GET',
      success: res => {
        this.setData({
          examList: res.data.data
        })
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.reqRecord()
    this.reqLab()
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    this.reqRecord()
    this.reqLab()
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})