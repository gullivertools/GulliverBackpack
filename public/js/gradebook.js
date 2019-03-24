$(document).ready(function() {
    setup();
    events();
});

function setup() {
    let classes = $('.class');

    console.log(classes.length)
    for(let c = 0; c < classes.length; c++) {
        $(classes[c]).attr('id', 'class-' + c); // set classes id
        $(classes[c]).css({'height': $(classes[c]).height()}); // set height so animation can run smoothly
    } 
}

function events() {
    $('.class').click(function(event) {
        // toggle library
        if($(event.currentTarget).hasClass('opened')) {
            // here is is opened so we must close it
            $(event.currentTarget).removeClass('opened');
            $(event.currentTarget).css({'height': 40});
        } else {
            // here it is closed so we must open it
            $(event.currentTarget).addClass('opened');
            $(event.currentTarget).css({'height': 300});
        }
    })
}

function openClasses() {
    $('.class').addClass('opened');
    $('.class').css({'height': 300});
}

function closeClasses() {
    $('.class').removeClass('opened');
    $('.class').css({'height': 40});
}