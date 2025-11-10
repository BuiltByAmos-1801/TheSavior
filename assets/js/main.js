// Main JS for The Savior demo site
(function(){
  // Smooth scroll helper
  function smoothScroll(target){
    const el = document.querySelector(target);
    if(!el) return;
    const top = el.getBoundingClientRect().top + window.scrollY - 64; // offset for header
    window.scrollTo({top, behavior: 'smooth'});
  }

  // Nav links smooth scroll
  document.querySelectorAll('.nav-link').forEach(a=>{
    a.addEventListener('click', function(e){
      e.preventDefault();
      const href = this.getAttribute('href');
      if(href && href.startsWith('#')){
        smoothScroll(href);
        // close mobile menu
        const mobile = document.getElementById('mobile-menu');
        if(mobile && !mobile.classList.contains('hidden')) mobile.classList.add('hidden');
      }
    })
  });

  // CTA buttons
  document.getElementById('cta-shop')?.addEventListener('click', ()=> smoothScroll('#products'));

  // Mobile menu toggle
  const mobileBtn = document.getElementById('mobile-menu-btn');
  const mobileMenu = document.getElementById('mobile-menu');
  mobileBtn?.addEventListener('click', ()=>{
    if(mobileMenu.classList.contains('hidden')) mobileMenu.classList.remove('hidden');
    else mobileMenu.classList.add('hidden');
  });

  // Header shadow on scroll
  const header = document.getElementById('site-header');
  function checkHeader(){
    if(window.scrollY > 10) header.classList.add('scrolled');
    else header.classList.remove('scrolled');
  }
  checkHeader();
  window.addEventListener('scroll', checkHeader);

  // Theme toggle (default + forest)
  const themeToggle = document.getElementById('theme-toggle');
  const themeIcon = document.getElementById('theme-icon');
  const savedTheme = localStorage.getItem('theme') || 'default';
  function applyTheme(name){
    document.documentElement.classList.remove('theme-forest','theme-dark');
    if(name === 'forest') document.documentElement.classList.add('theme-forest');
    if(name === 'dark') document.documentElement.classList.add('theme-dark');
    // icon swap
    if(themeIcon){
      if(name === 'forest') themeIcon.className = 'fa-solid fa-seedling';
      else if(name === 'dark') themeIcon.className = 'fa-solid fa-moon';
      else themeIcon.className = 'fa-solid fa-palette';
    }
    localStorage.setItem('theme', name);
  }
  applyTheme(savedTheme);

  themeToggle?.addEventListener('click', ()=>{
    const current = localStorage.getItem('theme') || 'default';
    const next = current === 'default' ? 'forest' : current === 'forest' ? 'dark' : 'default';
    applyTheme(next);
  });

  // Simple reveal on scroll using IntersectionObserver
  const reveals = document.querySelectorAll('.reveal');
  if('IntersectionObserver' in window){
    const obs = new IntersectionObserver((entries, observer)=>{
      entries.forEach(entry=>{
        if(entry.isIntersecting){
          entry.target.classList.add('active');
          observer.unobserve(entry.target);
        }
      })
    }, {threshold: 0.12});
    reveals.forEach(r=>obs.observe(r));
  } else {
    // fallback
    reveals.forEach(r=>r.classList.add('active'))
  }

  // Products data
  const products = [
    {id:1, name:'Pure Bright Laundry', price:12.99, desc:'Concentrated powder for bright whites', img:'https://images.unsplash.com/photo-1585386959984-a4155226b850?auto=format&fit=crop&w=800&q=80'},
    {id:2, name:'GreenCare Liquid', price:9.99, desc:'Plant-based liquid detergent', img:'https://images.unsplash.com/photo-1581579180084-7b1c371b7b7a?auto=format&fit=crop&w=800&q=80'},
    {id:3, name:'Fresh Scent Pods', price:14.50, desc:'Pre-measured pods for convenience', img:'https://images.unsplash.com/photo-1580536951885-7f1c4e3a9bf2?auto=format&fit=crop&w=800&q=80'},
    {id:4, name:'Delicate Wash', price:11.00, desc:'Gentle formula for delicate fabrics', img:'https://images.unsplash.com/photo-1573496529574-09b7b4a0b3d6?auto=format&fit=crop&w=800&q=80'},
    {id:5, name:'Stain Rescue', price:8.75, desc:'Targeted stain remover for tough spots', img:'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=800&q=80'},
    {id:6, name:'Eco Rinse', price:7.50, desc:'Plant-based rinse aid', img:'https://images.unsplash.com/photo-1524594154902-3a6f8f6a3b0b?auto=format&fit=crop&w=800&q=80'},
  ];

  function renderProducts(){
    const grid = document.getElementById('product-grid');
    if(!grid) return;
    // use template
    const tpl = document.getElementById('product-template');
    grid.innerHTML = '';
    products.forEach((p, idx)=>{
      const node = tpl.content.cloneNode(true);
      const card = node.querySelector('.card');
      const img = node.querySelector('.tpl-img');
      const name = node.querySelector('.tpl-name');
      const desc = node.querySelector('.tpl-desc');
      const price = node.querySelector('.tpl-price');
      const badge = node.querySelector('.badge');
      const btn = node.querySelector('.add-cart');
      img.src = p.img; img.alt = p.name;
      name.textContent = p.name;
      desc.textContent = p.desc;
      price.textContent = `$${p.price.toFixed(2)}`;
      if(idx===0) badge.style.display = 'inline-block';
      btn.addEventListener('click', ()=> alert(`Added ${p.name} — $${p.price.toFixed(2)} to cart.`));
      grid.appendChild(node);
    });
  }
  renderProducts();

  // Testimonials slider
  const testimonials = [
    {name:'Aisha M.', img:'https://randomuser.me/api/portraits/women/65.jpg', text:'Love The Savior! My clothes are brighter and the scent is natural and fresh.'},
    {name:'Carlos R.', img:'https://randomuser.me/api/portraits/men/32.jpg', text:'Professional cleaning team — on time, friendly, and very thorough.'},
    {name:'Priya S.', img:'https://randomuser.me/api/portraits/women/44.jpg', text:'Eco-friendly and effective. Highly recommend for families.'}
  ];

  let tIndex = 0;
  const tWrap = document.getElementById('testimonial-wrap');
  const tDots = document.getElementById('testimonial-dots');
  function renderTestimonial(i){
    if(!tWrap) return;
    const t = testimonials[i];
    const tpl = document.getElementById('testimonial-template');
    const node = tpl.content.cloneNode(true);
    const timg = node.querySelector('.tpl-timg');
    const ttext = node.querySelector('.tpl-text');
    const tauthor = node.querySelector('.tpl-author');
    timg.src = t.img; timg.alt = t.name;
    ttext.textContent = `"${t.text}"`;
    tauthor.textContent = `— ${t.name}`;
    tWrap.innerHTML = '';
    tWrap.appendChild(node);
    // update dots
    if(tDots){
      tDots.innerHTML = testimonials.map((_, idx)=>`<button data-idx="${idx}" class="${idx===i? 'active':''}" aria-label="testimonial ${idx+1}"></button>`).join('');
      tDots.querySelectorAll('button').forEach(b=> b.addEventListener('click', ()=>{ tIndex = +b.getAttribute('data-idx'); renderTestimonial(tIndex); }));
    }
  }
  renderTestimonial(tIndex);
  setInterval(()=>{
    tIndex = (tIndex + 1) % testimonials.length;
    // simple fade
    const container = tWrap;
    if(container){
      container.style.opacity = 0;
      setTimeout(()=>{ renderTestimonial(tIndex); container.style.opacity = 1; }, 400);
    }
  }, 5000);

  // pause testimonial rotation on hover
  const tContainer = document.getElementById('testimonial-wrap');
  let tInterval = null;
  function startT(){ tInterval = setInterval(()=>{ tIndex = (tIndex + 1) % testimonials.length; const container = tWrap; if(container){ container.style.opacity = 0; setTimeout(()=>{ renderTestimonial(tIndex); container.style.opacity = 1; }, 400); } }, 5000); }
  function stopT(){ clearInterval(tInterval); }
  startT();
  tContainer?.addEventListener('mouseenter', stopT);
  tContainer?.addEventListener('mouseleave', startT);

  // Contact form validation
  const contactForm = document.getElementById('contact-form');
  contactForm?.addEventListener('submit', function(e){
    e.preventDefault();
    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const message = document.getElementById('message').value.trim();
    const emailRegex = /^\S+@\S+\.\S+$/;
    const errors = [];
    if(!name) errors.push('Please enter your name.');
    if(!email || !emailRegex.test(email)) errors.push('Please enter a valid email.');
    if(!message || message.length < 10) errors.push('Message should be at least 10 characters.');
    if(errors.length){
      alert(errors.join('\n'));
    } else {
      alert('Thanks! Your message was sent. We will get back to you soon.');
      contactForm.reset();
    }
  });

})();
