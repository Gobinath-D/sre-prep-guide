/* Shared behavior for the SRE textbook. Progressive enhancement only —
   every page is fully readable with JS disabled. */
(function(){
  "use strict";
  var root=document.documentElement;

  // ---- Theme (persist across pages, tolerate file:// localStorage quirks) ----
  try{var t=localStorage.getItem('sre_theme'); if(t) root.setAttribute('data-theme',t);}catch(e){}
  function toggleTheme(){
    var next=root.getAttribute('data-theme')==='dark'?'light':'dark';
    root.setAttribute('data-theme',next);
    try{localStorage.setItem('sre_theme',next);}catch(e){}
  }
  document.addEventListener('click',function(e){
    var b=e.target.closest('[data-theme-toggle]'); if(b){toggleTheme();}
  });

  // ---- Copy buttons on code blocks ----
  document.querySelectorAll('.codewrap').forEach(function(w){
    var pre=w.querySelector('pre'); if(!pre) return;
    var btn=document.createElement('button'); btn.className='copy'; btn.type='button'; btn.textContent='Copy';
    btn.addEventListener('click',function(){
      var text=pre.innerText.replace(/^\s*Copy\s*/,'');
      try{navigator.clipboard.writeText(text);}catch(e){}
      btn.textContent='Copied'; setTimeout(function(){btn.textContent='Copy';},1400);
    });
    w.appendChild(btn);
  });

  // ---- In-page TOC scrollspy ----
  var tocLinks=[].slice.call(document.querySelectorAll('.toc a[href^="#"]'));
  if(tocLinks.length){
    var map={};
    tocLinks.forEach(function(a){var id=a.getAttribute('href').slice(1);var el=document.getElementById(id);if(el)map[id]=a;});
    var spy=new IntersectionObserver(function(ents){
      ents.forEach(function(en){
        if(en.isIntersecting){
          tocLinks.forEach(function(a){a.classList.remove('active');});
          if(map[en.target.id]) map[en.target.id].classList.add('active');
        }
      });
    },{rootMargin:'-40% 0px -55% 0px'});
    Object.keys(map).forEach(function(id){var el=document.getElementById(id);if(el)spy.observe(el);});
  }

  // ---- Index page: collapse/expand part cards ----
  document.querySelectorAll('.partcard>.ph').forEach(function(h){
    h.addEventListener('click',function(){h.parentElement.classList.toggle('collapsed');});
  });
  var exp=document.querySelector('[data-expand-all]');
  if(exp){
    var open=true;
    exp.addEventListener('click',function(){
      open=!open;
      document.querySelectorAll('.partcard').forEach(function(c){c.classList.toggle('collapsed',!open);});
      exp.textContent=open?'Collapse all':'Expand all';
    });
  }

  // ---- Open all <details> before printing, restore after ----
  var wasOpen=[];
  window.addEventListener('beforeprint',function(){
    wasOpen=[]; document.querySelectorAll('details').forEach(function(d){wasOpen.push(d.open); d.open=true;});
  });
  window.addEventListener('afterprint',function(){
    document.querySelectorAll('details').forEach(function(d,i){d.open=wasOpen[i];});
  });
})();
