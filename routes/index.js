const express = require('express');
const finder = require('../services/rectangle-finder');

const router = express.Router();

router.put('/field', (req, res) => {
    const { field } = req.body;

    const rectangles = finder.findRectangles(field);
    const maxRectangle = finder.getMaxRectangle(rectangles);

    res.send({ rectangles, maxRectangle });
});

module.exports = router;
