$(document).ready(function() {
    // check classroom logged in
    console.log('cookies: ', document.cookies);

    fetchAssignments();
});

function getClassroomLogin() {
    window.location.href = '/classroomData';
}

function fetchAssignments() {
    let assignmentsData = [];
    let assignments = '';

    $.post('/getClassroomAssignments', function(data) {
        console.log('data: ', data);
    });

    // console.log(assignmentsData);

    // assignmentsData.forEach(a => {
    //     assignments +=
    //     `<div class="block column assignment">
    //         <div class="column">
    //             <h3 class="assignment-name">Finish Plucky Pilots API</h3>
    //             <h4 class="assignment-class">AP Computer Science</h4>
    //             <div style="flex: 1"></div>
    //             <h5 class="assignment-date">Due Tomorrow</h5>
    //         </div>
    //         <p class="desc">
    //             This is a description of the assignment as the user would see it
    //             on Google Classroom. The card can be expanded to show the full assignment.
    //         </p>
    //     </div>`;
    // });

    // $('#classroomLogin').remove(); // remove login
    // $('#assignments').append(assignments); // add assignments
}