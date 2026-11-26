const express = require('express');
const { addComment, getComments } = require('../controllers/commentController');
const { protect } = require('../middleware/auth');
const validate = require('../middleware/validate');
const { objectIdRule, commentRules } = require('../middleware/validators');

const router = express.Router({ mergeParams: true });

router.use(protect);

router.get('/', objectIdRule, validate, getComments);
router.post('/', commentRules, validate, addComment);

module.exports = router;
