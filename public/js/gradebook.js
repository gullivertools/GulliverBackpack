$(document).ready(function() {
    loadGrades();
});

function loadGrades() {
    // get grades json object from server through POST
    // here's a dummy array
    const classes = [{
        "name": "Aerospace Sci and Engin H II (S2)",
        "grade": "A 96.67",
        "teacher": "Roberto Carballo"
    },
    {
        "name": "Computer Science A AP (S1,S2)",
        "grade": "A 96.43",
        "teacher": "Mr. Jesse de Vera"
    },
    {
        "name": "Digital Electronics H (S1)",
        "grade": "",
        "teacher": "Roberto Carballo"
    }];

    classes.forEach(currentClass => {
        $('.main')
            .append(`<div class="class row">
                        <h4><b>Class</b> ${currentClass.name || 'N/A'}</h4>
                        <h4><b>Grade</b> ${currentClass.grade || 'N/A'}</h4>
                        <h4><b>Teacher</b> ${currentClass.teacher || 'N/A'}</h4>
                    </div>`);
    });
}