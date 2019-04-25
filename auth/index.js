const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.json({
    message: "This Works Authorization!!! ✅ "
  })
});

module.exports = router;
