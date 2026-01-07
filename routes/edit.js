var express = require("express");
var router = express.Router();
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// ===== 1. 編集画面を表示する (GET /edit/:id) =====
router.get("/:id", async function (req, res) {
  if (!req.cookies.userId) return res.redirect("/login");

  const id = Number(req.params.id);

  try {
    const item = await prisma.item.findUnique({
      where: { id: id },
    });

    // データがない、または他人のデータの場合はアクセス拒否
    if (!item || item.userid !== Number(req.cookies.userId)) {
      return res.status(403).send("閲覧権限がありません");
    }

    // views/edit.ejs をレンダリングしてデータを渡す
    res.render("edit", { item: item });
  } catch (err) {
    console.log(err);
    res.status(500).send("データの取得中にエラーが発生しました");
  }
});

// ===== 2. 更新処理を実行する (POST /edit/:id) =====
router.post("/:id", async function (req, res) {
  if (!req.cookies.userId) return res.redirect("/login");

  const id = Number(req.params.id);
  const { event, amount, type, category } = req.body;

  try {
    // 権限確認を含めた更新処理
    await prisma.item.update({
      where: { 
        id: id,
        userid: Number(req.cookies.userId) // 自分のデータのみ更新可能にする
      },
      data: {
        event,
        amount: Number(amount),
        type,
        category,
      },
    });

    res.redirect("/");
  } catch (err) {
    console.log(err);
    res.status(500).send("更新中にエラーが発生しました");
  }
});

module.exports = router;