// routes/index.js
var express = require("express");
var router = express.Router();

const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

/* 一覧表示 */
router.get("/", async (req, res) => {
  try {
    const blogs = await prisma.blog.findMany({  //blogテーブルから全ての記事を取得
      orderBy: [{ date: "desc" }, { id: "desc" }], //日付の新しい順、idを順番に並べる
    });
    res.render("index", { blogs }); //index.ejsを表示して、そこにblogsのデータを渡す
  } catch (err) {
    console.error(err);
    res.status(500).send("Error fetching blogs");
  }
});

/* 新規投稿 */
router.post("/", async (req, res) => {
  const { title, date, content } = req.body;
  try {
    await prisma.blog.create({
      data: {
        title,
        date: date ? new Date(date) : new Date(), // date未入力なら現在時刻
        content,
      },
    });
    res.redirect("/");
  } catch (err) {
    console.error(err);
    res.status(500).send("Error creating blog");
  }
});

module.exports = router;
