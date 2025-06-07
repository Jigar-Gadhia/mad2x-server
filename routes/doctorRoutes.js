const express = require("express");
const router = express.Router();
const Doctor = require("../models/Doctor");

// GET /api/doctors?pageNumber=1&pageSize=10
router.get("/", async (req, res) => {
  try {
    const pageNumber = parseInt(req.query.pageNumber) || 1;
    const pageSize = parseInt(req.query.pageSize) || 10;

    const skip = (pageNumber - 1) * pageSize;

    // Fetch paginated data and total count
    const [doctors, totalCount] = await Promise.all([
      Doctor.find().skip(skip).limit(pageSize),
      Doctor.countDocuments()
    ]);

    res.status(200).json({
      pageNumber,
      pageSize,
      totalPages: Math.ceil(totalCount / pageSize),
      totalCount,
      data: doctors
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
