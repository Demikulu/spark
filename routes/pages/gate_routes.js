var express = require('express');
Event = require('../../models/event').Event;

var router = express.Router({
    mergeParams: true
});

var knex = require('../../libs/db').knex;
var userRole = require('../../libs/user_role');
var Event = require('../../models/event').Event;

router.get('/', userRole.isGateManager(), function (req, res) {
    Event.forge({event_id: req.user.currentEventId}).fetch().then(event => {
        return res.render('pages/gate', {
            gate_code: event.attributes.gate_code
        });
    });
});

router.get('/ajax/tickets',
    [userRole.isGateManager()], async function (req, res) {

    const MINIMUM_LENGTH = 3;

    if (!req.query.search || req.query.search.length < MINIMUM_LENGTH) {
        // If not meeting a minimum length, return empty results.
        return res.status(200).json({rows: [], total: 0});
    }

    let event = await Event.forge({event_id: req.user.currentEventId}).fetch();
    let gate_status = event.attributes.gate_status;

    knex.select('*').from('tickets').leftJoin('users', 'tickets.holder_id', 'users.user_id')
        .where('event_id', req.user.currentEventId)
        .andWhere(function () {
            this.where('ticket_number', isNaN(parseInt(req.query.search))? req.query.search: parseInt(req.query.search))
            .orWhere('first_name', 'LIKE', '%' + req.query.search + '%')
            .orWhere('last_name', 'LIKE', '%' + req.query.search + '%')
            .orWhere('email', 'LIKE', '%' + req.query.search + '%')
            .orWhere('israeli_id', 'LIKE', '%' + req.query.search + '%')
            //.limit(parseInt(req.query.limit)).offset(parseInt(req.query.offset))
        })
        .then((tickets) => {
            res.status(200).json({rows: tickets, total: tickets.length})
        }).catch((err) => {
            res.status(500).json({
                error: true,
                data: {
                    message: err.message,
                    gate_status: gate_status
                }
            });
        });
});

module.exports = router;
