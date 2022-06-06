const express = require("express");
const { getIO } = require("../socket");

const router = express.Router();

router.post("/emit", async (req, res) => {
  try {
    const io = getIO();
    const { event, data, receivers } = req.body;
    if (receivers && receivers.length) {
      io.to(receivers).emit(event, data);
    } else {
      io.emit(event, data);
    }

    res.json({
      code: 200,
      message: "success",
    });
  } catch (err) {
    console.log(err);
    res.json({
      code: 500,
      message: err.message,
    });
  }
});

module.exports = router;
