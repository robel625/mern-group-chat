const Group = require('../models/groupModel');

class APIfeatures {
  constructor(query, queryString){
      this.query = query;
      this.queryString = queryString;
  }

  paginating(){
      const page = this.queryString.page * 1 || 1
      const limit = this.queryString.limit * 1 || 9
      const skip = (page - 1) * limit
      this.query = this.query.skip(skip).limit(limit)
      return this;
  }
}

const groupCtrl = {
  creategroup: async (req, res) => {
    try {
      const { groupname, story, avatar } = req.body;

      const newGroup = new Group({
        groupname,
        story,
        avatar,
        user: req.user._id,
      });

      await newGroup.save();

      res.json({ msg: 'Create Success!' });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },

  searchgroup: async (req, res) => {
    try {
      const groups = await Group.find({
        groupname: { $regex: req.query.groupname },
      })
        .limit(10)
        .select('groupname avatar text media');

      res.json({ groups });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },

  getGroupConversations: async (req, res) => {
    try {
        const features = new APIfeatures(Group.find(), req.query).paginating()

        const groups = await features.query.sort('-updatedAt')
        .populate('sender', 'avatar username fullname')

        res.json({
            groups,
            result: groups.length
        })

    } catch (err) {
        return res.status(500).json({msg: err.message})
    }
},

};

module.exports = groupCtrl;
