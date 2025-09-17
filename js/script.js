(function() {
    const nav = document.querySelector('.navbar-nav');
    if (!document.getElementById('loginNavItem')) {
      const li = document.createElement('li');
      li.className = 'nav-item';
      li.id = 'loginNavItem';
      li.innerHTML = `<a class="nav-link" href="#" id="loginNavBtn">Login/Register</a>`;
      nav.appendChild(li);
    }
  })();

  // Modal logic
  const authModal = document.getElementById('auth-modal');
  const loginForm = document.getElementById('login-form');
  const registerForm = document.getElementById('register-form');
  const loginMsg = document.getElementById('login-msg');
  const registerMsg = document.getElementById('register-msg');
  const showLoginBtn = document.getElementById('show-login');
  const showRegisterBtn = document.getElementById('show-register');
  const closeAuthBtn = document.getElementById('close-auth');

  function showAuthModal(tab='login') {
    authModal.style.display = 'block';
    if(tab==='login'){
      loginForm.style.display = '';
      registerForm.style.display = 'none';
      showLoginBtn.style.background = '#fff';
      showRegisterBtn.style.background = '#f3f4f6';
    } else {
      loginForm.style.display = 'none';
      registerForm.style.display = '';
      showLoginBtn.style.background = '#f3f4f6';
      showRegisterBtn.style.background = '#fff';
    }
    loginMsg.textContent = '';
    registerMsg.textContent = '';
  }
  function hideAuthModal() {
    authModal.style.display = 'none';
  }
  showLoginBtn.onclick = () => showAuthModal('login');
  showRegisterBtn.onclick = () => showAuthModal('register');
  closeAuthBtn.onclick = hideAuthModal;
  window.onclick = function(e) {
    if (e.target === authModal) hideAuthModal();
  };

  // Navbar login/register click
  document.getElementById('loginNavBtn').onclick = function(e) {
    e.preventDefault();
    showAuthModal('login');
  };

  // Register logic
  registerForm.onsubmit = function(e) {
    e.preventDefault();
    const username = document.getElementById('register-username').value.trim();
    const email = document.getElementById('register-email').value.trim();
    const password = document.getElementById('register-password').value;
    if (!username || !email || !password) {
      registerMsg.textContent = "All fields required.";
      return;
    }
    let users = JSON.parse(localStorage.getItem('users') || '[]');
    if (users.find(u => u.username === username || u.email === email)) {
      registerMsg.textContent = "Username or email already exists.";
      return;
    }
    users.push({username, email, password});
    localStorage.setItem('users', JSON.stringify(users));
    registerMsg.style.color = "#22c55e";
    registerMsg.textContent = "Registration successful! Please login.";
    setTimeout(() => showAuthModal('login'), 1200);
  };

  // Login logic
  loginForm.onsubmit = function(e) {
    e.preventDefault();
    const username = document.getElementById('login-username').value.trim();
    const password = document.getElementById('login-password').value;
    let users = JSON.parse(localStorage.getItem('users') || '[]');
    let user = users.find(u => (u.username === username || u.email === username) && u.password === password);
    if (!user) {
      loginMsg.textContent = "Invalid credentials.";
      return;
    }
    localStorage.setItem('loggedInUser', JSON.stringify(user));
    loginMsg.style.color = "#22c55e";
    loginMsg.textContent = "Login successful!";
    setTimeout(() => {
      hideAuthModal();
      updateLoginState();
    }, 800);
  };

  // Update navbar for login state
  function updateLoginState() {
    const user = JSON.parse(localStorage.getItem('loggedInUser') || 'null');
    const navBtn = document.getElementById('loginNavBtn');
    if (user) {
      navBtn.textContent = "Logout (" + user.username + ")";
      navBtn.onclick = function(e) {
        e.preventDefault();
        localStorage.removeItem('loggedInUser');
        updateLoginState();
      };
    } else {
      navBtn.textContent = "Login/Register";
      navBtn.onclick = function(e) {
        e.preventDefault();
        showAuthModal('login');
      };
    }
  }
  updateLoginState();

  // Newsletter form alert
  document.addEventListener('DOMContentLoaded', function() {
    var newsletterForm = document.querySelector('.info_form form');
    if(newsletterForm){
      newsletterForm.onsubmit = function(e){
        e.preventDefault();
        var email = this.querySelector('input[type="text"],input[type="email"]').value.trim();
        if(email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)){
          alert("Thank you for subscribing to our newsletter!");
          this.reset();
        } else {
          alert("Please enter a valid email address.");
        }
      };
    }

    // Contact form alert
    var contactForm = document.getElementById('contact-form');
    if(contactForm){
      contactForm.onsubmit = function(e){
        e.preventDefault();
        var name = document.getElementById('contact-name').value.trim();
        var email = document.getElementById('contact-email').value.trim();
        var phone = document.getElementById('contact-phone').value.trim();
        var message = document.getElementById('contact-message').value.trim();
        if(name && email && phone && message && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)){
          alert("Thank you for contacting us, " + name + "! We have received your message.");
          contactForm.reset();
        } else {
          alert("Please fill all fields with valid information.");
        }
      };
    }
  });

  // Cart logic
  document.addEventListener('DOMContentLoaded', function() {
    // ...existing newsletter/contact form code...

    // Cart add logic
    let cartCount = parseInt(localStorage.getItem('cartCount') || '0');
    const cartNumber = document.querySelector('.cart_number');
    function updateCartDisplay() {
      cartNumber.textContent = cartCount;
    }
    updateCartDisplay();

    document.querySelectorAll('.buy-now-btn').forEach(btn => {
      btn.addEventListener('click', function(e) {
        e.preventDefault();
        cartCount++;
        localStorage.setItem('cartCount', cartCount);
        updateCartDisplay();
        alert(this.getAttribute('data-product') + " added to cart!");
      });
    });
  });