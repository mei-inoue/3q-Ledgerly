// routes/login.js
const express = require("express");
const router = express.Router();
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// ログイン画面の表示
router.get("/", (req, res) => {
  res.render("login", { error: null });
});

// ===== ログイン処理 =====
router.post("/", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return res.render("login", { error: "メールアドレスが登録されていません。" });
    }

    // パスワード比較（平文比較）
    if (password !== user.password) {
      return res.render("login", { error: "パスワードが違います。" });
    }

    // ログイン成功 → Cookie に userId を保存
    res.cookie("userId", user.id, {
      httpOnly: true,   // JavaScript から読み取れない（セキュリティ向上）
      maxAge: 24 * 60 * 60 * 1000,  // 24時間維持
    });

    res.redirect("/");
  } catch (error) {
    console.error(error);
    res.status(500).send("Login Error");
  }
});

// ===== 新規登録 =====

// 新規登録ページ表示
router.get("/register", (req, res) => {
  res.render("register", { error: null });
});

// 新規登録（生パスワードそのまま保存）
router.post("/register", async (req, res) => {
  const { email, password } = req.body;

  try {
    const exist = await prisma.user.findUnique({ where: { email } });
    if (exist) {
      return res.render("register", { error: "このメールアドレスは既に使われています。" });
    }

    await prisma.user.create({
      data: {
        email,
        password,  // 平文（学習用:本番禁止）
      },
    });

    res.redirect("/login");
  } catch (error) {
    console.error(error);
    res.status(500).send("Register Error");
  }
});

// ===== ログアウト =====
router.get("/logout", (req, res) => {
  res.clearCookie("userId");
  res.redirect("/login");
});

module.exports = router;
