require('./style.less');

$('tr:even').css('background', '#192e46');
$('tr:odd').css('background', '#1f3653');

$('button#creat-things').on("click", e =>{
    $("#chuhe-creat").show();
});

$('button#chuhe-close').on("click", e =>{
    $("#chuhe-creat").hide();
    e.preventDefault();
});

$('button#chuhe-finish').on('click', e => {

    let from = new Date(document.getElementById("beginTime2").value);
    let to = new Date(document.getElementById("endTime2").value);
    let name = document.getElementById("thingsName").value;

});