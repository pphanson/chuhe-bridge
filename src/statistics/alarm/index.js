require('./style.less');

const requestUtil = require('../../monitor/common/remote');
const type = {
    0: "全部",
    1: "数值报警",
    2: "传感器报警"
}
jQuery('#beginTime').datetimepicker();
jQuery('#endTime').datetimepicker();

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

/**
 *实时获取当前数据
 */
let from = new Date(new Date().getFullYear(),new Date().getMonth() - 2, new Date().getDate())
let to = new Date();
let alarmType = type[$("#alarmType li[selected]").val()];
let level = $("#alarmLevel li[selected]").val();
let page = 0;
let cache = [];
let initialLoad = false;
starta();
function starta() {
    initRows();
}
/**
 * 生成初始化表结构
 */
function initRows(count = 10)
{
    const $tbody = $('table > tbody');

    for (let i = 0; i < count; i++)
    {
        let $row = $(`<tr data-row-index=${i}><td data-field="timestamp"></td><td data-field="alarm_type"></td><td data-field="alarm_lever"></td>
            <td data-field="sensor_name"></td><td data-field="alarm_content"></td><td data-field="alarm_value"></td></tr>`);

        $tbody.append($row);
        $('tr:even').css('background', '#192e46');
        $('tr:odd').css('background', '#1f3653');
    }
    fetchData(from, to, page, level, alarmType);
    addSelected();

}

function fetchData(from, to, page, level, alarmType)
{
    if (cache[page]){
        alert("aaa");
        getOldRows(page);
    }
    else{
        requestUtil.getAlarmDate(from.toJSON(), to.toJSON(), page, level, alarmType).then((resule) => {
            cache[page] = resule.docs;
            addTableNumber(resule.docs, resule.sumpage);
        });
    }
}

function getOldRows(page) {
    let data = cache[page];
    updateTr(data);
}

function addTableNumber(result,sumPage)         // 更新数据
{
    updateTr(result);

    if (!initialLoad) { //生成分页器
        let $ul = $('ul.pagination> span');
        $ul.empty();
        for (let i=0; i<sumPage; i++){
            let li = $(`<li class="paginate_button waves-effect" aria-controls="data-table-simple" data-dt-idx="${i+1}">${i+1}</li>`);
            $ul.append(li);
            if (i === 0){
                li.addClass('active');
                $('ul.pagination>li.chuhe-left').addClass('disabled');
            }
        }
        initialLoad = true;
    }
}

function updateTr(data) {// data是否有数据，要判断！
    let $tbody = $(".chuhe-alarm-table>table tbody");
    $tbody.find("td").html("");
    let $trrows = $tbody.find("tr");

    $trrows.each(function(index){
        if (data.length !== 0) {
            $($trrows[index]).find("td[data-field=timestamp]").text(new Date(data[index].timestamp).pattern("yyyy-MM-dd hh:mm:ss"));
            $($trrows[index]).find("td[data-field=alarm_type]").text(data[index].alarm_type);
            $($trrows[index]).find("td[data-field=alarm_lever]").text(data[index].alarm_lever);
            $($trrows[index]).find("td[data-field=sensor_name]").text(data[index].sensor_name);
            $($trrows[index]).find("td[data-field=alarm_content]").text(data[index].alarm_content);
            $($trrows[index]).find("td[data-field=alarm_value]").text(data[index].alarm_value);
        }
    });
}

// 添加选中事件
function addSelected() {
    let ul = $('ul.pagination');
    ul.on("click",'.paginate_button', e => {
        let $nav = $(e.target);
        ul.find('.active').removeClass('active');
        $nav.addClass('active');
        page = $nav.attr("data-dt-idx") - 1;
        fetchData(from, to, page, level, alarmType);
    })
}

addClick("alarmLevel");
addClick("alarmType");
function addClick(alarm) {
    $(`#${alarm}`).on("click", "li", function (e) {
        $(this).parent().find("li").removeAttr("selected");
        $(this).attr("selected","selected");
        level = $("#alarmLevel li[selected]").val();
        let Type = $("#alarmType li[selected]").text();
        $(".chuhe-select-alarm-level a").text($("#alarmLevel li[selected]").text());
        alarmType = type[$("#alarmType li[selected]").val()];
        $(".chuhe-select-alarm-type a").text(alarmType);
        cache[page] = undefined;
        fetchData(from, to, page, level, alarmType);
    })
}