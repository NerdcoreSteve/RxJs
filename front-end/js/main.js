const
    R = require('ramda'),
    Rx = require('rx'),
    tap = x => { console.log(x); return x }

Rx.Observable.fromEvent(
    document.querySelectorAll('#click-me'),
    'click')
        .subscribe(e => console.log(`You clicked the "${e.target.innerHTML}" button!!`))

const calculator = (acc, button) => {
    switch(button) {
        case '=':
            return acc
        default:
            return acc + button
    }
}

Rx.Observable.fromEvent(
    document.querySelectorAll('.numpad'),
    'click')
        .map(e => e.target.innerHTML)
        .scan(calculator, "")
        .subscribe(n => document.querySelector('#calc-screen').innerHTML = n)
