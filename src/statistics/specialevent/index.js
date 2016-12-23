require('./style.less');

$('tr:even').css('background', '#192e46');
$('tr:odd').css('background', '#1f3653');

$('button#creat-things').on("click", e =>{
    $("#chuhe-creat").show();
});

$('button#chuhe-close').on("click", e =>{
    $("#chuhe-creat").hide();
});
