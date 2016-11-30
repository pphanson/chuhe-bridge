module.exports = function ({from, to, values, interval})
{
    let collection = [];

    if ($.isArray(values))
    {
        for (let value of values)
        {
            let series = {
              data: [],
              color: 'white'
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
