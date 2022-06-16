var express = require("express");
var router = express.Router();

const shortid = require("shortid");
const models = require("../../models");
const response = require("../../lib/response");
const bcrypt = require("bcryptjs");

router.get("/", async (req, res) => {
  const reqId = shortid.generate();
  try {
    const users = await models.User.findAll();
    response.success(res, { docs: users });
  } catch (err) {
    console.log(reqId, "-", err);
    response.error(res, "Something went wrong.");
  }
});
router.get("/minimal", async (req, res) => {
  const reqId = shortid.generate();
  try {
    const options = {
      attributes: ["id", "firstName", "lastName"],
      order: [["firstName", "asc"]],
    };
    const users = await models.User.findAll(options);
    response.success(res, { docs: users });
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
  const password = await bcrypt.hash(
    data.password || "",
    bcrypt.genSaltSync(10)
  );
  console.log(data);
  const userData = {
    firstName: data.firstName,
    lastName: data.lastName,
    email: data.email,
    contactNo: data.contactNo,
    dob: data.dob,
    address: data.address,
    username: data.username,
    password: password,
    type: data.type,
  };
  try {
    const transactionResult = await models.sequelize.transaction(
      async (transaction) => {
        let user = await models.User.create(userData, {
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
  const userData = {
    firstName: data.firstName,
    lastName: data.lastName,
    email: data.email,
  };
  try {
    const transactionResult = await models.sequelize.transaction(
      async (transaction) => {
        const savedUserData = await models.User.findOne({
          where: { id: req.params.id },
        });
        if (savedUserData) {
          let user = await models.User.update(userData, {
            where: { id: savedUserData.id },
            transaction,
          });
        }
        response.success(res, { message: "User updated successfully" });
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
    const user = await models.User.destroy(options);
    if (!user) {
      return response.error(res, "Not Found");
    }
    response.success(res, { user: user });
  } catch (err) {
    console.log(reqId, "-", err);
    response.error(res, "Something went wrong.");
  }
});

module.exports = router;
