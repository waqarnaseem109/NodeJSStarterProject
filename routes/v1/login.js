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

router.post("/", async (req, res) => {
  const reqId = shortid.generate();
  const data = req.body;
  const validatorSchema = Joi.object().keys({
    username: Joi.string().required(),
    password: Joi.string().required(),
  });
  const { error } = Joi.validate(data, validatorSchema, { allowUnknown: true });
  if (error) {
    const errorMessage = error.details.map((item) => item.message).join(", ");
    return response.error(res, errorMessage);
  }
  try {
    const user = await models.User.findOne({
      where: { username: data.username },
    });
    if (!user) {
      return response.error(res, "User not found");
    }
    const passwordMatch = await bcrypt.compare(data.password, user.password);
    if (!passwordMatch) {
      return response.error(res, "Invalid credentials");
    }
    const token = jwt.sign(user.id, "12323123");
    response.success(res, {
      token,
      user: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        type: user.type,
      },
    });
  } catch (error) {
    console.error(
      reqId,
      "-",
      `Error logging in ${JSON.stringify(data)}, reason: ${error.message}`
    );
    response.error(res, "Something went wrong");
  }
});

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
          // let user = await models.TimeSheet.update(data, {
          //   where: { id: savedEmailData.id },
          //   transaction,
          // });
        }
        response.success(res, {
          message: "User added successfully",
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
