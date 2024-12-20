const _ = require('lodash');
const request = require('request');
const fs = require('fs');
const Handlebars = require('handlebars');
const pdf = require('html-pdf');
const dateFormat = require('dateformat');

const now = new Date();

const config = {
    min: 5,
    max: 20,
    size: 25,
    cols: 10,
    template: './template.hbs'
}

// const config = {
//     min: 5,
//     max: 20,
//     size: 15,
//     cols: 2,
//     template: './html_table_row_wise.template.hbs'
// }



// let baseURL = 'https://reflex-math.vpv.io';
let baseURL = 'http://localhost:8080';
var options = {
    format: 'Letter'
    // height: "9in",        // allowed units: mm, cm, in, px
    // width: "13.5in",            // allowed units: mm, cm, in, px
 };

var testsCount = 0;
request({url: baseURL + `/api/add?size=${config.size}&min=${config.min}&max=${config.max}`}, responseHandler);testsCount++;
request({ url: baseURL + `/api/sub?size=${config.size}&min=${config.min}&max=${config.max}` }, responseHandler);testsCount++;
// request({ url: baseURL + `/api/mul?size=${config.size}&min=${config.min}&max=${config.max}` }, responseHandler);testsCount++;



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
        if (resultCollection.length < testsCount) {
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
                firstNumber : spacePad(item.firstNumber, 3),
                secondNumber : spacePad(item.secondNumber, 3),
                operator: item.operator
            });
            if ((++counter % config.cols) === 0) {
                // console.log('\n');
                parsed.push(column);
                column = [];
            }
        });
        if (column && column.length) {
            parsed.push(column);
        }
        // console.log('RESULT:' + JSON.stringify(parsed, null, 4));
        var answers = 'Answers: \n' + _.map(collectedValues, item => printAnswer(item) ).join('\n');
        // console.log(answers);
        var source = fs.readFileSync(config.template, 'utf8');
        Handlebars.registerHelper("inc", function(value, options) {
                return parseInt(value) + 1;
        });
        var template = Handlebars.compile(source);
        var html = template({
            data: parsed,
            meta: {
                created: dateFormat(now, "dd-mmm-yyyy HH:MM:ss")
            }
        });
        fs.writeFileSync('./docs/problems.html', html);
        fs.writeFileSync('./docs/answers.txt', answers);
        pdf.create(html, options).toFile('./docs/print.pdf', function(err, res){
            if (err) console.log(err);
            if (res) console.log(res.filename);
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
