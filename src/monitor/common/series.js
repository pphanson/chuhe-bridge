module.exports = function ({from, to, values, interval})
{
    let collection = [];

    if ($.isArray(values))
    {
        for (let value of values)
        {
            let series = {
              data: [],
              color: 'white',
              lines: {
                fill: true,
                fillColor: {colors: ['rgba(64, 24, 185, 1)', 'rgba(64, 24, 185, 0.2)']}
              }
            };
            collection.push(series);
            collection[value] = series;
        }
    }

    let count = Math.ceil((to - from) / interval);

    for (let i = 0; i < count; i++)
    {
        for (let series of collection)
        {
            series.data.push([
                from.getTime() + i * interval,
                null
            ]);
        }

    }

    return collection;
};
