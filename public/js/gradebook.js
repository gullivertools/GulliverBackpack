$(document).ready(function() {
    setup();
    events();
});

function setup() {
    let classes = $('.class');

    for(let c = 0; c < classes.length; c++) {
        $(classes[c]).attr('id', 'class-' + c); // set classes id
        $(classes[c]).css({'height': $(classes[c]).height()}); // set height so animation can run smoothly
    } 
}

function events() {
    $('.class-info').click(function(event) {
        // toggle library
        let currentClass = $(event.currentTarget).parent();
        if($(currentClass).hasClass('opened')) {
            // here is is opened so we must close it
            $(currentClass).removeClass('opened');
            $(currentClass).css({'height': 40});
        } else {
            // here it is closed so we must open it
            $(currentClass).addClass('opened');
            let height = $(currentClass).find('.class-details').outerHeight();
            console.log('height: ', height);
            $(currentClass).css({'height': height + 40});
        }
    })
}

function openClasses() {
    $('.class').addClass('opened');
    $('.class').css({'height': 'auto'});
}

function closeClasses() {
    $('.class').removeClass('opened');
    $('.class').css({'height': 40});
}