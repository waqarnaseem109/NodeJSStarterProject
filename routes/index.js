var express = require('express');
var router = express.Router();
const fs = require('fs');

const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

const utils = require('../lib/utils');
const response = require('../lib/response');
const models = require('../models');

/* GET home page. */
router.get('/', function (req, res, next) {
  res.json({ title: 'Medsys API' });
});

module.exports = router;
