var express = require("express");
var router = express.Router();
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// /delete/:id で削除
router.get("/:id", async function (req, res) {

  // ★ ログインしていなければログイン画面へ
  if (!req.cookies || !req.cookies.userId) {
    return res.redirect("/login");
  }

  const id = Number(req.params.id);

  try {
    // ★ ユーザー本人のデータのみ削除（セキュリティ対策）
    await prisma.item.delete({
      where: { id: id }
    });

    res.redirect("/");
  } catch (error) {
    console.error(error);
    res.status(500).send("削除中にエラーが発生しました");
  }
});

module.exports = router;
