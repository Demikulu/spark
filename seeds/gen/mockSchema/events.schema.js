/*
See https://github.com/danibram/mocker-data-generator for data-types and usage.
 */
const EVENT_MOCK_SCHEMA = {
    NAME: 'event',
    PK: 'event_id',
    STRUCTURE: {
        id: {
            virtual: true,
            incrementalId: 2018
        },
        event_id: {
            function: function() {
                const year = this.object.id;
                return `MIDBURN${year}`
            }
        },
        name: {
            function: function() {
                const year = this.object.id;
                return `Midbrun ${year} מידברן`
            }
        },
        gate_code: {
            faker: 'random.number'
        },
        gate_status: {
            values: ['regular']
        }
    }
};

module.exports = EVENT_MOCK_SCHEMA;
