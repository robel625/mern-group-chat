const Group = require('../models/groupModel');
const Groupmes = require('../models/groupmesModel');

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

const groupmesCtrl = {
    createGroupMessage: async (req, res) => {
        try {
            const { sender, recipient, text, media } = req.body
      
            if(!recipient || (!text.trim() && media.length === 0 && !call)) return;
      
            const newGroup = await Group.findOneAndUpdate({ _id: recipient },
                {
                text, media
            }, { new: true, upsert: true })
      
            const newGroupMessage = new Groupmes({
                conversation: newGroup._id,
                sender,
                recipient, text, media
            })
      
            await newGroupMessage.save()
      
            res.json({msg: 'Create Success!'})
      
        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
      },

      getGroupMessages: async (req, res) => {
        try {
            const features = new APIfeatures(Groupmes.find({ conversation: req.params.id }), req.query).paginating()
            const groupmessages = await features.query.sort('-createdAt')
            .populate('sender', 'avatar username fullname')

            res.json({
                groupmessages,
                result: groupmessages.length
            })

        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },

    deleteGroupMessages: async (req, res) => {
        try {
            await Groupmes.findOneAndDelete({_id: req.params.id, sender: req.user._id})
            res.json({msg: 'Delete Success!'})
        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },
      
};

module.exports = groupmesCtrl;