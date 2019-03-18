const _ = require('lodash');
const request = require('request');
const fs = require('fs');
const Handlebars = require('handlebars');
const pdf = require('html-pdf');
const dateFormat = require('dateformat');

const now = new Date();

let baseURL = 'https://math.vpv.io';
var options = {
    // format: 'Letter'
    height: "13.5in",        // allowed units: mm, cm, in, px
    width: "9in",            // allowed units: mm, cm, in, px
 };

request({url: baseURL + '/api/add?size=90&min=1&max=18'}, responseHandler);
request({ url: baseURL + '/api/sub?size=90&min=1&max=18' }, responseHandler);


let counter = 0;
let responseCount = 0;
let resultCollection = [];
function responseHandler(err, response, body) {
    responseCount++;
    var parsed = [];
    var column = [];
    if (err) {
        console.log('Problem while accessing API:', err);
        return;
    } else {
        var result = JSON.parse(body);
        resultCollection.push(result);
        if (resultCollection.length == 1) {
          return;
        }
        // console.log(response);
        var collectedValues = _.shuffle(_.flattenDeep(resultCollection));
        _.forEach(collectedValues, (item) => {
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
        var answers = 'Answers: \n' + _.map(collectedValues, item => printAnswer(item) ).join('\n');
        // console.log(answers);
        var source = fs.readFileSync('./template.hbs', 'utf8');
        var template = Handlebars.compile(source);
        var html = template({
            data: parsed,
            meta: {
                created: dateFormat(now, "dd-mmm-yyyy")
            }
        });
        fs.writeFileSync('./docs/problems.html', html);
        fs.writeFileSync('./docs/answers.txt', answers);
        pdf.create(html, options).toFile('./docs/print.pdf',function(err, res){
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
