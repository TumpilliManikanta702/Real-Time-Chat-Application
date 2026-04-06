const express = require('express');
const router = express.Router();

router.get('/messages', (req, res) => {
  res.json({ message: "Messages route working" });
});

module.exports = router;
