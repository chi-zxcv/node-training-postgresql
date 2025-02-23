require("dotenv").config();
const http = require("http");
const express = require("express");
const cors = require("cors");
const path = require("path");
const app = express();
const creditPackageRouter = require("./routes/creditPackage");
const skillRouter = require("./routes/coachesSkill");
const AppDataSource = require("./db");

function isUndefined(value) {
  return value === undefined;
}

function isNotValidSting(value) {
  return typeof value !== "string" || value.trim().length === 0 || value === "";
}

function isNotValidInteger(value) {
  return typeof value !== "number" || value < 0 || value % 1 !== 0;
}
/*
const requestListener = async (req, res) => {
  const headers = {
    "Access-Control-Allow-Headers":
      "Content-Type, Authorization, Content-Length, X-Requested-With",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "PATCH, POST, GET,OPTIONS,DELETE",
    "Content-Type": "application/json",
  };
  let body = "";
  req.on("data", (chunk) => {
    body += chunk;
  });

  if (req.url == "/") {
    res.write(
      JSON.stringify({
        status: "success",
        message: "you are in the first page",
      })
    );
    res.end();
  } else if (req.method === "OPTIONS") {
    res.writeHead(200, headers);
    res.end();
  } else {
    res.writeHead(404, headers);
    res.write(
      JSON.stringify({
        status: "failed",
        message: "無此網站路由",
      })
    );
    res.end();
  }
};

const server = http.createServer(requestListener);

async function startServer() {
  await AppDataSource.initialize();
  console.log("資料庫連接成功");
  server.listen(process.env.PORT);
  console.log(`伺服器啟動成功, port: ${process.env.PORT}`);
  return server;
}

module.exports = startServer();
*/

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));
app.use("/api/credit-package", creditPackageRouter);
app.use("/api/coaches/skill/", skillRouter);

// 監聽 port
const port = process.env.PORT || 3001;
app.listen(port, async () => {
  try {
    await AppDataSource.initialize();
    console.log("資料庫連線成功");
    console.log(`伺服器運作中. port: ${port}`);
  } catch (error) {
    console.log(`資料庫連線失敗: ${error.message}`);
    process.exit(1);
  }
});
