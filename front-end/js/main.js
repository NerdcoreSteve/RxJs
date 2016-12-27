const
    R = require('ramda'),
    Rx = require('rx'),
    tap = x => { console.log(x); return x }

Rx.Observable.fromEvent(
    document.querySelectorAll('#click-me'),
    'click')
        .subscribe(e => console.log(`You clicked the "${e.target.innerHTML}" button!!`))

const calculatorSeed = {value: '0'}
const calculator = (acc, button) => {
    switch(button) {
        //TODO don't leave any fallthroughs!!!
        case '+':
        case '-':
        case '*':
        case '/':
        case '=':
            return acc
        case 'c':
            return calculatorSeed
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
