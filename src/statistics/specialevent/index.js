require('./style.less');
const requestUtil = require('../../monitor/common/remote');

jQuery.datetimepicker.setLocale('zh');
jQuery(function() {
    jQuery('#beginTime').datetimepicker({
        format: 'Y-m-d H:i',
        onShow: function ( ct ) {
            this.setOptions({
                maxDate:jQuery('#endTime').val()?jQuery('#endTime').val():false
            })
        },
        timepicker: true,
        theme:'dark'
    });
    jQuery('#endTime').datetimepicker({
        format: 'Y-m-d H:i',
        onShow: function ( ct ){
            this.setOptions({
                minDate:jQuery('#beginTime').val()?jQuery('#beginTime').val():false
            })
        },
        timepicker: true,
        theme:'dark'
    });
});

jQuery.datetimepicker.setLocale('zh');
jQuery(function() {
    jQuery('#beginTime2').datetimepicker({
        format: 'Y-m-d H:i',
        onShow: function ( ct ) {
            this.setOptions({
                maxDate:jQuery('#endTime2').val()?jQuery('#endTime2').val():false
            })
        },
        timepicker: true,
        theme:'dark'
    });
    jQuery('#endTime2').datetimepicker({
        format: 'Y-m-d H:i',
        onShow: function ( ct ){
            this.setOptions({
                minDate:jQuery('#beginTime2').val()?jQuery('#beginTime2').val():false
            })
        },
        timepicker: true,
        theme:'dark'
    });
});

$('button#create-things').on("click", e =>{
    $("div#chuhe-create input#beginTime2").val("");
    $("div#chuhe-create input#endTime2").val("");
    $("div#chuhe-create input#thingsName").val("");
    $('.chuhe-create-title').text('新建事件');
    $("div#chuhe-create").openModal();
});

$('button#chuhe-close').on("click", e =>{
    $("div#chuhe-create").closeModal();
    e.preventDefault();
});

const eventType = {
    'SPET_001':'大风事件',
    'SPET_002':'船撞事件',
    'SPET_003':'地震事件',
}

/**
 * 格式化时间
 */
