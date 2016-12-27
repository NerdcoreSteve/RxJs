const
    R = require('ramda'),
    Rx = require('rx'),
    tap = x => { console.log(x); return x }

Rx.Observable.fromEvent(
    document.querySelectorAll('#click-me'),
    'click')
        .subscribe(e => console.log(`You clicked the "${e.target.innerHTML}" button!!`))

const calculatorSeed = {value: '0', operation: R.identity }
const calculator = (acc, button) => {
    switch(button) {
        //TODO don't leave any fallthroughs!!!
        case '+':
        case '-':
        case '*':
        case '/':
            return {
                ...acc,
                value: '0',
                operation: R.add(acc.value)
            }
        case '=':
            return {
                ...acc,
                value: acc.operation(acc.value) + '',
                operation: R.identity
            }
        case 'c':
            return calculatorSeed
        //TODO what happens if . is the first button pressed?
        case '.':
            return {
                ...acc,
                value: acc.value.match(/\./) ? acc.value : acc.value + button
            }
        default:
            return {
                ...acc,
                value: R.pipe(
                    R.concat(acc.value),
                    R.replace(/^(?:0+)?(.*)/, '$1'),
                    R.replace(/^(?:\.0)+?(.*)/, '0.0$1'),
                    R.replace(/^$/, '0'))
                        (button)
            }
    }
}

Rx.Observable.fromEvent(
    document.querySelectorAll('.numpad'),
    'click')
        .map(R.path(['target', 'innerHTML']))
        .scan(calculator, calculatorSeed)
        .map(R.prop('value'))
        .subscribe(n => document.querySelector('#calc-screen').innerHTML = n)
