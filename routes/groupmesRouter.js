const router = require('express').Router();
const groupmesCtrl = require('../controllers/groupmesCtrl');
const auth = require('../middleware/auth');

router.post('/groupmes', auth, groupmesCtrl.createGroupMessage);

router.get('/groupmessage/:id', auth, groupmesCtrl.getGroupMessages);

router.delete('/groupmessage/:id', auth, groupmesCtrl.deleteGroupMessages)

module.exports = router;
