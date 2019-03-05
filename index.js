const _ = require('lodash');
const request = require('request');
const fs = require('fs');
const Handlebars = require('handlebars');

let baseURL = 'https://math.vpv.io';


request({url: baseURL + '/api/add?size=70&min=0&max=15'}, responseHandler);
request({ url: baseURL + '/api/sub?size=70&min=0&max=15' }, responseHandler);



let counter = 0;

function responseHandler(err, response, body) {

    var parsed = [];
    var column = [];
    if (err) {
        console.log('Problem while accessing API:', err);
        return;
    } else {
        var result = JSON.parse(body);
        // console.log(result);
        _.forEach(result, (item) => {
            // console.log(item);
            // answers.push(item.answer);
            // console.log(spacePad(item.firstNumber, 2));
            // console.log(spacePad(item.secondNumber, 2) + ' ' + item.operator);
            // console.log('_____\n\n_____');
            column.push(item);
            if ((++counter % 7) === 0) {
                // console.log('\n');
                parsed.push(column);
                column = [];
            }
        });
        console.log('RESULT:' + JSON.stringify(parsed, null, 4));
        var source = fs.readFileSync('./template.hbs', 'utf8');
        var template = Handlebars.compile(source);
        var result = template(parsed);
        fs.writeFileSync('./output.html', result);
        fs.writeFileSync('./parsed.json', JSON.stringify(parsed, null, 4));
        // console.log('\n\nANSWERS:', _.map(result, item => printAnswer(item) ).join('\n'));
    }

}

function printAnswer(item) {
    let str = '';
    str+=item.firstNumber;
    str+=item.operator;
    str+=item.secondNumber + '=';
    str+=item.answer;
    return str;
}

function spacePad(num, places) {
    var space = places - num.toString().length + 1;
    return Array(+(space > 0 && space)).join(" ") + num;
}