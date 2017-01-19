require("./style.less");

const monitor = require('../');
const { fetchSensorDat } = require('../common/remote');
const { id, lineChart, gauge, bridgeScene } = monitor({
    type: '07',
    unit: '℃',
    values: ['temperature', 'humidity'],
    value: 'temperature',
    min: -20,
    max: 100});

$(`div.chuhe-monitor ul.chuhe-linechart-value-switch`).on('click', 'li', e => {
    const id = $(e.currentTarget).attr('id');
    const $unit = $('div.chuhe-stats-card  span.card-unit');
    if (id === 'humidity')
    {
      $unit.text(`(%)`);
    }
    else {
      $unit.html(`(&#8451;)`);
    }

});
