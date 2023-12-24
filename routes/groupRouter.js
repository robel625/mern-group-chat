const router = require('express').Router();
const groupCtrl = require('../controllers/groupCtrl');
const auth = require('../middleware/auth');

router.post('/group', auth, groupCtrl.creategroup);
router.get('/groupsearch', auth, groupCtrl.searchgroup);
router.get('/groupconversations', auth, groupCtrl.getGroupConversations);

module.exports = router;
