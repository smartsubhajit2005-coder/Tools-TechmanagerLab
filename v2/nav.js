    (function () {
      var btn = document.getElementById('navToggle');
      var drawer = document.getElementById('navDrawer');
      var scrim = document.getElementById('navScrim');
      function setOpen(open) {
        drawer.classList.toggle('open', open);
        scrim.classList.toggle('open', open);
        btn.setAttribute('aria-expanded', String(open));
        btn.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
        if (open) { drawer.querySelector('nav a').focus({ preventScroll: true }); }
      }
      btn.addEventListener('click', function () {
        setOpen(btn.getAttribute('aria-expanded') !== 'true');
      });
      scrim.addEventListener('click', function () { setOpen(false); });
      drawer.addEventListener('click', function (e) {
        if (e.target.closest('a')) { setOpen(false); }
      });
      document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') { setOpen(false); }
      });

      var form = document.getElementById('contactForm');
      form.addEventListener('submit', function (e) {
        e.preventDefault();
        if (!form.reportValidity()) { return; }
        var v = function (id) { return document.getElementById(id).value.trim(); };
        var body = [
          'Name: ' + v('cf-name'),
          'Email: ' + v('cf-email'),
          'Phone: ' + v('cf-phone'),
          'Country: ' + v('cf-country'),
          '',
          v('cf-message')
        ].join('\n');
        window.location.href = 'mailto:subhajit.mitra@techmanagerlab.com'
          + '?subject=' + encodeURIComponent('Website enquiry from ' + v('cf-name'))
          + '&body=' + encodeURIComponent(body);
      });
      var toTop = document.getElementById('toTop');
      function onScroll() {
        toTop.classList.toggle('show', window.scrollY > 500);
      }
      window.addEventListener('scroll', onScroll, { passive: true });
      onScroll();
      toTop.addEventListener('click', function () {
        var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        window.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' });
        document.querySelector('.wordmark').focus({ preventScroll: true });
      });
    })();
