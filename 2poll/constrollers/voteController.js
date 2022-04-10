

exports.addVote = function (req, res) {
    var pollId = req.params.pollid;
    var ansByUser = req.body.ans;
    var username = req.user.name;

    Poll.findById(id, function (err, poll) {
        if (err) {
            return handleError(res, err);
        }
        if (!poll) {
            return res.status(404).send('Not Found');
        }
        if (poll.users_voted.indexOf(username) !== -1) {
            return res.status(403).send('User already cast vote');
        }
        poll.users_voted.push(username);
        poll.votes[optionIndex] = poll.votes[optionIndex] + 1;
        poll.markModified('votes');
        poll.save(function (err, newPoll) {
            if (err) {
                return handleError(res, err);
            }
            return res.status(200).json(newPoll);
        });
    });
};
module.exports = { createPoll }
