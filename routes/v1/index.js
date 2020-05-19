const fs = require('fs');
const path = require('path');
const basename = path.basename(__filename);
const express = require('express');

const router = express.Router();

// router.use('/doctor', require('./doctor'));
// router.use('/agency', require('./agency'));
// router.use('/agency-doctor-fees', require('./agency-doctor-fees'));
// router.use('/solicitor', require('./solicitor'));
// router.use('/venue', require('./venue'));
// router.use('/claimant', require('./claimant'));

fs
    .readdirSync(__dirname)
    .filter(file => {
        return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js' && !file.startsWith('_'));
    })
    .forEach(file => {
        const [routeName] = file.split('.');
        router.use(`/${routeName}`, require(`./${file}`));
    });

module.exports = router;