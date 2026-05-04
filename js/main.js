// Source - https://stackoverflow.com/a/54849460
// Posted by Rathnakara S
// Retrieved 2026-04-21, License - CC BY-SA 4.0

const words = ["Stchigel", "Programador", "Diseñador", "Desarrollador", "Técnico", "Administrador"];
let i = 0;
let timer;

function typingEffect() {
    let word = words[i].split("");
    var loopTyping = function() {
        if (word.length > 0) {
            document.getElementById('word').innerHTML += word.shift();
        } else {
            deletingEffect();
            return false;
        };
        timer = setTimeout(loopTyping, 500);
    };
    loopTyping();
};

function deletingEffect() {
    let word = words[i].split("");
    var loopDeleting = function() {
        if (word.length > 0) {
            word.pop();
            document.getElementById('word').innerHTML = word.join("");
        } else {
            if (words.length > (i + 1)) {
                i++;
            } else {
                i = 0;
            };
            typingEffect();
            return false;
        };
        timer = setTimeout(loopDeleting, 200);
    };
    loopDeleting();
};

typingEffect();

// Mobile navbar toggle
const navToggler = document.getElementById('navToggler');
const navbarCollapse = document.getElementById('navbarMain');
if (navToggler && navbarCollapse) {
    navToggler.addEventListener('click', () => {
        navbarCollapse.classList.toggle('open');
    });
}
