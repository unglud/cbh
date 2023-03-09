const crypto = require('crypto');

const TRIVIAL_PARTITION_KEY = '0';
const MAX_PARTITION_KEY_LENGTH = 256;

function generatePartitionKey (event) {
    if (event.partitionKey) {
        return event.partitionKey;
    }
    const data = JSON.stringify(event);
    return crypto.createHash('sha3-512').update(data).digest('hex');
}

exports.deterministicPartitionKey = function(event) {
    if (!event) {
        return TRIVIAL_PARTITION_KEY
    }
    let candidate = generatePartitionKey(event);

    if (candidate.length > MAX_PARTITION_KEY_LENGTH) {
        candidate = generatePartitionKey(candidate);
    }

    return candidate;
};
