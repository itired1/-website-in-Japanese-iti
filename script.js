document.addEventListener('DOMContentLoaded', function() {
    window.addEventListener('load', function() {
        const preloader = document.querySelector('.preloader');
        setTimeout(() => {
            preloader.style.opacity = '0';
            setTimeout(() => {
                preloader.style.display = 'none';
                createSakuraPetals();
            }, 500);
        }, 2000);
    });

    function createSakuraPetals() {
        const heroSection = document.querySelector('.hero');
        const petalCount = 15;
        
        for (let i = 0; i < petalCount; i++) {
            const petal = document.createElement('div');
            petal.className = 'sakura-petal';
            
            const leftPos = Math.random() * 100;
            const animationDuration = 10 + Math.random() * 20;
            const animationDelay = Math.random() * 5;
            const size = 10 + Math.random() * 15;
            
            petal.style.left = `${leftPos}vw`;
            petal.style.top = `-${size}px`;
            petal.style.width = `${size}px`;
            petal.style.height = `${size}px`;
            petal.style.animationDuration = `${animationDuration}s`;
            petal.style.animationDelay = `${animationDelay}s`;
            
            heroSection.appendChild(petal);
        }
    }

    const navToggle = document.getElementById('navToggle');
    const navLinks = document.querySelector('.nav-links');
    
    navToggle.addEventListener('click', function() {
        navLinks.classList.toggle('active');
        navToggle.classList.toggle('active');
    });

    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
            navToggle.classList.remove('active');
        });
    });

    const authModal = document.getElementById('authModal');
    const accountModal = document.getElementById('accountModal');
    const userAvatar = document.getElementById('userAvatar');
    const profileDropdown = document.getElementById('profileDropdown');
    
    function checkAuthStatus() {
        const isLoggedIn = localStorage.getItem('userLoggedIn') === 'true';
        
        if (isLoggedIn) {
            const userName = localStorage.getItem('userName') || 'User';
            userAvatar.textContent = userName.charAt(0).toUpperCase();
            userAvatar.style.backgroundColor = getRandomColor();
        } else {
            userAvatar.innerHTML = '<i class="fas fa-user"></i>';
            userAvatar.style.backgroundColor = '#ddd';
        }
    }
    
    function getRandomColor() {
        const colors = ['#ff7675', '#74b9ff', '#55efc4', '#a29bfe', '#ffeaa7'];
        return colors[Math.floor(Math.random() * colors.length)];
    }
    
    function toggleAuthModal() {
        authModal.style.display = authModal.style.display === 'block' ? 'none' : 'block';
        document.body.style.overflow = authModal.style.display === 'block' ? 'hidden' : 'auto';
    }
    
    function toggleAccountModal() {
        if (localStorage.getItem('userLoggedIn') === 'true') {
            accountModal.style.display = accountModal.style.display === 'block' ? 'none' : 'block';
            document.body.style.overflow = accountModal.style.display === 'block' ? 'hidden' : 'auto';
            loadAccountDetails();
        } else {
            toggleAuthModal();
            document.querySelector('.auth-tab[data-tab="login"]').click();
        }
    }
    
    document.getElementById('loginForm').addEventListener('submit', function(e) {
        e.preventDefault();
        const email = document.getElementById('loginEmail').value;
        const password = document.getElementById('loginPassword').value;
        
        if (email && password) {
            localStorage.setItem('userLoggedIn', 'true');
            localStorage.setItem('userEmail', email);
            localStorage.setItem('userName', email.split('@')[0]);
            
            checkAuthStatus();
            toggleAuthModal();
            showNotification('Вход выполнен успешно!');
        } else {
            showNotification('Пожалуйста, заполните все поля');
        }
    });
    
    document.getElementById('registerForm').addEventListener('submit', function(e) {
        e.preventDefault();
        const name = document.getElementById('regName').value;
        const email = document.getElementById('regEmail').value;
        const password = document.getElementById('regPassword').value;
        const confirm = document.getElementById('regConfirm').value;
        
        if (password !== confirm) {
            showNotification('Пароли не совпадают!');
            return;
        }
        
        if (name && email && password) {
            localStorage.setItem('userLoggedIn', 'true');
            localStorage.setItem('userName', name);
            localStorage.setItem('userEmail', email);
            
            checkAuthStatus();
            toggleAuthModal();
            showNotification(`Регистрация прошла успешно! Добро пожаловать, ${name}!`);
        } else {
            showNotification('Пожалуйста, заполните все поля');
        }
    });
    
    document.getElementById('logoutLink').addEventListener('click', function(e) {
        e.preventDefault();
        if (confirm('Вы уверены, что хотите выйти?')) {
            localStorage.removeItem('userLoggedIn');
            checkAuthStatus();
            showNotification('Вы вышли из системы');
            if (accountModal.style.display === 'block') {
                toggleAccountModal();
            }
        }
    });
    
    function loadAccountDetails() {
        const saved = localStorage.getItem('userAccountDetails');
        if (saved) {
            try {
                const details = JSON.parse(saved);
                document.getElementById('accountName').value = details.name || '';
                document.getElementById('accountEmail').value = details.email || '';
                document.getElementById('accountPhone').value = details.phone || '';
                document.getElementById('accountAddress').value = details.address || '';
            } catch (e) {
                console.error('Error loading account details:', e);
            }
        } else {
            document.getElementById('accountName').value = localStorage.getItem('userName') || '';
            document.getElementById('accountEmail').value = localStorage.getItem('userEmail') || '';
        }
    }
    
    document.getElementById('accountForm').addEventListener('submit', function(e) {
        e.preventDefault();
        
        const accountDetails = {
            name: document.getElementById('accountName').value,
            email: document.getElementById('accountEmail').value,
            phone: document.getElementById('accountPhone').value,
            address: document.getElementById('accountAddress').value,
            updated: new Date().toISOString()
        };
        
        localStorage.setItem('userAccountDetails', JSON.stringify(accountDetails));
        showNotification('Личные данные сохранены!');
    });
    
    userAvatar.addEventListener('click', function(e) {
        e.stopPropagation();
        toggleAccountModal();
    });
    
    window.addEventListener('click', function(e) {
        if (e.target === authModal) {
            toggleAuthModal();
        }
        if (e.target === accountModal) {
            toggleAccountModal();
        }
    });
    
    document.querySelector('.close-auth').addEventListener('click', toggleAuthModal);
    document.querySelector('.close-account').addEventListener('click', toggleAccountModal);
    
    function showNotification(message) {
        const notification = document.createElement('div');
        notification.className = 'notification';
        notification.textContent = message;
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.classList.add('show');
        }, 10);
        
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
    }

    const filterButtons = document.querySelectorAll('.filter-btn');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            filterButtons.forEach(btn => btn.classList.remove('active'));
            
            this.classList.add('active');
            
            const filter = this.getAttribute('data-filter');
            filterProducts(filter);
        });
    });
    
    function filterProducts(filter) {
        const products = document.querySelectorAll('.product-card');
        
        products.forEach(product => {
            if (filter === 'all' || product.getAttribute('data-category') === filter) {
                product.style.display = 'flex';
            } else {
                product.style.display = 'none';
            }
        });
    }

    const cart = {
        items: JSON.parse(localStorage.getItem('cartItems')) || [],
        
        addItem: function(product) {
            const existingItem = this.items.find(item => item.id === product.id);
            if (existingItem) {
                existingItem.quantity += 1;
            } else {
                this.items.push({...product, quantity: 1});
            }
            this.save();
            this.updateUI();
            showNotification('Товар добавлен в корзину');
        },
        
        removeItem: function(productId) {
            this.items = this.items.filter(item => item.id !== productId);
            this.save();
            this.updateUI();
            showNotification('Товар удален из корзины');
        },
        
        updateQuantity: function(productId, quantity) {
            const item = this.items.find(item => item.id === productId);
            if (item) {
                item.quantity = parseInt(quantity) || 1;
                this.save();
                this.updateUI();
                showNotification('Количество изменено');
            }
        },
        
        clear: function() {
            this.items = [];
            this.save();
            this.updateUI();
        },
        
        getTotal: function() {
            return this.items.reduce((total, item) => {
                return total + (parseFloat(item.price.replace(/[^\d.]/g, ''))) * item.quantity;
            }, 0);
        },
        
        save: function() {
            localStorage.setItem('cartItems', JSON.stringify(this.items));
        },
        
        updateUI: function() {
            const totalCount = this.items.reduce((sum, item) => sum + item.quantity, 0);
            
            document.querySelector('.cart-count').textContent = totalCount;
            document.querySelector('.cart-count-mini').textContent = totalCount;
            
            const cartItemsContainer = document.querySelector('.cart-items');
            const cartTotalPrice = document.getElementById('cartTotalPrice');
            
            if (this.items.length === 0) {
                cartItemsContainer.innerHTML = `
                    <div class="empty-cart">
                        <i class="fas fa-shopping-cart"></i>
                        <p>Ваша корзина пуста</p>
                    </div>
                `;
                cartTotalPrice.textContent = '0 ₽';
                return;
            }
            
            let itemsHTML = '';
            
            this.items.forEach(item => {
                itemsHTML += `
                    <div class="cart-item" data-id="${item.id}">
                        <div class="cart-item-img">
                            <img src="${item.image}" alt="${item.title}">
                        </div>
                        <div class="cart-item-info">
                            <div class="cart-item-title">${item.title}</div>
                            <div class="cart-item-price">${item.price}</div>
                        </div>
                        <div class="cart-item-actions">
                            <input type="number" min="1" value="${item.quantity}" 
                                   class="cart-item-quantity">
                            <button class="remove-item">
                                <i class="fas fa-trash"></i>
                            </button>
                        </div>
                    </div>
                `;
            });
            
            cartItemsContainer.innerHTML = itemsHTML;
            cartTotalPrice.textContent = this.getTotal().toFixed(2) + ' ₽';
            
            document.querySelectorAll('.cart-item-quantity').forEach(input => {
                input.addEventListener('change', (e) => {
                    const itemId = e.target.closest('.cart-item').dataset.id;
                    this.updateQuantity(itemId, e.target.value);
                });
            });
            
            document.querySelectorAll('.remove-item').forEach(button => {
                button.addEventListener('click', (e) => {
                    const itemId = e.target.closest('.cart-item').dataset.id;
                    this.removeItem(itemId);
                });
            });
        }
    };

    function initCart() {
        cart.updateUI();
        
        document.getElementById('cartIcon').addEventListener('click', () => {
            document.getElementById('cartModal').style.display = 'block';
            document.body.style.overflow = 'hidden';
        });
        
        document.getElementById('cartIconMini').addEventListener('click', () => {
            document.getElementById('cartModal').style.display = 'block';
            document.body.style.overflow = 'hidden';
        });
        
        document.querySelector('.close-cart').addEventListener('click', () => {
            document.getElementById('cartModal').style.display = 'none';
            document.body.style.overflow = 'auto';
        });
        
        document.getElementById('checkoutBtn').addEventListener('click', checkout);
        
        window.addEventListener('click', (e) => {
            if (e.target === document.getElementById('cartModal')) {
                document.getElementById('cartModal').style.display = 'none';
                document.body.style.overflow = 'auto';
            }
        });
    }

    function checkout() {
        if (localStorage.getItem('userLoggedIn') !== 'true') {
            toggleAuthModal();
            document.querySelector('.auth-tab[data-tab="login"]').click();
            showNotification('Пожалуйста, войдите в систему для оформления заказа');
            return;
        }
        
        if (cart.items.length === 0) {
            showNotification('Корзина пуста');
            return;
        }
        
        createOrder(cart.items);
        cart.clear();
        document.getElementById('cartModal').style.display = 'none';
        document.body.style.overflow = 'auto';
        showNotification('Заказ успешно оформлен!');
    }

    function createOrder(items) {
        const orders = JSON.parse(localStorage.getItem('userOrders')) || [];
        const total = items.reduce((sum, item) => sum + parseFloat(item.price.replace(/[^\d.]/g, '')), 0);
        
        const order = {
            id: 'ORD-' + Date.now().toString().slice(-6),
            date: new Date().toISOString(),
            status: 'processing',
            items: items,
            total: total.toFixed(2) + ' ₽',
            shippingDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
            trackingNumber: 'TRK' + Math.floor(Math.random() * 1000000).toString().padStart(6, '0'),
            shippingMethod: ['Почта России', 'СДЭК', 'DHL'][Math.floor(Math.random() * 3)],
            shippingAddress: JSON.parse(localStorage.getItem('userAccountDetails'))?.address || ''
        };
        
        orders.unshift(order);
        localStorage.setItem('userOrders', JSON.stringify(orders));
        
        showNotification(`Заказ #${order.id} успешно оформлен!`);
    }

    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', function() {
            const productCard = this.closest('.product-card');
            const product = {
                id: productCard.dataset.category + '-' + Date.now().toString().slice(-6),
                title: productCard.querySelector('.product-title').textContent,
                price: productCard.querySelector('.price').textContent,
                image: productCard.querySelector('.product-image img').src
            };
            
            cart.addItem(product);
        });
    });

    document.querySelector('.scroll-btn').addEventListener('click', function(e) {
        e.preventDefault();
        document.querySelector('.tea-house').scrollIntoView({
            behavior: 'smooth'
        });
    });

    window.addEventListener('scroll', function() {
        const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
        const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrollProgress = (scrollTop / scrollHeight) * 100;
        document.querySelector('.scroll-progress').style.width = scrollProgress + '%';
    });

    function highlightActiveSection() {
        const sections = document.querySelectorAll('section');
        const navLinks = document.querySelectorAll('.nav-link');
        
        let currentSection = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            
            if (pageYOffset >= (sectionTop - 200)) {
                currentSection = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').includes(currentSection)) {
                link.classList.add('active');
            }
        });
    }
    
    window.addEventListener('scroll', highlightActiveSection);
    highlightActiveSection();

    function init() {
        checkAuthStatus();
        initCart();
        
        document.querySelectorAll('[href="#account"]').forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                toggleAccountModal();
            });
        });
    }
    
    init();
});