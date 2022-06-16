var express = require("express");
var router = express.Router();

const shortid = require("shortid");
const models = require("../../models");
const response = require("../../lib/response");
const bcrypt = require("bcryptjs");

router.get("/", async (req, res) => {
  const reqId = shortid.generate();

  try {
    const data = req.query;
    console.log(data);

    const options = {
      where: {
        ...(data.country ? { country: data.country } : {}),
        ...(data.userId ? { userId: data.userId } : {}),
        ...(data.date
          ? {
              createdAt: models.sequelize.where(
                models.sequelize.fn("date", models.sequelize.col("createdAt")),
                "=",
                data.date
              ),
            }
          : {}),
      },
    };

    const emails = await models.Email.findAll(options);
    response.success(res, { docs: emails });
  } catch (err) {
    console.log(reqId, "-", err);
    response.error(res, "Something went wrong.");
  }
});

router.get("/currentuser/:id", async (req, res) => {
  const reqId = shortid.generate();
  try {
    let d = new Date();
    const today =
      d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate();
    const options = {
      where: {
        userId: req.params.id,
        createdAt: models.sequelize.where(
          models.sequelize.fn("date", models.sequelize.col("createdAt")),
          "=",
          today
        ),
      },
      attributes: {
        exclude: ["updatedAt"],
      },
    };
    const emails = await models.Email.findAll(options);
    response.success(res, { docs: emails });
  } catch (err) {
    console.log(reqId, "-", err);
    response.error(res, "Something went wrong.");
  }
});

router.get("/emailexist", async (req, res) => {
  const reqId = shortid.generate();
  try {
    const options = {
      where: { emailId: req.query.email },
      attributes: {
        exclude: ["id", "createdAt", "updatedAt", "deletedAt"],
      },
    };
    const user = await models.Email.findOne(options);
    console.log(user);
    if (!user) {
      return response.success(res, { emailExist: false });
    }
    response.success(res, { emailExist: true });
  } catch (err) {
    console.log(reqId, "-", err);
    response.error(res, "Something went wrong.");
  }
});
router.get("/:id", async (req, res) => {
  const reqId = shortid.generate();
  try {
    const options = {
      where: { id: req.params.id },
      attributes: {
        exclude: ["id", "createdAt", "updatedAt", "deletedAt"],
      },
    };
    const user = await models.User.findOne(options);
    if (!user) {
      return response.error(res, "Not Found");
    }
    response.success(res, { user: user });
  } catch (err) {
    console.log(reqId, "-", err);
    response.error(res, "Something went wrong.");
  }
});

router.post("/", async (req, res) => {
  const reqId = shortid.generate();
  const data = req.body;

  const emailData = {
    name: data.name,
    emailId: data.emailId,
    country: data.country,
    userId: data.userId,
  };
  const options = {
    where: { emailId: data.emailId },
    attributes: {
      exclude: ["id", "createdAt", "updatedAt", "deletedAt"],
    },
  };
  try {
    const emailExist = await models.Email.findOne(options);
    if (emailExist) {
      return response.success(res, { Message: "Email Alread Exist" });
    }
    const transactionResult = await models.sequelize.transaction(
      async (transaction) => {
        let user = await models.Email.create(emailData, {
          transaction,
        });
        response.success(res, { message: "User added successfully" });
      }
    );
  } catch (error) {
    console.log(error);
    response.error(res, "Something went wrong");
  }
});

router.put("/:id", async (req, res) => {
  const reqId = shortid.generate();
  const data = req.body;

  try {
    const transactionResult = await models.sequelize.transaction(
      async (transaction) => {
        const savedEmailData = await models.Email.findOne({
          where: { id: req.params.id },
        });
        if (savedEmailData) {
          let user = await models.Email.update(data, {
            where: { id: savedEmailData.id },
            transaction,
          });
        }
        response.success(res, { message: "Name updated successfully" });
      }
    );
  } catch (error) {
    response.error(res, "Something went wrong");
  }
});

router.delete("/:id", async (req, res) => {
  const reqId = shortid.generate();
  try {
    const options = {
      where: { id: req.params.id },
    };
    const email = await models.Email.destroy(options);
    if (!email) {
      return response.error(res, "Not Found");
    }
    response.success(res, { email: email });
  } catch (err) {
    console.log(reqId, "-", err);
    response.error(res, "Something went wrong.");
  }
});

module.exports = router;
