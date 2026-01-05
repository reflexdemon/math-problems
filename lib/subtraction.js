import {getRandomInt} from './util.js';
import _ from 'lodash';

export function subtraction(size, min, max) {
    return _.map(_.range(size), () => sub(min, max));
}

function sub(lowerBound, upperBound) {
    let firstNumber = getRandomInt(lowerBound, upperBound);
    let secondNumber = getRandomInt(lowerBound, upperBound);
    if (firstNumber < secondNumber) {
        //swap
        let temp = firstNumber;
        firstNumber = secondNumber;
        secondNumber = temp;
    }
    return {
        firstNumber: firstNumber,
        secondNumber: secondNumber,
        operator: '-',
        answer: firstNumber - secondNumber
    };
}

// module.exports = {subtraction};