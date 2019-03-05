const _ = require('lodash');
const request = require('request');
const fs = require('fs');
const Handlebars = require('handlebars');
const pdf = require('html-pdf');

let baseURL = 'https://math.vpv.io';
var options = { format: 'Letter' };

request({url: baseURL + '/api/add?size=90&min=0&max=15'}, responseHandler);
request({ url: baseURL + '/api/sub?size=90&min=0&max=15' }, responseHandler);


let counter = 0;
let responseCount = 0;

function responseHandler(err, response, body) {
    responseCount++;
    var parsed = [];
    var column = [];
    if (err) {
        console.log('Problem while accessing API:', err);
        return;
    } else {
        var result = JSON.parse(body);
        // console.log(response);
        _.forEach(result, (item) => {
            // console.log(item);
            // answers.push(item.answer);
            // console.log(spacePad(item.firstNumber, 2));
            // console.log(spacePad(item.secondNumber, 2) + ' ' + item.operator);
            // console.log('_____\n\n_____');
            column.push( {
                firstNumber : spacePad(item.firstNumber, 2),
                secondNumber : spacePad(item.secondNumber, 2),
                operator: item.operator
            });
            if ((++counter % 9) === 0) {
                // console.log('\n');
                parsed.push(column);
                column = [];
            }
        });
        // console.log('RESULT:' + JSON.stringify(parsed, null, 4));
        var source = fs.readFileSync('./template.hbs', 'utf8');
        var template = Handlebars.compile(source);
        var result = template(parsed);
        fs.writeFileSync('./docs/index' + responseCount + '.html', result);
        fs.writeFileSync('./docs/answres' + responseCount + '.txt', _.map(result, item => printAnswer(item) ).join('\n'));
        pdf.create(result).toFile('./docs/output' + responseCount + '.pdf',function(err, res){
            console.log(res.filename);
          });
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