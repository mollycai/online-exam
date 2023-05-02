const fs = require("fs");
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const moment = require('moment')

const app = express();
app.use(cors());
const writeStream = fs.createWriteStream("./logs/access.log");
app.use(morgan("combined", { stream: writeStream }));
app.use((req, res, next) => {
  res.cc = (err, status = 1) => {
    res.send({
      status,
      message: err instanceof Error ? err.message : err,
    });
  };
  next();
});
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const db = require("./db/index");

// 查询题库
app.get("/lab", (req, res) => {
  const sql = "select * from ex_lab";
  db.query(sql, (err, result) => {
    if (err) res.cc(err);
    let new_data = result.map((item) => item.lab_name);
    res.send({
      status: 0,
      message: "获取数据成功！",
      data: new_data,
    });
  });
});

// 查询对应的题目
app.get("/lab/:exam", (req, res) => {
  const sql = "select * from ex_question where lid = ?";
  console.log(req.params.exam);
  db.query(sql, req.params.exam, (err, result) => {
    if (err) res.cc(err);
    // console.log(result);
    let new_data = result.map((item) => {
      let new_item = {
        qid: item.qid,
        type: item.type,
        stem: item.stem,
        options: [],
        myAnswer: null,
        answer: item.answer,
      };
      if (item.type === "choice" || item.type === "multChoice") {
        new_item["options"] = [...item.options.split(",")];
      }
      if (item.type === "multChoice" || item.type === "fill") {
        new_item["answer"] = [...item.answer.split(",")];
        new_item["myAnswer"] = [];
      }
      if (item.type === "fill") {
        new_item["stem"] = [...item.stem.split(",")];
      }
      return new_item;
    });
    // console.log(new_data);
    res.send({
      status: 0,
      message: "获取数据成功！",
      data: new_data,
    });
  });
});

// 写入答题记录
app.post("/lab/addRecord", (req, res) => {
  const sql = "insert into ex_record set ?";
  let data = req.body;
  data["time"] = new Date();
  // console.log(data);
  db.query(sql, data, (err, result) => {
    if (result.affectedRows !== 1) return res.cc("写入记录失败！");
    res.cc("写入记录成功！", 0);
  });
});

// 查询答题记录
app.get("/getRecord", (req, res) => {
  const sql = "select * from ex_record";
  db.query(sql, (err, result) => {
    if (err) res.cc(err);
    let new_data = result.map((item) => {
      let new_item = {
        id: item.id,
        lid: item.lid,
        time: moment(item.time).format("YYYY-MM-DD HH:mm"),
        rate: item.rate + "%",
      };
			return new_item
    });
    res.send({
      status: 0,
      message: "获取数据成功！",
      data: new_data,
    });
  });
});

app.listen(2000, () => {
  console.log("nodejs api server running in http://127.0.0.1:2000");
});
