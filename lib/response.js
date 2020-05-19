const Joi = require('joi');
//const validations = require('./validations');

module.exports = {

    success: (res, bodyObj) => {
        res.status(200).json({ success: true, ...bodyObj });
    },

    error: (res, message) => {
        res.status(500).json({ success: false, msg: message });
    }

}