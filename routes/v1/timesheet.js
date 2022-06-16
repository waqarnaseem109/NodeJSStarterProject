var express = require("express");
var router = express.Router();

const shortid = require("shortid");
const bcrypt = require("bcryptjs");
const Joi = require("joi");
const _ = require("lodash");
const jwt = require("jsonwebtoken");

const models = require("../../models");
const response = require("../../lib/response");
const Op = models.Sequelize.Op;

router.post("/recordTime", async (req, res) => {
  const reqId = shortid.generate();
  const data = req.body;
  console.log(data);
  try {
    const TODAY_START = new Date().setHours(0, 0, 0, 0);
    const NOW = new Date();
    const transactionResult = await models.sequelize.transaction(
      async (transaction) => {
        const user = await models.User.findOne({
          where: { id: data.userId },
        });
        if (!user) {
          return response.error(res, "User not found");
        }
        const todayrecord = await models.TimeSheet.findOne({
          where: {
            createdAt: {
              [Op.gt]: TODAY_START,
              [Op.lt]: NOW,
            },
            userId: data.userId,
          },
        });
        if (!todayrecord) {
          const record = {
            startTime: NOW.toString(),
            validEmails: 0,
            invalidEmails: 0,
            userId: data.userId,
          };
          let tcreate = await models.TimeSheet.create(record, {
            transaction,
          });
        } else {
          return response.success(res, {
            message: "Time recorded added successfully",
            todayrecord: todayrecord,
          });
        }
        response.success(res, {
          message: "Time recorded added successfully",
        });
      }
    );
  } catch (error) {
    console.error(
      reqId,
      "-",
      `Error logging in ${JSON.stringify(data)}, reason: ${error.message}`
    );
    response.error(res, "Something went wrong");
  }
});

router.post("/logout", async (req, res) => {
  const reqId = shortid.generate();
  const data = req.body;
  console.log(data);
  try {
    const TODAY_START = new Date().setHours(0, 0, 0, 0);
    const NOW = new Date();
    const transactionResult = await models.sequelize.transaction(
      async (transaction) => {
        const user = await models.User.findOne({
          where: { id: data.userId },
        });
        if (!user) {
          return response.error(res, "User not found");
        }
        const todayrecord = await models.TimeSheet.findOne({
          where: {
            createdAt: {
              [Op.gt]: TODAY_START,
              [Op.lt]: NOW,
            },
          },
        });
        if (todayrecord) {
          const record = {
            endTime: NOW.toString(),
            validEmails: data.validEmails,
            invalidEmails: data.invalidEmails,
            userId: data.userId,
          };
          let tcreate = await models.TimeSheet.update(record, {
            where: { id: todayrecord.id },
            transaction,
          });
        } else {
          // let user = await models.TimeSheet.update(data, {
          //   where: { id: savedEmailData.id },
          //   transaction,
          // });
        }
        response.success(res, {
          message: "update timesheet successfully",
        });
      }
    );
  } catch (error) {
    console.error(
      reqId,
      "-",
      `Error logging in ${JSON.stringify(data)}, reason: ${error.message}`
    );
    response.error(res, "Something went wrong");
  }
});

module.exports = router;
