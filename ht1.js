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

const filterInvalid = R.filter(order => {
    return R.allPass([
        R.hasIn.bind(null, 'price', order),
        R.hasIn.bind(null, 'name', order),
        R.hasIn.bind(null, 'date', order),
    ])(order);
});

const capitalizeNames = R.map(order => {
    const words = order.name.split(' ');
    const name = R.pipe(
            R.map(word => {
                const letters = word.split('');
                const mapIndexed = R.addIndex(R.map);
                return R.pipe(
                    mapIndexed((letter, index) => {
                        if (index === 0){
                            return letter.toUpperCase();
                        } else {
                            return letter;
                        }
                    }),
                    R.join('')
                )(letters);
            }),
            R.join(' ')
        )(words);

    return Object.assign({}, order, { name });
    
});

const dollarifyPrice = R.map(order => Object.assign({}, order, {price :`$${order.price}`}));

const groupByDate = R.groupBy(order => order.date);

const fillArray = (arr, length) => {
    const zeros = Array(length - arr.length);
    zeros.fill(0);

    return Array.concat(arr, zeros);
};

const matrixify = R.pipe(
    R.toPairs,
    R.map(R.flatten),
    R.transpose
);

const result = R.pipe(
    filterInvalid, 
    capitalizeNames,
    dollarifyPrice,
    groupByDate,
    matrixify
)(orders);

console.log(result)