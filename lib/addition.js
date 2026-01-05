
import { getRandomInt } from './util.js';
import _ from 'lodash';

export function addition(size, min, max) {
    return _.map(_.range(size), () => add(min, max));
}

function add(lowerBound, upperBound) {
    let firstNumber = getRandomInt(lowerBound, upperBound);
    let  secondNumber = getRandomInt(lowerBound, upperBound);
    return {
        firstNumber: firstNumber,
        secondNumber: secondNumber,
        operator: '+',
        answer: firstNumber + secondNumber
    };
}

// module.exports = {addition};