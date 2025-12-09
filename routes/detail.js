var express = require("express");
var router = express.Router();
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// GET /detail?id=〇〇
router.get("/", async (req, res) => {
  const id = Number(req.query.id);

  try {
    const item = await prisma.item.findUnique({ where: { id } });

    if (!item) return res.status(404).send("データが存在しません");

    res.render("detail", { item });
  } catch (error) {
    console.error(error);
    res.status(500).send("詳細取得中にエラーが発生しました");
  }
});

module.exports = router;
