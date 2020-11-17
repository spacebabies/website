(function () {
    // Pick a lucky Space Babies character and animate them.
    function pickLucky() {
        var theBabies = document.querySelectorAll('.navbar-brand img');
        var animations = new Array('anim-spin', 'anim-jump');
        var luckyIndex = Math.floor(Math.random() * theBabies.length);
        var lucky = theBabies[luckyIndex];

        lucky.style.animationDelay = Math.floor(Math.random() * 4 + 4) + 's';
        lucky.classList.add(animations[Math.floor(Math.random() * animations.length)]);
        setTimeout(pickLucky, Math.floor(Math.random() * 2000) + 1000);
        lucky.addEventListener('animationend', function (event) {
            event.target.classList.remove('anim-jump', 'anim-spin');
        });
    }

    // Re-eval all the links.
    function walkLinks() {
        var links = document.links;

        for (var i = 0, linksLength = links.length; i < linksLength; i++) {
            if (links[i].hostname != window.location.hostname) {
                links[i].target = '_blank';
            }
        }
    }

    function fixNavbarToggle() {
        var navbar = $('.navbar-collapse');
        if (navbar && navbar.hasClass('show')) {
            $('.navbar-toggler').click();
        }

    }

    // The "main" functions.

    $(document)
        .on('click', 'a.nav-link', fixNavbarToggle);

    window.addEventListener('DOMContentLoaded', function () {
        feather.replace({width: '1em', height: '1em', strokeWidth: '3px'});

        new SmoothScroll('a[href*="#"]');

        setTimeout(pickLucky, Math.floor(Math.random() * 2000) + 500);

        walkLinks();
    });
})();