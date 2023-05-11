// pages/exam/exam.js

Page({

  /**
   * 页面的初始数据
   */
  data: {
    lab: null,
    index: 0,
    questions: [],
    touchStart: [0, 0],
    touchEnd: [0, 0],
    showAnswer: false,
    disableWrite: false
  },
  // 单选框
  radioChange(e) {
    let myAnswer = e.detail.value;
    let qid = e.currentTarget.dataset.qid
    this.data.questions[qid - 1].myAnswer = myAnswer
    this.setData({
      questions: this.data.questions
    })
  },
  // 多选框
  checkboxChange(e) {
    let myAnswer = e.detail.value;
    let qid = e.currentTarget.dataset.qid
    this.data.questions[qid - 1].myAnswer = myAnswer
    this.setData({
      questions: this.data.questions
    })
  },
  // 填空输入框
  inputChange(e) {
    let qid = e.currentTarget.dataset.qid
    if (!this.data.questions[qid - 1].myAnswer) {
      this.data.questions[qid - 1].myAnswer = []
    } else {
      this.data.questions[qid - 1].myAnswer[e.target.dataset.info] = e.detail.value
      this.setData({
        questions: this.data.questions
      })
    }
  },
  // 文本输入框
  textareaChange(e) {
    let qid = e.currentTarget.dataset.qid
    this.data.questions[qid - 1].myAnswer = e.detail.value
    this.setData({
      questions: this.data.questions
    })
  },
  // 上一题
  preQuestion(e) {
    if (this.data.index === 0) return
    this.setData({
      index: this.data.index - 1
    })
  },
  // 下一题
  nextQuestion(e) {
    if (this.data.index === this.data.questions.length - 1) return
    this.setData({
      index: this.data.index + 1
    })
  },
  // 所有题目提交
  allSubmit() {
    const num = this.data.questions.length
    let right = 0
    for (let i = 0; i < num; i++) {
      if (this.data.questions[i].type === 'choice') {
        this.data.questions[i].answer == this.data.questions[i].myAnswer && right++
      } else if (this.data.questions[i].type === 'multChoice' || this.data.questions[i].type === 'fill') {
        if (this.data.questions[i].type === 'multChoice') this.data.questions[i].myAnswer.sort(function (a, b) {
          return a - b
        })
        if (this.data.questions[i].myAnswer.length == this.data.questions[i].answer.length) {
          let flag = true
          for (let j = 0; j < this.data.questions[i].myAnswer.length; j++) {
            if (this.data.questions[i].myAnswer[j] != this.data.questions[i].answer[j] || this.data.questions[i].myAnswer.length == 0) flag = false
          }
          flag && right++
        }
      }
    }
    const record = {
      lid: this.data.lab,
      time: null,
      rate: (right / num) * 100
    }
    this.addRecord(record)
    wx.showModal({
      title: '提示',
      content: `您的答题数为${num}，正确率为${(right / num) * 100}%`,
      complete: (res) => {
        this.setData({
          index: 0,
          showAnswer: true,
          disableWrite: true
        })
      }
    })
  },
  // 跳转到目标题目
  indexChange(e) {
    this.setData({
      index: e.target.dataset.idx
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.setData({
      lab: +options.exam + 1
    })
    this.reqQuestion(+options.exam + 1)
  },
  // 根据索引获取题目
  reqQuestion(index) {
    wx.request({
      url: `http://localhost:2000/lab/${index}`,
      method: 'GET',
      success: res => {
        this.setData({
          questions: res.data.data
        })
      }
    })
  },
  // 写入记录
  addRecord(record) {
    wx.request({
      url: `http://localhost:2000/lab/addRecord`,
      method: 'POST',
      data: record,
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
    })
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