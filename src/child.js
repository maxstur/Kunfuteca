const { soldProducts } = require('./utils');

process.on('message', (message) => {
    console.log('message (from parent) received: ', message);
    const result = soldProducts();
    process.send(result);
})