Date.prototype.pattern=function(fmt) {
    let o = {
        "M+" : this.getMonth()+1, //月份
        "d+" : this.getDate(), //日
        "h+" : this.getHours()%12 == 0 ? 12 : this.getHours()%12, //小时
        "H+" : this.getHours(), //小时
        "m+" : this.getMinutes(), //分
        "s+" : this.getSeconds(), //秒
        "q+" : Math.floor((this.getMonth()+3)/3), //季度
        "S" : this.getMilliseconds() //毫秒
    };
    let week = {
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
 *生成初始时间
 */
let from = new Date(new Date().getFullYear(),new Date().getMonth() - 1, new Date().getDate()).pattern("yyyy-MM-dd hh:mm:ss")
let to = new Date().pattern("yyyy-MM-dd hh:mm:ss");
$("input#beginTime").val(from);
$("input#endTime").val(to);

function loadFormData(data)
{
    $("div#chuhe-create").data(Object.assign({}, data));
}

/**
 *  生成表结构
 */
let page = 0;
let cache = [];
let start = new Date($("input#beginTime").val());
let end = new Date($("input#endTime").val());
let initialLoad = false;
let changId;
starta();
function starta() {
    initRows();
}
function initRows(count = 10)
{
    const $tbody = $('table > tbody');

    for (let i = 0; i < count; i++)
    {
        let $row = $(`<tr data-row-index=${i}><td data-field="time"></td><td data-field="eventName"></td>
<td data-field="eventTypeId"></td><td name="detail"></td><td name="edit"></td></tr>`);

        $tbody.append($row);
        $('tr:even').css('background', '#192e46');
        $('tr:odd').css('background', '#1f3653');
    }
    fetchData(start, end, page);
    addSelected();
}

/**
 *  向后台请求数据
 */
function fetchData(start, end, page = 0, keywords)
{
    if (cache[page]){
        getOldRows(page);
    }
    else{
        if (keywords !== undefined) {
            requestUtil.getAllEvents(start.toJSON(), end.toJSON(), page, keywords).then((result) => {
                cache[page] = result.allevent;
                updateRows(result.allevent,result.sumpage);
            });
        }else {
            requestUtil.getAllEvents(start.toJSON(), end.toJSON(), page).then((result) => {
                cache[page] = result.allevent;
                updateRows(result.allevent,result.sumpage);
            });
        }

    }
}

function getOldRows(page) {
    let data = cache[page];
    updateTr(data);
}

function updateRows(result,sumPage)         // 更新数据
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
    let $tbody = $(".chuhe-specialEvent-table>table tbody");
    $tbody.find("td").html("");
    let $trrows = $tbody.find("tr");

    $trrows.each(function(index){
        if (data.length !== 0) {
            $($trrows[index]).find("td[name=detail]").attr("data-start",new Date(data[index].startTime).pattern("yyyy-MM-dd hh:mm:ss"));
            $($trrows[index]).find("td[name=detail]").attr("data-end",new Date(data[index].endTime).pattern("yyyy-MM-dd hh:mm:ss"));
            $($trrows[index]).find("td[name=edit]").attr("data-id",data[index]._id);
            $($trrows[index]).find("td[data-field=time]").text(new Date(data[index].startTime).pattern("yyyy-MM-dd hh:mm:ss") + "  至  " + new Date(data[index].endTime).pattern("yyyy-MM-dd hh:mm:ss"));
            $($trrows[index]).find("td[data-field=eventName]").text(data[index].eventName);
            $($trrows[index]).find("td[data-field=eventTypeId]").text(eventType[data[index].eventTypeId]);
            $($trrows[index]).find("td[name=edit]").html('<a href="#">修改</a>');
            $($trrows[index]).find("td[name=detail]").html('<a href="#">事件详情</a>');
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
        let keywords = document.getElementById("keyWord").value;
        fetchData(start, end, page, keywords);
    })
}

/**
 * 新建特殊事件事件
 */
$('div#chuhe-create').on('click', 'button#chuhe-finish', e => {
    let startTime = new Date(document.getElementById("beginTime2").value); //
    let endTime = new Date(document.getElementById("endTime2").value);
    let eventName = document.getElementById("thingsName").value;
    let eventTypeId = [];
    let changedId;
    if ($('.chuhe-create-title').text() === '修改事件'){
        changedId = changId;
    } else {
        changedId = undefined;
    }
    $("input[type=checkbox]:checked").each(function(){
        eventTypeId.push($(this).val());
    });
    requestUtil.addNewEvents(startTime.toJSON(), endTime.toJSON(), eventName, eventTypeId.toString(), changedId).then((data) => {
        $("div#chuhe-create").closeModal();
        e.preventDefault();
        starta();
    });
});

/**
 * 搜索的点击事件
 */
$("button#searchBtn").on('click', e => {
    let beginTime = new Date(document.getElementById("beginTime").value);
    let endTime = new Date(document.getElementById("endTime").value);
    let keywords = document.getElementById("keyWord").value;
    initialLoad = false;
    cache = [];
    page = 0;
    fetchData(beginTime, endTime, page, keywords);
})

/**
 * 事件详情的点击事件
 */
$(function() {
    $("table > tbody > tr").each(function(){
        let btn=$(this).children().eq(3);
        btn.bind("click",function(){
            let startData=btn.parent().children("td[name=detail]").attr('data-start');
            let endData=btn.parent().children("td[name=detail]").attr('data-end');
            localStorage.setItem('startData', startData);
            localStorage.setItem('endData', endData);
            location.href="/analytics/specialdetail/index.html";
        });
    });
});

/**
 * 修改的点击事件
 */
$(function() {
    $("table > tbody > tr").each(function(){
        let btnId=$(this).children().eq(4);
        btnId.bind("click",function(){
            changId=btnId.parent().children("td[name=edit]").attr('data-id');
            requestUtil.getchanged(changId).then((data)=>{
                let start = new Date(data[0].startTime).pattern("yyyy-MM-dd hh:mm:ss");
                let end = new Date(data[0].endTime).pattern("yyyy-MM-dd hh:mm:ss");
                let name = data[0].eventName;
                let typeId = data[0].eventTypeId;

                $("div#chuhe-create").openModal();

                $('.chuhe-create-title').text('修改事件');
                $('#beginTime2').val(start);
                $('#endTime2').val(end);
                $('#thingsName').val(name);
                for (let i = 0; i < 3; i++) {
                    if ($($('input[type=checkbox]')[i]).val() === typeId) {
                        $($('input[type=checkbox]')[i]).attr('checked',"checked");
                    }
                }
            })
        });

    });
});