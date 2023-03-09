const assert = require('assert');
const crypto = require("crypto");
const {deterministicPartitionKey} = require('./dpk');

describe('deterministicPartitionKey', () => {
    it('should return a string', () => {
        const result = deterministicPartitionKey({});
        assert.strictEqual(typeof result, 'string');
    });

    it('should return a 0 partition key if no event is provided', () => {
        const result = deterministicPartitionKey();
        assert.strictEqual(result, '0');
    });

    it('should return a partition key if event has a partition key', () => {
        const event = {partitionKey: 'my-partition-key'};
        const result = deterministicPartitionKey(event);
        assert.strictEqual(result, 'my-partition-key');
    });

    it('should generate a deterministic partition key for an event without a partition key', () => {
        const event = {name: 'my-event'};
        const expected = crypto.createHash('sha3-512').update(JSON.stringify(event)).digest('hex');
        const result = deterministicPartitionKey(event);
        assert.strictEqual(result, expected);
    });

    it('should generate a hash partition key if the candidate is too long', () => {
        const longKey = 'a'.repeat(300);
        const expected = crypto.createHash('sha3-512').update(JSON.stringify(longKey)).digest('hex');
        const result = deterministicPartitionKey({partitionKey: longKey});
        assert.strictEqual(result, expected);
    });
});
