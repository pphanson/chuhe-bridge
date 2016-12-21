require('./style.less');

$('tr:even').css('background', '#192e46');
$('tr:odd').css('background', '#1f3653');

$('#creat-things').on(click, e =>{
    $("#chuhe-creat").show();
});

$('#chuhe-finish').on(click, e =>{
    $("#chuhe-creat").hide();
});
