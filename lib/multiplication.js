import {getRandomInt} from './util.js';
import _ from 'lodash';

export function multiplication(size, min, max) {
    return _.map(_.range(size), () => mul(min, max));
}

function mul(lowerBound, upperBound) {
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
        operator: '*',
        answer: firstNumber * secondNumber
    };
}

// module.exports = {multiplication};