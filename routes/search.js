// routes/search.js
var express = require("express");
var router = express.Router();
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

/* 検索結果表示 */
router.get("/", async (req, res) => {
  const keyword = req.query.q || "";  //検索されたキーワードがあれば、その値を使う
  try {
    const blogs = await prisma.blog.findMany({
      where: {
        OR: [  //タイトルまたは投稿内容にキーワードがないか探す
          { title: { contains: keyword } },
          { content: { contains: keyword } }
        ]
      },
      orderBy: { date: "desc" } //検索に該当する記事を順番に表示
    });
    res.render("search", { blogs, keyword });  //search.ejsを表示して、そこにblogsとkeywordのデータを渡す
  } catch (err) {
    console.error(err);
    res.status(500).send("Error searching blogs");
  }
});

module.exports = router;
