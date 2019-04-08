$(document).ready(function() {
    initCalendar(5, 7);
});

function initCalendar(row, columns) {
    const calendarHeight = $('.calendar').outerHeight() - $('.calendar-info').outerHeight();
    const calendarWidth = $('.calendar').outerWidth() - 8;
    
    // const cellHeight = (calendarHeight / row) - (1 * (row - 1)); // this accounts for the borders
    // const cellWidth = ((calendarWidth / columns) - (1 * (columns - 1)));

    const cellHeight = (calendarHeight / row);
    const cellWidth = (calendarWidth / columns);

    const month = new Date().getMonth();
    const dayNumber = new Date().getDay();

    console.log({
        calendarHeight,
        calendarWidth,
        cellHeight,
        cellWidth
    });

    // build the calendar
    const months = [
        'January',
        'February',
        'March',
        'April',
        'May',
        'June',
        'July',
        'August',
        'September',
        'October',
        'November',
        'December'
    ]
    let day = 0;
    cell = '';
    for(let i = 0; i < columns; i++) {
        for(let j = 0; j < row; j++) {
            let number = (day % 30) + 1;
            console.log('day, daynumber: ', day, dayNumber);
            cell += 
            `<div class="calendar-cell" id="${(day >= 30) ? months[month + 1] : months[month]}-${number}">
                <h3 class="${(day >= 30) ? 'gray' : ''} ${(day + 1 == dayNumber) ? 'selected' : ''}">${number}</h3>
            </div>`;
            day++;

            $('.calendar-inner').prepend(cell);
        }
    }

    // set month
    $('#calendar-month').html(months[month]);
       
    // add the styles
    $('.calendar-cell').css({
        'width' : cellWidth,
        'height' : cellHeight
    });
}