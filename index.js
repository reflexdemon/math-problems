const _ = require('lodash');
const request = require('request');

let baseURL = 'https://math.vpv.io';


request({url: baseURL + '/api/add?size=35&min=100&max=999'}, responseHandler);
request({ url: baseURL + '/api/sub?size=35&min=100&max=999' }, responseHandler);


let counter = 0;
function responseHandler(err, response, body) {

    if (err) {
        console.log('Problem while accessing API:', err);
        return;
    } else {
        var result = JSON.parse(body);
        // console.log(result);
        _.forEach(result, (item) => {
            // console.log(item);
            console.log(spacePad(item.firstNumber, 3));
            console.log(spacePad(item.secondNumber, 3) + ' ' + item.operator);
            console.log('_________\n\n_________');
            if ((++counter % 7)) {
                console.log('\n');
            }
        });
    }

}


function spacePad(num, places) {
    var space = places - num.toString().length + 1;
    return Array(+(space > 0 && space)).join(" ") + num;
}