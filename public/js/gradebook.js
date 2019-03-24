$(document).ready(function () {
    if ((getCookie("username") == "" || getCookie("username") == null) || (getCookie("password") == "" || getCookie("password") == null)) {
        displayError();
    } else {
        loadGrades({"username": getCookie("username"), "password": getCookie("password")});
    }
});

function displayError() {
    $('.main').append(`<h4> Uh Oh! Please Sign In To View Your Grades! </h4>
                        <input type="text" placeholder="username" id="usernameField" />
                        <input type="password" placeholder="password" id="passwordField" />
                        <button onclick="checkLogin()" > Submit </button>
                        `);
}

function checkLogin() {
    const username = document.getElementById('usernameField').value;
    const password = document.getElementById('passwordField').value;
    if (username == "" || password == "") {
        alert("ENTER USER AND PASS!");
        return;
    }

    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            if (JSON.parse(this.responseText)["success"] == "true") {
                document.cookie = "username=" + username;
                document.cookie = "password=" + password;
                location.reload();
            } else {
                alert("Incorrect user or pass!")
            }
        }
    };
    xhttp.open("POST", "login", true);
    xhttp.setRequestHeader("Content-type", "application/json");
    xhttp.send(JSON.stringify({
        "username": username,
        "password": password
    }));
}

function loadGrades(user) {
    // get grades json object from server through POST
    var xhttp = new XMLHttpRequest();
    var gradesColumn = document.getElementsByClassName('block column main')[0];
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            const classes = JSON.parse(this.responseText);
            gradesColumn.className = "block column main";
            classes.forEach(currentClass => {
                $('.main')
                    .append(`<div class="class row">
                        <h4><b>Class</b> ${currentClass.name || 'N/A'}</h4>
                        <h4><b>Grade</b> ${currentClass.grade || 'N/A'}</h4>
                        <h4><b>Teacher</b> ${currentClass.teacher || 'N/A'}</h4>
                    </div>`);
            });
        }
    };
    xhttp.open("POST", "getGrades", true);
    xhttp.setRequestHeader("Content-type", "application/json");
    xhttp.send(JSON.stringify({
        "username": user.username,
        "password": user.password
    }));
}

function getCookie(name) {
    var value = "; " + document.cookie;
    var parts = value.split("; " + name + "=");
    if (parts.length == 2) return parts.pop().split(";").shift();
}