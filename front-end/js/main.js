require('whatwg-fetch')

const
    R = require('ramda'),
    Rx = require('rx'),
    tap = x => { console.log(x); return x }

//Click Me!
Rx.Observable.fromEvent(
    document.querySelectorAll('#click-me'),
    'click')
        .subscribe(e => console.log(`You clicked the "${e.target.innerHTML}" button!!`))

//Letters
const letterKeys =
    Rx.Observable.fromEvent(document, 'keypress')
        .map(R.prop('key'))
        .filter(R.pipe(R.match(/^[xyz]$/), R.length))

Rx.Observable.fromEvent(
    document.querySelectorAll('.letters'),
    'click')
        .map(R.path(['target', 'innerHTML']))
        .merge(letterKeys)
        .scan(R.concat, '')
        .subscribe(s => document.querySelector('#letter-screen').innerHTML = s)

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

const toggleNegative = n =>
    n === '0'
        ? n
        : n.match(/^-.*/)
            ? n.replace(/^-(.*)/, '$1')
            : '-' + n

const calculatorSeed = {
    prevValue: '0',
    value: '0',
    operation: second,
    newNumber: true
}

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
        case 'p':
            return {
                ...acc,
                value: toggleNegative(acc.value)
            }
        default:
            return {
                ...acc,
                newNumber: false,
                prevValue: acc.newNumber ? acc.value : acc.prevValue,
                value: updateValue(button, acc)
            }
    }
}

const calculatorKeys =
    Rx.Observable.fromEvent(document, 'keypress')
        .map(R.prop('key'))
        .filter(R.pipe(R.match(/^[\*\/\+-\dcp=]$/), R.length))

Rx.Observable.fromEvent(
    document.querySelectorAll('.numpad'),
    'click')
        .map(R.path(['target', 'innerHTML']))
        .map(button => button === '+/-' ? 'p' : button)
        .merge(calculatorKeys)
        .scan(calculator, calculatorSeed)
        .map(R.prop('value'))
        .subscribe(n => document.querySelector('#calc-screen').innerHTML = n)

//Story
const
    max = 6,
    min = 1,
    decFloor = (floor, x) => x - 1 < floor ? x : x - 1,
    incCeil = (ceil, x) => x + 1 > ceil ? x : x + 1,
    buttonFunc = (acc, button) => {
        switch(button) {
            case '<<':
                return min
            case '>>':
                return max
            case '<':
                return decFloor(min, acc)
            case '>':
                return incCeil(max, acc)
            case '<>':
                return min
            default:
                return acc
        }
    }
Rx.Observable.fromEvent(
    document.querySelectorAll('.story'),
    'click')
        .map(R.path(['target', 'innerText']))
        .scan(buttonFunc, min)
        .startWith(min)
        .map(pageNumber => `/story/${pageNumber}`)
        .flatMap(url => fetch(url))
        .flatMap(response => response.json())
        .map(R.prop('text'))
        .subscribe(text => document.querySelector('#story-screen').innerHTML = text)

//map vs flatMap or chain

console.log(
    R.map(x => [x, x], [1, 2, 3]))
// prints [ [ 1, 1 ], [ 2, 2 ], [ 3, 3 ] ]

console.log(
    R.chain(x => [x, x], [1, 2, 3]))
// prints [ 1, 1, 2, 2, 3, 3 ]
