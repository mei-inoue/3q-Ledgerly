var express = require("express");
var router = express.Router();
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// ===== GET 収支一覧 =====
router.get("/", async function (req, res, next) {
  if (!req.cookies.userId) return res.redirect("/login");

  const { filter, start, end } = req.query;

  // 基本の検索条件
  let where = { userid: Number(req.cookies.userId) };

  // 収入 / 支出 / 全て フィルタ
  if (filter === "Income") where.type = "Income";
  if (filter === "Expense") where.type = "Expense";

  // 期間フィルタ
  if (start && end) {
    where.createdAt = {
      gte: new Date(start),
      lte: new Date(`${end} 23:59:59`)
    };
  }

  try {
    const items = await prisma.item.findMany({
      where,
      orderBy: { createdAt: "desc" }
    });

    // サマリー計算（フィルタ後のデータで算出）
    const incomeTotal = items
      .filter(item => item.type === "Income")
      .reduce((sum, item) => sum + item.amount, 0);

    const expenseTotal = items
      .filter(item => item.type === "Expense")
      .reduce((sum, item) => sum + item.amount, 0);

    const balance = incomeTotal - expenseTotal;

    res.render("index", {
      items,
      incomeTotal,
      expenseTotal,
      balance,
      filter,
      start,
      end
    });

  } catch (error) {
    console.error(error);
    res.status(500).send("収支一覧取得エラー");
  }
});


// ===== POST 収支追加 =====
router.post("/", async function (req, res) {
  if (!req.cookies.userId) return res.redirect("/login");

  const { event, amount, type, category, memo } = req.body;

  try {
    await prisma.item.create({
      data: {
        userid: Number(req.cookies.userId),
        event,
        amount: Number(amount),
        type,
        category,
        memo
      },
    });

    res.redirect("/");
  } catch (error) {
    console.error(error);
    res.status(500).send("収支追加エラー");
  }
});

module.exports = router;
