var mongoose = require('mongoose'),
    Schema = mongoose.Schema;
const objectId= mongoose.Types.ObjectId
var PollSchema = new Schema({
    name: String,
    authorId: {type:objectId},
    options: [String],
        date_created: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Poll', PollSchema);