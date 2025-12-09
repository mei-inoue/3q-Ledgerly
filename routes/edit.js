var express = require("express");
var router = express.Router();
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// ===== 編集用データ取得 API =====
router.get("/data/:id", async function (req, res) {
  if (!req.cookies.userId) return res.status(403).send("Not logged in");

  const id = Number(req.params.id);

  try {
    const item = await prisma.item.findUnique({
      where: { id: id },
    });

    if (!item || item.userid !== Number(req.cookies.userId)) {
      return res.status(403).send("Forbidden");
    }

    res.json(item);
  } catch (err) {
    console.log(err);
    res.status(500).send("Error fetching item data");
  }
});

// ===== POST → 更新処理 =====
router.post("/:id", async function (req, res) {
  if (!req.cookies.userId) return res.redirect("/login");

  const id = Number(req.params.id);
  const { event, amount, type, category } = req.body;

  try {
    await prisma.item.update({
      where: { id: id },
      data: {
        event,
        amount: Number(amount),
        type,
        category,
        userid: Number(req.cookies.userId),
      },
    });

    res.redirect("/");
  } catch (err) {
    console.log(err);
    res.status(500).send("更新中にエラーが発生しました");
  }
});

module.exports = router;
