// Portfolio

function sticky_relocate() {
    var window_top = $(window).scrollTop();
    var div_top = $('#sticky-anchor').offset().top;
    console.log(window_top)
    console.log(div_top)
    if (window_top > div_top) {
        $('#sticky').addClass('stick');
        $('#sticky-anchor').height($('#sticky').outerHeight());
    } else {
        $('#sticky').removeClass('stick');
        $('#sticky-anchor').height(0);
    }
}

$(window).scroll(sticky_relocate);
sticky_relocate();