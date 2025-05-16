const cooldowns = new Map();

function checkCooldown(userId, duration = 10000) {
    if (cooldowns.has(userId)) {
        const lastUsed = cooldowns.get(userId);
        if (Date.now() - lastUsed < duration) {
            return false;
        }
    }
    cooldowns.set(userId, Date.now());
    return true;
}

module.exports = { checkCooldown };
