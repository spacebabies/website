(function() {    
    function pickLucky() {
        var theBabies = document.querySelectorAll('.navbar-brand img');
        var animations = new Array('anim-spin', 'anim-jump');
        var luckyIndex = Math.floor(Math.random() * theBabies.length)
        var lucky = theBabies[luckyIndex];

        lucky.style.animationDelay = Math.floor(Math.random() * 4 + 4) + 's';
        lucky.classList.add(animations[Math.floor(Math.random() * animations.length)]);
        setTimeout(pickLucky, Math.floor(Math.random() * 2000) + 1000);
        lucky.addEventListener('animationend', function (event) {
            event.target.classList.remove('anim-jump', 'anim-spin');
        });
    }

    setTimeout(pickLucky, Math.floor(Math.random() * 2000) + 500);
})();

(function (w) {
    // if the class is already set, we're good.
    if (w.document.documentElement.className.indexOf("fonts-loaded") > -1) {
        return;
    }
    var fontA = new w.FontFaceObserver("Inter", {
        weight: 300
    });
    var fontB = new w.FontFaceObserver("Inter", {
        weight: 400
    });
    var fontC = new w.FontFaceObserver("Inter", {
        weight: 500
    });
    var fontD = new w.FontFaceObserver("Inter", {
        weight: 600
    });
    var fontE = new w.FontFaceObserver("Inter", {
        weight: 700
    });
    var fontF = new w.FontFaceObserver("Inter", {
        weight: 900
    });
    w.Promise.all([fontA.load(), fontC.load(), fontF.load()]).then(function () {
        w.document.documentElement.className += " fonts-loaded";
    });
})(this);

const scroll = new SmoothScroll('a[href*="#"]');
$('a.nav-link').on('click', () => {
    const navbar = $('.navbar-collapse');
    if (navbar && navbar.hasClass('show')) {
        $('.navbar-toggler').click();
    }
})
