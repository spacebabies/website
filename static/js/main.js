(function() {
    var theBabies = document.querySelectorAll('.navbar-brand img');
    var luckyIndex = Math.round(Math.random() * theBabies.length)
    var lucky = theBabies[luckyIndex];
    var animations = new Array('anim-spin', 'anim-jump');

    function pickLucky() {
        lucky.classList.add(animations[Math.floor(Math.random() * animations.length)]);
        lucky.style.animationDelay = Math.floor(Math.random() * 12 + 4);
        clearInterval(timer)
        timer = setInterval(pickLucky, Math.round(Math.random() * 3000) + 1000)
    }

    var timer = setInterval(pickLucky, 1000);
    
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
