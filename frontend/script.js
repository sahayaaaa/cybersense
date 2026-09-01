let selectedApps = [];

let keyTimes = [];
let keyDownTimes = {};
let typingStart = null;

let mouseMoves = 0;
let mouseDistance = 0;
let lastMouseX = null;
let lastMouseY = null;
let mouseStart = null;


// ===============================
// PAGE NAVIGATION
// ===============================

function showPage(id) {
    document.querySelectorAll(".page").forEach(page => {
        page.classList.remove("active");
    });

    const page = document.getElementById(id);

    if (page) {
        page.classList.add("active");
    }

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}


// ===============================
// LOGIN
// ===============================

function login() {

    const email = document.getElementById("email");
    const password = document.getElementById("password");

    if (!email || !password) {
        return;
    }

    if (email.value.trim() === "") {
        alert("Please enter your email address.");
        email.focus();
        return;
    }

    if (password.value.trim() === "") {
        alert("Please enter your password.");
        password.focus();
        return;
    }

    showPage("dashboard");
}


function togglePassword() {

    const password = document.getElementById("password");
    const button = document.querySelector(".password-box button");

    if (!password) {
        return;
    }

    if (password.type === "password") {
        password.type = "text";

        if (button) {
            button.textContent = "HIDE";
        }

    } else {

        password.type = "password";

        if (button) {
            button.textContent = "SHOW";
        }
    }
}


function googleLogin() {
    alert("Google authentication will be connected in the next version.");
}


function forgotPassword() {

    alert(
        "Password recovery will be connected in the next version."
    );
}


// ===============================
// APP SELECTION
// ===============================

function toggleApp(card) {

    const nameElement = card.querySelector("h3");

    if (!nameElement) {
        return;
    }

    const name = nameElement.textContent;

    card.classList.toggle("selected");

    if (card.classList.contains("selected")) {

        if (!selectedApps.includes(name)) {
            selectedApps.push(name);
        }

    } else {

        selectedApps = selectedApps.filter(
            app => app !== name
        );
    }
}


// ===============================
// START BEHAVIOR SETUP
// ===============================

function startBehavior() {

    if (selectedApps.length === 0) {

        alert(
            "Please select at least one application or website."
        );

        return;
    }

    showPage("behavior");
}


// ===============================
// TYPING TEST
// ===============================

function startTyping() {

    showPage("typing");

    keyTimes = [];
    keyDownTimes = {};
    typingStart = null;

    const input = document.getElementById("typingInput");

    if (input) {
        input.value = "";
        input.focus();
    }

    updateElement("speed", "0 WPM");
    updateElement("keys", "0");
    updateElement("interval", "0 ms");
}


function recordKeyDown(event) {

    if (!typingStart) {
        typingStart = performance.now();
    }

    keyDownTimes[event.key] = performance.now();
}


function recordKeyUp(event) {

    const now = performance.now();

    if (keyDownTimes[event.key] !== undefined) {

        const holdTime =
            now - keyDownTimes[event.key];

        keyTimes.push({
            key: event.key,
            time: now,
            hold: holdTime
        });

        delete keyDownTimes[event.key];
    }

    updateTypingMetrics();
}


function updateTypingMetrics() {

    const input =
        document.getElementById("typingInput");

    if (!input || !typingStart) {
        return;
    }

    const elapsed =
        (performance.now() - typingStart) / 60000;

    const characters =
        input.value.length;

    let wpm = 0;

    if (elapsed > 0) {
        wpm = Math.round(
            (characters / 5) / elapsed
        );
    }

    updateElement(
        "speed",
        wpm + " WPM"
    );

    updateElement(
        "keys",
        keyTimes.length
    );

    if (keyTimes.length > 1) {

        let total = 0;

        for (
            let i = 1;
            i < keyTimes.length;
            i++
        ) {

            total +=
                keyTimes[i].time -
                keyTimes[i - 1].time;
        }

        const average =
            total / (keyTimes.length - 1);

        updateElement(
            "interval",
            Math.round(average) + " ms"
        );
    }
}


function finishTyping() {

    if (keyTimes.length < 5) {

        alert(
            "Please type a little more so CyberSense can analyze your behavior."
        );

        return;
    }

    showPage("mouse");

    startMouseTracking();
}


// ===============================
// MOUSE MOVEMENT TEST
// ===============================

function startMouseTracking() {

    mouseMoves = 0;
    mouseDistance = 0;

    lastMouseX = null;
    lastMouseY = null;

    mouseStart = performance.now();

    const canvas =
        document.getElementById("mouseCanvas");

    if (!canvas) {
        return;
    }

    const ctx =
        canvas.getContext("2d");

    canvas.width =
        canvas.clientWidth;

    canvas.height =
        canvas.clientHeight;

    ctx.clearRect(
        0,
        0,
        canvas.width,
        canvas.height
    );

    canvas.onmousemove = function(event) {

        const rect =
            canvas.getBoundingClientRect();

        const x =
            event.clientX - rect.left;

        const y =
            event.clientY - rect.top;

        mouseMoves++;

        if (
            lastMouseX !== null &&
            lastMouseY !== null
        ) {

            const dx =
                x - lastMouseX;

            const dy =
                y - lastMouseY;

            const distance =
                Math.sqrt(
                    dx * dx +
                    dy * dy
                );

            mouseDistance += distance;

            ctx.beginPath();

            ctx.moveTo(
                lastMouseX,
                lastMouseY
            );

            ctx.lineTo(x, y);

            ctx.strokeStyle =
                "#00e5ff";

            ctx.lineWidth = 2;

            ctx.stroke();
        }

        lastMouseX = x;
        lastMouseY = y;

        updateElement(
            "mouseMoves",
            mouseMoves
        );

        updateElement(
            "mouseDistance",
            Math.round(mouseDistance) + " px"
        );

        const seconds =
            (performance.now() - mouseStart) /
            1000;

        updateElement(
            "mouseTime",
            seconds.toFixed(1) + " sec"
        );
    };
}


function finishMouse() {

    if (mouseMoves < 20) {

        alert(
            "Please move the mouse around a little more."
        );

        return;
    }

    createProfile();
}


// ===============================
// BEHAVIOR PROFILE
// ===============================

function createProfile() {

    showPage("profile");

    const behaviorID =
        "CS-" +
        Math.random()
            .toString(36)
            .substring(2, 8)
            .toUpperCase();

    updateElement(
        "behaviorID",
        behaviorID
    );

    updateElement(
        "profileStatus",
        "CREATED"
    );
}


// ===============================
// APPLY PROTECTION
// ===============================

function applyProtection() {

    localStorage.setItem(
        "cybersenseProtectedApps",
        JSON.stringify(selectedApps)
    );

    showPage("complete");
}


// ===============================
// HELPER
// ===============================

function updateElement(id, value) {

    const element =
        document.getElementById(id);

    if (element) {
        element.textContent = value;
    }
}