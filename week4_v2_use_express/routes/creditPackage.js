const express = require("express");

const router = express.Router();
// const { dataSource } = require('../db/data-source')
const AppDataSource = require("../db");

function isUndefined(value) {
  return value === undefined;
}

function isNotValidSting(value) {
  return typeof value !== "string" || value.trim().length === 0 || value === "";
}

function isNotValidInteger(value) {
  return typeof value !== "number" || value < 0 || value % 1 !== 0;
}

router.get("/", async (req, res, next) => {
  try {
    const packages = await AppDataSource.getRepository("CreditPackage").find({
      select: ["id", "name", "credit_amount", "price"],
    });
    res.status(200).json({
      status: "success",
      data: packages,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "伺服器錯誤",
    });
  }
});

router.post("/", async (req, res, next) => {
  console.log(req.body);
  try {
    const data = req.body;
    if (
      isUndefined(data.name) ||
      isNotValidSting(data.name) ||
      isUndefined(data.credit_amount) ||
      isNotValidInteger(data.credit_amount) ||
      isUndefined(data.price) ||
      isNotValidInteger(data.price)
    ) {
      res.status(400).json({
        status: "failed",
        message: "欄位未填寫正確",
      });
      return;
    }
    const creditPackageRepo = await AppDataSource.getRepository(
      "CreditPackage"
    );
    const existPackage = await creditPackageRepo.find({
      where: {
        name: data.name,
      },
    });
    if (existPackage.length > 0) {
      res.status(409).json({
        status: "failed",
        message: "資料重複",
      });
      return;
    }
    const newPackage = await creditPackageRepo.create({
      name: data.name,
      credit_amount: data.credit_amount,
      price: data.price,
    });
    const result = await creditPackageRepo.save(newPackage);
    res.status(200).json({
      status: "success",
      data: result,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: "error",
      message: "伺服器錯誤",
    });
  }
});

router.delete("/:creditPackageId", async (req, res, next) => {
  try {
    console.log(req.query); //?=xxx
    console.log(req.params);
    const packageId = req.params.creditPackageId;
    if (isUndefined(packageId) || isNotValidSting(packageId)) {
      res.status(400).json({
        status: "failed",
        message: "ID錯誤",
      });
      return;
    }
    const result = await AppDataSource.getRepository("CreditPackage").delete(
      packageId
    );
    if (result.affected === 0) {
      res.status(400).json({
        status: "failed",
        message: "ID錯誤",
      });
      return;
    }
    res.status(200).json({
      status: "success",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: "error",
      message: "伺服器錯誤",
    });
  }
});

module.exports = router;
