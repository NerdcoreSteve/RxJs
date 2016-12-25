const
    R = require('ramda'),
    $ = require('jquery'),
    Rx = require('rx'),
    tap = x => { console.log(x); return x }

$('#click-me').click(() => console.log('clicked!'))
