var express = require("express");
var router = express.Router();
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// ===== 1. 削除確認画面を表示する (GET /delete/:id) =====
router.get("/:id", async function (req, res) {
  // ログインチェック
  if (!req.cookies || !req.cookies.userId) {
    return res.redirect("/login");
  }

  const id = Number(req.params.id);

  try {
    const item = await prisma.item.findUnique({
      where: { id: id }
    });

    // データがない、または他人のデータの場合はアクセス拒否
    if (!item || item.userid !== Number(req.cookies.userId)) {
      return res.status(403).send("削除権限がありません");
    }

    // views/delete.ejs をレンダリングしてデータを渡す
    res.render("delete", { item: item });
  } catch (error) {
    console.error(error);
    res.status(500).send("データの取得中にエラーが発生しました");
  }
});

// ===== 2. 実際の削除処理を実行する (POST /delete/:id) =====
router.post("/:id", async function (req, res) {
  // ログインチェック
  if (!req.cookies || !req.cookies.userId) {
    return res.redirect("/login");
  }

  const id = Number(req.params.id);

  try {
    // セキュリティのため、userid も条件に含めて削除を実行
    await prisma.item.deleteMany({
      where: { 
        id: id,
        userid: Number(req.cookies.userId)
      }
    });

    res.redirect("/");
  } catch (error) {
    console.error(error);
    res.status(500).send("削除中にエラーが発生しました");
  }
});

module.exports = router;