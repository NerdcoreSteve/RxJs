const
    R = require('ramda'),
    Rx = require('rx'),
    tap = x => { console.log(x); return x }

Rx.Observable.fromEvent(
    document.querySelectorAll('#click-me'),
    'click')
        .subscribe(e => console.log(`You clicked the "${e.target.innerHTML}" button!!`))

const second = (x, y) => y
const calculatorSeed = {prevValue: '0', value: '0', operation: second, newNumber: true}
//TODO need to deal with floats by turning them into ints because of float weidness
const operate = acc => acc.operation(parseFloat(acc.prevValue), parseFloat(acc.value)) + ''
const loadOperate = (acc, operation) => ({
        ...acc,
        newNumber: true,
        value: operate(acc),
        operation
    })
//TODO refactor to make nicer
const calculator = (acc, button) => {
    switch(button) {
        case '+':
            return loadOperate(acc, R.add)
        case '-':
            return loadOperate(acc, R.subtract)
        case '*':
            return loadOperate(acc, R.multiply)
        case '/':
            return loadOperate(acc, R.divide)
        case '=':
            return loadOperate(acc, second)
        case 'c':
            return calculatorSeed
        default:
            var newAcc = {
                ...acc,
                newNumber: false,
                prevValue: acc.newNumber ? acc.value : acc.prevValue,
                value:
                    R.pipe(
                        value => acc.newNumber ? '' : value,
                        value =>
                            button === '.'
                                ? value.match(/\./) ? value : value + button
                                : R.pipe(
                                    R.concat(value),
                                    R.replace(/^(?:0+)?(.*)/, '$1'),
                                    R.replace(/^(?:\.)+?(.*)/, '0.$1'),
                                    R.replace(/^$/, '0'))
                                        (button))
                        (acc.value)
            }
            return newAcc
    }
}

Rx.Observable.fromEvent(
    document.querySelectorAll('.numpad'),
    'click')
        .map(R.path(['target', 'innerHTML']))
        .scan(calculator, calculatorSeed)
        .map(R.prop('value'))
        .subscribe(n => document.querySelector('#calc-screen').innerHTML = n)
