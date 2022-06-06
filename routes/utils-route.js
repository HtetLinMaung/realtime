const express = require("express");
const { getIO } = require("../socket");

const router = express.Router();

router.post("/emit", async (req, res) => {
  try {
    const { event, data, receivers, access_key } = req.body;
    if (access_key != process.env.ACCESS_KEY) {
      return res.status(401).json({
        code: 401,
        message: "Invalid access key",
      });
    }

    const io = getIO();
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
