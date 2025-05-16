const confirmedActions = new Map();

function confirmRequest(userId, action) {
    confirmedActions.set(userId, action);
}

function isConfirmed(userId) {
    return confirmedActions.has(userId);
}

function getAndRemove(userId) {
    const action = confirmedActions.get(userId);
    confirmedActions.delete(userId);
    return action;
}

module.exports = { confirmRequest, isConfirmed, getAndRemove };
