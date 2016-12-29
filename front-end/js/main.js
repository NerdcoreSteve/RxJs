const
    R = require('ramda'),
    Rx = require('rx'),
    tap = x => { console.log(x); return x }

Rx.Observable.fromEvent(
    document.querySelectorAll('#click-me'),
    'click')
        .subscribe(e => console.log(`You clicked the "${e.target.innerHTML}" button!!`))

//Calculator
const second = (x, y) => y

const operate = acc => acc.operation(parseFloat(acc.prevValue), parseFloat(acc.value)) + ''

const operateLoadNextOperator = (acc, operation) => ({
        ...acc,
        newNumber: true,
        value: operate(acc),
        operation
    })

const buildNumber = R.curry(
    (digit, number) =>
        digit === '.'
            ? number.match(/\./) ? number : number + digit
            : R.pipe(
                R.concat(number),
                R.replace(/^(?:0+)?(.*)/, '$1'),
                R.replace(/^(?:\.)+?(.*)/, '0.$1'),
                R.replace(/^$/, '0'))
                    (digit))

const updateValue = (button, acc) =>
    R.pipe(
        value => acc.newNumber ? '' : value,
        buildNumber(button))
            (acc.value)

const calculatorSeed = {prevValue: '0', value: '0', operation: second, newNumber: true}
const calculator = (acc, button) => {
    switch(button) {
        case '+':
            return operateLoadNextOperator(acc, R.add)
        case '-':
            return operateLoadNextOperator(acc, R.subtract)
        case '*':
            return operateLoadNextOperator(acc, R.multiply)
        case '/':
            return operateLoadNextOperator(acc, R.divide)
        case '=':
            return operateLoadNextOperator(acc, second)
        case 'c':
            return calculatorSeed
        default:
            return {
                ...acc,
                newNumber: false,
                prevValue: acc.newNumber ? acc.value : acc.prevValue,
                value: updateValue(button, acc)
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
