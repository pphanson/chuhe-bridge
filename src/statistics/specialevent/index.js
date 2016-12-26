require('./style.less');
const requestUtil = require('../../monitor/common/remote');

$('tr:even').css('background', '#192e46');
$('tr:odd').css('background', '#1f3653');

$('button#creat-things').on("click", e =>{
    $("#chuhe-creat").show();
});

$('button#chuhe-close').on("click", e =>{
    $("#chuhe-creat").hide();
    e.preventDefault();
});

/**
 * 新建特殊事件事件
 */
$('button#chuhe-finish').on('click', e => {

    let startTime = new Date(document.getElementById("beginTime2").value);
    let endTime = new Date(document.getElementById("endTime2").value);
    let eventName = document.getElementById("thingsName").value;
    let eventTypeId = [];
    $("input[type=checkbox]:checked").each(function(){
        eventTypeId.push($(this).val());
    });
    // alert(eventTypeId.toString());
    requestUtil.addEvents(startTime.toJSON(), endTime.toJSON(), eventName, eventTypeId.toString()).then(data => {
        //alert("aaa");
    });
});

/**
 * 动态获取后台数据
 */
let from = new Date(new Date().getFullYear(),new Date().getMonth() - 1, new Date().getDate())
let to = new Date();
requestUtil.getAllEvents(from.toJSON(), to.toJSON(), 0).then(data => {
    alert("qqq");
$('table#tbody').each(data, function (index) {
    let tr = "<tr>";
    tr += '<td>' + new Date(data[index].startTime) + '-' + new Date(data[index].endTime) + '</td>' + '<td>' +
         data[index].eventName + '</td>' + '<td>' + data[index].eventTypeId + '</td>' +
        '<td><a href="#">事件详情</a></td>' + '<td><a href="#">修改</a></td>';
    tr += "</tr>";
});
});
