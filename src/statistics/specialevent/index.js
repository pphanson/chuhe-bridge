require('./style.less');
const requestUtil = require('../../monitor/common/remote');

jQuery('#beginTime').datetimepicker();
jQuery('#endTime').datetimepicker();

jQuery('#beginTime2').datetimepicker();
jQuery('#endTime2').datetimepicker();
$('button#creat-things').on("click", e =>{
    // $("#chuhe-creat").show();
    $("div#chuhe-creat").openModal();
});

$('button#chuhe-close').on("click", e =>{
    $("div#chuhe-creat").closeModal();
    e.preventDefault();
});


function loadFormData(data)
{
    $("div#chuhe-creat").data(Object.assign({}, data));

}


/**
 *  生成表结构
 */

function initRows(count = 15)
{
    var $tbody = $('table > tbody');

    for (let i = 0; i < count; i++)
    {
        let $row = $(`<tr data-row-index=${i}><td data-field="name"></td><td data-field="age"></td></tr>`);

        $tbody.append($row);
    }

    $tbody.on('click', 'tr > td[name=edit] > a', function(e){
        var $el = $(e.curretTarget);
        var $row = $el.parent().parent();
        var data = $row.data();

    });
}

let initialLoad = false;

let cache = [];



function fetchData(from, to, pageIndex = 0)
{
    if (cache[pageIndex]){
        updateRows(cache[pageIndex])
    }
    else{
        requestUtil.getAllEvents(from.toJSON(), to.toJSON(), pageIndex).then((result) => {
            cache[pageIndex] = result;
            updateRows(result);
        });
    }

}

function updateRows(result)
{
    // 更新数据

    var $rows = $('table > tbody > tr');
    const data = result.data;
    const sum = result.sum;
    const pageIndex = result.pageIndex;

    $rows.each(function(index, row){
        $(this).data(data[index]);
       $(this).find("td[data-field='name']").data[index].name;
    });

    // 更新分页器
    if (!initialLoad) {
        //生成分页器

        addClass('selected');
        $('.pageNavi').on('click', '.pageNaviItem', e => {
            var $pageItem = $(e.currentTarget);
            var $nav = $(e.target);

            $nav.find('.selected').removeClass('selected');
            $pageItem.addClass('selected')
            const pageIndex = $pageItem.attr('data-pageIndex');
            fetchData(pageIndex);
        })

    }
}

/**
 * 动态获取后台数据
 */
let from = new Date(new Date().getFullYear(),new Date().getMonth() - 2, new Date().getDate())
let to = new Date();
requestUtil.getAllEvents(from.toJSON(), to.toJSON(), 0).then((data) => {
    addTableNumber(data);
});

function addTableNumber(data) {
    let tr = "";
    $.each(data, function (index) {
        tr += '<tr><td>' + new Date(data[index].startTime).pattern("yyyy-MM-dd hh:mm:ss") + '&nbsp&nbsp至&nbsp&nbsp' + new Date(data[index].endTime).pattern("yyyy-MM-dd hh:mm:ss") + '</td><td>' +
            data[index].eventName + '</td><td>' + data[index].eventTypeId + '</td>' +
            '<td><a href="#">事件详情</a></td><td><a href="/analytics/specialdetail/index.html">修改</a></td></tr>';
    });
    $('tbody#tbody').html(tr);
    $('tr:even').css('background', '#192e46');
    $('tr:odd').css('background', '#1f3653');
}

/**
 * 新建特殊事件事件
 */
$('div#chuhe-creat').on('click', 'button#chuhe-finish', e => {
    const $form = $(e.target);
    const $button = $(e.currentTarget);
;
    let startTime = new Date(document.getElementById("beginTime2").value); // $form.find('input#beginTime2').val()
    let endTime = new Date(document.getElementById("endTime2").value);
    let eventName = document.getElementById("thingsName").value;
    let eventTypeId = [];
    $("input[type=checkbox]:checked").each(function(){
        eventTypeId.push($(this).val());
    });
    // alert(eventTypeId.toString());
    requestUtil.addNewEvents(startTime.toJSON(), endTime.toJSON(), eventName, eventTypeId.toString()).then((data) => {
        $("div#chuhe-creat").closeModal();
        e.preventDefault();
    });
});



$("button#searchBtn").on('click', e => {
    let beginTime = new Date(document.getElementById("beginTime").value);
    let endTime = new Date(document.getElementById("endTime").value);
    let keyWord = document.getElementById("keyWord").value;

    cache = [];

    // requestUtil.getSearchTable(beginTime.toJSON(), endTime.toJSON(), 0, keyWord).then((data) =>{
    //     addTableNumber(data);
    // })
    fetchData(beginTime, endTime, 0)
})

/**
 * 格式化时间
 */
Date.prototype.pattern=function(fmt) {
    var o = {
        "M+" : this.getMonth()+1, //月份
        "d+" : this.getDate(), //日
        "h+" : this.getHours()%12 == 0 ? 12 : this.getHours()%12, //小时
        "H+" : this.getHours(), //小时
        "m+" : this.getMinutes(), //分
        "s+" : this.getSeconds(), //秒
        "q+" : Math.floor((this.getMonth()+3)/3), //季度
        "S" : this.getMilliseconds() //毫秒
    };
    var week = {
        "0" : "/u65e5",
        "1" : "/u4e00",
        "2" : "/u4e8c",
        "3" : "/u4e09",
        "4" : "/u56db",
        "5" : "/u4e94",
        "6" : "/u516d"
    };
    if(/(y+)/.test(fmt)){
        fmt=fmt.replace(RegExp.$1, (this.getFullYear()+"").substr(4 - RegExp.$1.length));
    }
    if(/(E+)/.test(fmt)){
        fmt=fmt.replace(RegExp.$1, ((RegExp.$1.length>1) ? (RegExp.$1.length>2 ? "/u661f/u671f" : "/u5468") : "")+week[this.getDay()+""]);
    }
    for(var k in o){
        if(new RegExp("("+ k +")").test(fmt)){
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));
        }
    }
    return fmt;
}