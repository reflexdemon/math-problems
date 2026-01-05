import {getRandomInt} from './util.js';
import _ from 'lodash';

export function division(size, min, max) {
    return _.map(_.range(size), () => div(min, max));
}

function div(lowerBound, upperBound) {
    let secondNumber = getRandomInt(lowerBound, upperBound);
    let answer = getRandomInt(lowerBound, upperBound);
    let firstNumber = secondNumber * answer;

    return {
        firstNumber: firstNumber,
        secondNumber: secondNumber,
        operator: '/',
        answer: answer
    };
}

// module.exports = {division};