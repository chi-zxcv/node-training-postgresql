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
    const packages_skill = await AppDataSource.getRepository("Skill").find({
      select: ["id", "name"],
    });
    res.status(200).json({
      status: "success",
      data: packages_skill,
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
    if (isUndefined(data.name) || isNotValidSting(data.name)) {
      res.status(400).json({
        status: "failed",
        message: "欄位未填寫正確skill",
      });
      return;
    }
    const SkillPackageRepo = await AppDataSource.getRepository("Skill");
    const existPackage = await SkillPackageRepo.find({
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
    const newPackage = await SkillPackageRepo.create({
      name: data.name,
    });
    const result = await SkillPackageRepo.save(newPackage);
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
    const result = await AppDataSource.getRepository("Skill").delete(packageId);
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
