document.addEventListener('DOMContentLoaded', function() {
    // ====================== Preloader ======================
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

    // ====================== Sakura Petals ======================
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

    // ====================== Torii Menu ======================
    const toriiMenu = document.querySelector('.torii-menu');
    const toriiGate = document.querySelector('.torii-gate');
    
    toriiGate.addEventListener('click', function() {
        toriiMenu.classList.toggle('active');
        
        if (toriiMenu.classList.contains('active')) {
            toriiGate.style.transform = 'scale(1.1)';
            toriiGate.style.boxShadow = '0 0 20px rgba(210, 54, 105, 0.5)';
        } else {
            toriiGate.style.transform = 'scale(1)';
            toriiGate.style.boxShadow = 'none';
        }
    });

    document.addEventListener('click', function(e) {
        if (!toriiMenu.contains(e.target) && !e.target.classList.contains('torii-gate')) {
            toriiMenu.classList.remove('active');
            toriiGate.style.transform = 'scale(1)';
            toriiGate.style.boxShadow = 'none';
        }
    });

    // ====================== Auth System ======================
    const authModal = document.getElementById('authModal');
    const closeAuth = document.querySelector('.close-auth');
    const authTabs = document.querySelectorAll('.auth-tab');
    const authContents = document.querySelectorAll('.auth-content');
    const userProfileItem = document.querySelector('.user-profile-item');
    const profileDropdown = document.getElementById('profileDropdown');
    const settingsLink = document.getElementById('settingsLink');
    const logoutLink = document.getElementById('logoutLink');
    const nightModeToggle = document.getElementById('nightModeToggle');
    const userAvatar = document.getElementById('userAvatar');

    // Check auth status
    function checkAuthStatus() {
        const isLoggedIn = localStorage.getItem('userLoggedIn') === 'true';
        
        if (isLoggedIn) {
            const userName = localStorage.getItem('userName') || 'Профиль';
            userAvatar.innerHTML = userName;
            profileDropdown.style.display = 'block';
        } else {
            userAvatar.innerHTML = '<i class="fas fa-user"></i>';
            profileDropdown.style.display = 'none';
        }
    }

    // Toggle auth modal
    function toggleAuthModal() {
        authModal.style.display = authModal.style.display === 'block' ? 'none' : 'block';
        document.body.style.overflow = authModal.style.display === 'block' ? 'hidden' : 'auto';
    }

    // Switch auth tabs
    authTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            const tabId = this.getAttribute('data-tab');
            
            authTabs.forEach(t => t.classList.remove('active'));
            authContents.forEach(c => c.style.display = 'none');
            
            this.classList.add('active');
            document.getElementById(tabId).style.display = 'block';
        });
    });

    // Login form
    document.getElementById('loginForm').addEventListener('submit', function(e) {
        e.preventDefault();
        const email = document.getElementById('loginEmail').value;
        const password = document.getElementById('loginPassword').value;
        
        if (email && password) {
            localStorage.setItem('userLoggedIn', 'true');
            localStorage.setItem('userEmail', email);
            
            if (!localStorage.getItem('userName')) {
                localStorage.setItem('userName', email.split('@')[0]);
            }
            
            checkAuthStatus();
            toggleAuthModal();
            showNotification('Вход выполнен успешно!');
            initAccountModal();
        } else {
            alert('Пожалуйста, заполните все поля');
        }
    });

    // Register form
    document.getElementById('registerForm').addEventListener('submit', function(e) {
        e.preventDefault();
        const name = document.getElementById('regName').value;
        const email = document.getElementById('regEmail').value;
        const password = document.getElementById('regPassword').value;
        const confirm = document.getElementById('regConfirm').value;
        
        if (password !== confirm) {
            alert('Пароли не совпадают!');
            return;
        }
        
        if (name && email && password) {
            localStorage.setItem('userLoggedIn', 'true');
            localStorage.setItem('userName', name);
            localStorage.setItem('userEmail', email);
            
            checkAuthStatus();
            toggleAuthModal();
            showNotification(`Регистрация прошла успешно! Добро пожаловать, ${name}!`);
            initAccountModal();
        } else {
            alert('Пожалуйста, заполните все поля');
        }
    });

    // Profile dropdown
    userProfileItem.addEventListener('click', function(e) {
        if (localStorage.getItem('userLoggedIn') !== 'true') {
            e.preventDefault();
            toggleAuthModal();
            document.querySelector('.auth-tab[data-tab="login"]').click();
        }
    });

    // Settings link
    settingsLink.addEventListener('click', function(e) {
        e.preventDefault();
        if (localStorage.getItem('userLoggedIn') === 'true') {
            toggleSettingsModal();
        } else {
            toggleAuthModal();
            document.querySelector('.auth-tab[data-tab="login"]').click();
            showNotification('Пожалуйста, войдите в систему');
        }
    });

    // Logout
    logoutLink.addEventListener('click', function(e) {
        e.preventDefault();
        if (confirm('Вы уверены, что хотите выйти?')) {
            localStorage.removeItem('userLoggedIn');
            checkAuthStatus();
            showNotification('Вы вышли из системы');
            // Очищаем аватар при выходе
            userAvatar.style.backgroundImage = '';
            userAvatar.innerHTML = '<i class="fas fa-user"></i>';
        }
    });

    // Close auth modal
    closeAuth.addEventListener('click', toggleAuthModal);

    // ====================== Settings System ======================
    const settingsModal = document.getElementById('settingsModal');
    const closeSettings = document.querySelector('.close-settings');
    const settingsTabs = document.querySelectorAll('.settings-tab');
    const settingsContents = document.querySelectorAll('.settings-content');
    const avatarUpload = document.getElementById('avatarUpload');
    const avatarPreview = document.getElementById('avatarPreview');
    const resetAvatar = document.getElementById('resetAvatar');
    const bgUpload = document.getElementById('bgUpload');
    const bgPreview = document.getElementById('bgPreview');
    const resetBg = document.getElementById('resetBg');
    const themeOptions = document.querySelectorAll('.theme-option');
    const saveSettings = document.getElementById('saveSettings');

    // Toggle settings modal
    function toggleSettingsModal() {
        settingsModal.style.display = settingsModal.style.display === 'block' ? 'none' : 'block';
        document.body.style.overflow = settingsModal.style.display === 'block' ? 'hidden' : 'auto';
    }

    // Switch settings tabs
    settingsTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            const tabId = this.getAttribute('data-tab');
            
            settingsTabs.forEach(t => t.classList.remove('active'));
            settingsContents.forEach(c => c.classList.remove('active'));
            
            this.classList.add('active');
            document.getElementById(tabId).classList.add('active');
        });
    });

    // Avatar upload
    avatarUpload.addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(event) {
                avatarPreview.style.backgroundImage = `url(${event.target.result})`;
                avatarPreview.innerHTML = '';
            };
            reader.readAsDataURL(file);
        }
    });

    // Reset avatar
    resetAvatar.addEventListener('click', function() {
        avatarPreview.style.backgroundImage = '';
        avatarPreview.innerHTML = '<i class="fas fa-user"></i>';
        avatarUpload.value = '';
    });

    // Background upload
    bgUpload.addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(event) {
                bgPreview.style.backgroundImage = `url(${event.target.result})`;
                bgPreview.innerHTML = '';
            };
            reader.readAsDataURL(file);
        }
    });

    // Reset Background
    resetBg.addEventListener('click', function() {
        bgPreview.style.backgroundImage = '';
        bgPreview.innerHTML = '<i class="fas fa-image"></i>';
        bgUpload.value = '';
        
        const currentSettings = JSON.parse(localStorage.getItem('userSettings')) || {};
        delete currentSettings.background;
        localStorage.setItem('userSettings', JSON.stringify(currentSettings));
        
        const heroBg = document.getElementById('heroBackground');
        if (heroBg) {
            heroBg.style.backgroundImage = 
                'linear-gradient(rgba(255, 200, 221, 0.7), rgba(255, 223, 223, 0.7)), ' +
                'url("https://images.unsplash.com/photo-1492571350019-22de08371fd3?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80")';
            
            if (document.body.classList.contains('night-mode')) {
                heroBg.style.backgroundImage = 
                    'linear-gradient(rgba(26, 26, 46, 0.7), rgba(26, 26, 46, 0.7)), ' +
                    'url("https://images.unsplash.com/photo-1492571350019-22de08371fd3?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80")';
            }
        }
    });

    // Theme selection
    themeOptions.forEach(option => {
        option.addEventListener('click', function() {
            themeOptions.forEach(opt => opt.classList.remove('active'));
            this.classList.add('active');
        });
    });

    // Save settings
    saveSettings.addEventListener('click', function() {
        const activeTheme = document.querySelector('.theme-option.active')?.getAttribute('data-theme') || 'default';
        const settings = {
            avatar: avatarPreview.style.backgroundImage || '',
            background: bgPreview.style.backgroundImage || '',
            theme: activeTheme,
            updated: new Date().toISOString()
        };
        
        localStorage.setItem('userSettings', JSON.stringify(settings));
        applyUserSettings(settings);
        toggleSettingsModal();
        showNotification('Настройки сохранены!');
    });

    function applyUserSettings(settings) {
        if (!settings) {
            const heroBg = document.getElementById('heroBackground');
            if (heroBg) {
                heroBg.style.backgroundImage = 
                    'linear-gradient(rgba(255, 200, 221, 0.7), rgba(255, 223, 223, 0.7)), ' +
                    'url("https://images.unsplash.com/photo-1492571350019-22de08371fd3?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80")';
                
                if (document.body.classList.contains('night-mode')) {
                    heroBg.style.backgroundImage = 
                        'linear-gradient(rgba(26, 26, 46, 0.7), rgba(26, 26, 46, 0.7)), ' +
                        'url("https://images.unsplash.com/photo-1492571350019-22de08371fd3?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80")';
                }
            }
            return;
        }
        
        // Avatar
        if (settings.avatar) {
            userAvatar.style.backgroundImage = settings.avatar;
            userAvatar.innerHTML = '';
        } else {
            userAvatar.style.backgroundImage = '';
            userAvatar.innerHTML = localStorage.getItem('userLoggedIn') === 'true' ? 
                (localStorage.getItem('userName') || 'Профиль') : '<i class="fas fa-user"></i>';
        }
        
        // Background
        const heroBg = document.getElementById('heroBackground');
        if (heroBg && settings.background) {
            heroBg.style.backgroundImage = 
                `linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.3)), ${settings.background}`;
        }
        
        // Theme
        if (settings.theme) {
            applyTheme(settings.theme);
        }
    }

    // Apply theme
    function applyTheme(theme) {
        document.body.className = '';
        document.body.classList.add(`theme-${theme}`);
        localStorage.setItem('currentTheme', theme);
        
        themeOptions.forEach(opt => {
            opt.classList.toggle('active', opt.getAttribute('data-theme') === theme);
        });
        
        updateHeroText();
    }

    // Night mode toggle
    nightModeToggle.addEventListener('click', function(e) {
        e.preventDefault();
        document.body.classList.toggle('night-mode');
        localStorage.setItem('nightMode', document.body.classList.contains('night-mode'));
    });

    // Load settings
    function loadUserSettings() {
        // Night mode
        if (localStorage.getItem('nightMode') === 'true') {
            document.body.classList.add('night-mode');
        }
        
        // Theme
        const savedTheme = localStorage.getItem('currentTheme') || 'default';
        applyTheme(savedTheme);
        
        // Other settings
        const saved = localStorage.getItem('userSettings');
        if (saved) {
            try {
                const settings = JSON.parse(saved);
                
                // Avatar
                if (settings.avatar) {
                    userAvatar.style.backgroundImage = settings.avatar;
                    userAvatar.innerHTML = '';
                    avatarPreview.style.backgroundImage = settings.avatar;
                    avatarPreview.innerHTML = '';
                }
                
                // Background
                if (settings.background) {
                    const heroBg = document.getElementById('heroBackground');
                    if (heroBg) {
                        heroBg.style.backgroundImage = 
                            `linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.3)), ${settings.background}`;
                    }
                    bgPreview.style.backgroundImage = settings.background;
                    bgPreview.innerHTML = '';
                }
                
                return settings;
            } catch (e) {
                console.error('Error loading settings:', e);
            }
        }
        return null;
    }

    // Close settings
    closeSettings.addEventListener('click', toggleSettingsModal);

    // ====================== Cart System ======================
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
        },
        
        updateQuantity: function(productId, quantity) {
            const item = this.items.find(item => item.id === productId);
            if (item) {
                item.quantity = parseInt(quantity) || 1;
                this.save();
                this.updateUI();
            }
        },
        
        clear: function() {
            this.items = [];
            this.save();
            this.updateUI();
        },
        
        getTotal: function() {
            return this.items.reduce((total, item) => {
                return total + (parseFloat(item.price.replace(/[^\d.]/g, '')) * item.quantity);
            }, 0);
        },
        
        save: function() {
            localStorage.setItem('cartItems', JSON.stringify(this.items));
        },
        
        updateUI: function() {
            // Обновляем счетчик корзины
            document.querySelector('.cart-count').textContent = this.items.reduce((sum, item) => sum + item.quantity, 0);
            
            // Обновляем содержимое корзины
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
            
            // Добавляем обработчики событий для новых элементов
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

    // Инициализация корзины
    function initCart() {
        cart.updateUI();
        
        // Обработчик для иконки корзины
        document.getElementById('cartIcon').addEventListener('click', () => {
            document.getElementById('cartModal').style.display = 'block';
            document.body.style.overflow = 'hidden';
        });
        
        // Закрытие модального окна корзины
        document.querySelector('.close-cart').addEventListener('click', () => {
            document.getElementById('cartModal').style.display = 'none';
            document.body.style.overflow = 'auto';
        });
        
        // Обработчик для кнопки оформления заказа
        document.getElementById('checkoutBtn').addEventListener('click', checkout);
        
        // Закрытие при клике вне модального окна
        window.addEventListener('click', (e) => {
            if (e.target === document.getElementById('cartModal')) {
                document.getElementById('cartModal').style.display = 'none';
                document.body.style.overflow = 'auto';
            }
        });
    }

    // Checkout function
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
        showNotification('Заказ успешно оформлен!');
    }

    // Create order function
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

    // ====================== Account System ======================
    const accountModal = document.getElementById('accountModal');
    const closeAccount = document.querySelector('.close-account');
    const accountTabs = document.querySelectorAll('.account-tab');
    const accountContents = document.querySelectorAll('.account-content');
    const ordersList = document.querySelector('.orders-list');
    const trackingInfo = document.querySelector('.tracking-info');
    const accountForm = document.getElementById('accountForm');

    // Инициализация модального окна личного кабинета
    function initAccountModal() {
        // Обработчик для открытия личного кабинета
        document.querySelectorAll('[href="#account"]').forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                if (localStorage.getItem('userLoggedIn') === 'true') {
                    document.getElementById('accountModal').style.display = 'block';
                    document.body.style.overflow = 'hidden';
                    document.querySelector('.account-tab[data-tab="orders"]').click();
                    loadAccountDetails();
                } else {
                    toggleAuthModal();
                    document.querySelector('.auth-tab[data-tab="login"]').click();
                    showNotification('Пожалуйста, войдите в систему');
                }
            });
        });
        
        // Закрытие модального окна личного кабинета
        closeAccount.addEventListener('click', function() {
            document.getElementById('accountModal').style.display = 'none';
            document.body.style.overflow = 'auto';
        });
        
        // Закрытие при клике вне модального окна
        window.addEventListener('click', function(e) {
            if (e.target === document.getElementById('accountModal')) {
                document.getElementById('accountModal').style.display = 'none';
                document.body.style.overflow = 'auto';
            }
        });
        
        // Switch account tabs
        accountTabs.forEach(tab => {
            tab.addEventListener('click', function() {
                const tabId = this.getAttribute('data-tab');
                
                accountTabs.forEach(t => t.classList.remove('active'));
                accountContents.forEach(c => c.classList.remove('active'));
                
                this.classList.add('active');
                document.getElementById(tabId).classList.add('active');
                
                if (tabId === 'orders') {
                    loadOrders();
                }
                
                if (tabId === 'tracking') {
                    loadTracking();
                }
            });
        });

        // Load user orders
        function loadOrders() {
            const orders = JSON.parse(localStorage.getItem('userOrders')) || [];
            
            if (orders.length === 0) {
                ordersList.innerHTML = `
                    <div class="no-orders">
                        <i class="fas fa-box-open"></i>
                        <p>У вас пока нет заказов</p>
                        <a href="#sssss" class="btn">Перейти в магазин</a>
                    </div>
                `;
                return;
            }
            
            let ordersHTML = '';
            
            orders.forEach(order => {
                let itemsHTML = '';
                
                order.items.forEach(item => {
                    itemsHTML += `
                        <div class="order-item">
                            <div class="order-item-img">
                                <img src="${item.image}" alt="${item.title}">
                            </div>
                            <div class="order-item-info">
                                <div class="order-item-title">${item.title}</div>
                                <div>Количество: ${item.quantity}</div>
                                <div class="order-item-price">${item.price}</div>
                            </div>
                        </div>
                    `;
                });
                
                ordersHTML += `
                    <div class="order-card">
                        <div class="order-header">
                            <div>
                                <span class="order-id">Заказ #${order.id}</span>
                                <span class="order-date">${new Date(order.date).toLocaleDateString()}</span>
                            </div>
                            <div class="order-status status-${order.status}">
                                ${getStatusText(order.status)}
                            </div>
                        </div>
                        <div class="order-items">
                            ${itemsHTML}
                        </div>
                        <div class="order-total">
                            Итого: ${order.total}
                        </div>
                    </div>
                `;
            });
            
            ordersList.innerHTML = ordersHTML;
        }

        // Get status text
        function getStatusText(status) {
            const statuses = {
                'processing': 'В обработке',
                'shipped': 'Отправлен',
                'delivered': 'Доставлен',
                'cancelled': 'Отменен'
            };
            return statuses[status] || status;
        }

        // Load tracking info
        function loadTracking() {
            const orders = JSON.parse(localStorage.getItem('userOrders')) || [];
            const activeOrder = orders.find(order => ['processing', 'shipped'].includes(order.status));
            
            if (!activeOrder) {
                trackingInfo.innerHTML = `
                    <div class="no-tracking">
                        <i class="fas fa-truck"></i>
                        <p>Нет активных заказов для отслеживания</p>
                    </div>
                `;
                return;
            }
            
            const steps = [
                { id: 'ordered', title: 'Заказ оформлен', date: activeOrder.date, completed: true },
                { id: 'processing', title: 'Заказ обрабатывается', date: activeOrder.status === 'processing' ? new Date().toISOString() : activeOrder.shippingDate, completed: true },
                { id: 'shipped', title: 'Заказ отправлен', date: activeOrder.status === 'shipped' ? activeOrder.shippingDate : '', completed: activeOrder.status === 'shipped' },
                { id: 'delivered', title: 'Заказ доставлен', date: '', completed: false }
            ];
            
            let stepsHTML = '';
            
            steps.forEach(step => {
                const date = step.date ? new Date(step.date).toLocaleDateString() : '';
                const activeClass = step.id === activeOrder.status ? 'active' : '';
                const completedClass = step.completed ? 'completed' : '';
                
                stepsHTML += `
                    <div class="tracking-step ${activeClass} ${completedClass}">
                        <div class="tracking-title">${step.title}</div>
                        ${date ? `<div class="tracking-date">${date}</div>` : ''}
                    </div>
                `;
            });
            
            trackingInfo.innerHTML = `
                <div class="tracking-progress">
                    <div class="tracking-steps">
                        ${stepsHTML}
                    </div>
                    <div class="tracking-details">
                        <h4>Детали доставки</h4>
                        <p>Номер отслеживания: <strong>${activeOrder.trackingNumber || 'генерируется'}</strong></p>
                        <p>Служба доставки: <strong>${activeOrder.shippingMethod || 'Почта России'}</strong></p>
                        ${activeOrder.shippingAddress ? `<p>Адрес доставки: <strong>${activeOrder.shippingAddress}</strong></p>` : ''}
                    </div>
                </div>
            `;
        }

        // Save account details
        accountForm.addEventListener('submit', function(e) {
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

        // Load account details
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
            }
        }
    }

    // ====================== Other Functions ======================
    // Notification system
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

    // Update hero text based on theme
    function updateHeroText() {
        const heroTitle = document.querySelector('.hero h1');
        const heroText = document.querySelector('.hero p');
        
        if (document.body.classList.contains('theme-dark')) {
            heroTitle.textContent = 'Темная коллекция японской моды';
            heroText.textContent = 'Откройте для себя элегантность в темных тонах';
        } else if (document.body.classList.contains('theme-sakura')) {
            heroTitle.textContent = 'Коллекция "Сакура"';
            heroText.textContent = 'Нежные цветочные мотивы вдохновленные Японией';
        } else if (document.body.classList.contains('theme-ocean')) {
            heroTitle.textContent = 'Морская коллекция';
            heroText.textContent = 'Свежесть океана в каждой детали';
        } else if (document.body.classList.contains('theme-forest')) {
            heroTitle.textContent = 'Лесная коллекция';
            heroText.textContent = 'Единение с природой в современном стиле';
        } else {
            heroTitle.textContent = 'Добро пожаловать на сайт с продажой одежды под названием スタイル(sutairu)';
            heroText.textContent = 'Откройте для себя красоту и гармонию традиционной Японии';
        }
    }

    // ====================== Scroll Animations ======================
    function checkScroll() {
        const scrollForm = document.querySelector('.scroll-form');
        if (scrollForm && !scrollForm.classList.contains('visible')) {
            const scrollPosition = scrollForm.getBoundingClientRect().top;
            const screenPosition = window.innerHeight / 1.3;
            
            if (scrollPosition < screenPosition) {
                scrollForm.classList.add('visible');
            }
        }
        
        const timelineItems = document.querySelectorAll('.timeline-item');
        timelineItems.forEach((item, index) => {
            const itemPosition = item.getBoundingClientRect().top;
            const screenPosition = window.innerHeight / 1.3;
            
            if (itemPosition < screenPosition) {
                setTimeout(() => {
                    item.classList.add('visible');
                }, index * 200);
            }
        });
    }
    
    window.addEventListener('scroll', checkScroll);
    checkScroll();

    // Product trees
    const trees = document.querySelectorAll('.tree');
    trees.forEach(tree => {
        tree.addEventListener('click', function() {
            const productId = this.getAttribute('data-product');
            alert(`Вы выбрали товар #${productId}!`);
        });
    });

    // Scroll progress
    window.addEventListener('scroll', function() {
        const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
        const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrollProgress = (scrollTop / scrollHeight) * 100;
        document.querySelector('.scroll-progress').style.width = scrollProgress + '%';
    });

    // Filter products
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            const filter = this.dataset.filter;
            document.querySelectorAll('.product-card').forEach(product => {
                product.style.display = (filter === 'all' || product.dataset.category === filter) ? 'block' : 'none';
            });
        });
    });

    // Smooth scroll to collection
    document.querySelector('.scroll-btn').addEventListener('click', function(e) {
        e.preventDefault();
        document.querySelector('.tea-house').scrollIntoView({
            behavior: 'smooth'
        });
    });

    // Add to cart functionality
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

    // Initialize
    function init() {
        checkAuthStatus();
        loadUserSettings();
        initAccountModal();
        updateHeroText();
        initCart();
    }

    // Initialize on load
    init();
});