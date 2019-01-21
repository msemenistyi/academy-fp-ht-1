// const R = require('ramda');

const orders = [
    { name: 'TV', price: 300, date: '2018-10-10' },
    { name: 'laptop', price: 600, date: '2018-10-12' },
    { name: 'PC', price: 800, date: '2018-09-05' },
    { name: 'owen', price: 300 },
    { name: 'Camera', price: 500, date: '2018-03-03' },
    { name: 'Fridge', price: 1000, date: '2018-12-11' },
    { name: 'table', price: 150, date: '2018-12-10' },
    { name: 'Sofa', price: 400, date: '2018-12-10' },
    { name: 'chair', date: '2018-09-10' },
    { name: 'Window', price: 300, date: '2018-05-05' }
];

const isValid = R.allPass([
    R.hasIn('price'),
    R.hasIn('name'),
    R.hasIn('date'),
]);

const filterInvalid = (orders) => {
    const invalidOrders = R.filter(order => !isValid(order),  orders);
    const validOrders = R.filter(order => isValid(order), orders);
    return { invalidOrders, validOrders }
};

const capitalizeNames = R.map(order => {
    const words = order.name.split(' ');
    const name = R.pipe(
            R.map(word => {
                const letters = word.split('');
                const mapIndexed = R.addIndex(R.map);
                return R.pipe(
                    mapIndexed((letter, index) => index === 0 ? letter.toUpperCase() : letter),
                    R.join('')
                )(letters);
            }),
            R.join(' ')
        )(words);

    return Object.assign({}, order, { name });
    
});

const dollarifyPrice = R.map(order => Object.assign({}, order, {price :`$${order.price}`}));

const groupByDate = R.groupBy(order => order.date);

const fillArray = (length, arr) => {
    const elements = Array(length - arr.length);

    return arr.concat(elements);
};

const evenMatrixLength = (matrix) => {
    const maxLength = R.reduce((acc, value) => value.length > acc ? value.length : acc, 0, matrix)
    const curriedFillArray = R.curry(fillArray);
    return R.map(curriedFillArray(maxLength), matrix);
}

const matrixify = R.pipe(
    R.toPairs,
    R.map(R.flatten),
    evenMatrixLength,
    R.transpose
);

const printValidOrders = (data) => {
    const dataHeader = data[0];
    const dataRows = data.slice(1);

    const headerColumns = R.pipe(
        R.map((date) => {
        return `<td><b>${date}</b></td>`;
        }),
        R.join('')
    )(dataHeader);

    const headerHTML = `<tr>${headerColumns}</tr>`;

    const rowsHTML = R.pipe(
        R.map((row) => {
            const columns = R.map((column) => {
                if (column){
                    return `<td>${column.name} - ${column.price} </td>`;
                } else {
                    return `<td></td>`;
                }
            }, row)
            
            return ['<tr>', ...columns, '</tr>'].join('');
        }),
        R.join('')
    )(dataRows);

    const table = document.createElement('table');
    table.innerHTML = `${headerHTML}${rowsHTML}`;
    document.body.appendChild(table);
};

const printInvalidOrders = (invalidOrders) => {
    const header = `<h3>Incorrect rows</h3>`;

    const rowsHTML = R.map((order) => {
        const orderJSON = JSON.stringify(order);
        return `<div>${orderJSON},</div>`;
    }, invalidOrders);

    const incorrectRowsHTML = [header, ...rowsHTML].join('');
    const incorrectRowsEl = document.createElement('div');
    incorrectRowsEl.innerHTML = incorrectRowsHTML;
    document.body.appendChild(incorrectRowsEl);
}

const {invalidOrders, validOrders} = filterInvalid(orders);

R.pipe(
    capitalizeNames,
    dollarifyPrice,
    groupByDate,
    matrixify,
    printValidOrders
)(validOrders);

printInvalidOrders(invalidOrders);