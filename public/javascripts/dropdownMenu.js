var my_timer;
$(".dropdown").hover(function () {
    clearTimeout(my_timer);
    $(this).find('.dropdown-menu').show();
}, function () {
    my_timer = setTimeout(function () {
        $('.dropdown-menu').hide();
    }, 200);
});