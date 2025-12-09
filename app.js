var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');    // 収支一覧 & 追加
var loginRouter = require('./routes/login');    // ログイン & 新規登録
var editRouter = require('./routes/edit');      // 編集
var deleteRouter = require('./routes/delete');  // 削除
var detailRouter = require('./routes/detail');  // ★ 詳細表示

var app = express();

// ===== view engine setup =====
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// ===== middleware =====
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// ===== routing order (重要) =====
app.use("/login", loginRouter);
app.use("/", indexRouter);          // POST "/" は必ず先頭付近で
app.use("/detail", detailRouter);   // ★ 詳細ページ
app.use("/edit", editRouter);
app.use("/delete", deleteRouter);

// ===== 404 handler =====
app.use(function (req, res, next) {
  next(createError(404));
});

// ===== error handler =====
app.use(function (err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
