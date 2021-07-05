const fs = require('fs');
const JsonFormat = require('json-format');

const config = {
    tab: { size: 1 },
    space: { size: 2 },
    type: 'tab'
}

fs.readFile('./package.json', { encoding: 'utf8' }, function(err, data) {
    if (err) {
        throw err;
    }
    data = JSON.parse(data);
    const oldV = data.version;
    data.version = update(data.version);
    const newV = data.version;
    fs.writeFile('package.json', JsonFormat(data, config), () => console.log(`\nupdate package.json, from ${oldV} to ${newV}\n`));
});


// require ^0 . 0-9 . 0-9
function update(version) {
    const arr = version.split('.').map(x => parseInt(x));
    arr[2] += 1;
    return arr.join('.');
    if (arr[2] < 9) {
        arr[2] += 1;
    } else {
        arr[2] = 0;
        arr[1] += 1;
        if (arr[1] > 9) {
            arr[1] = 0;
            arr[0] += 1;
        }
    }
    return arr.join('.');
}