 // Preloader
        window.addEventListener('load', function() {
            const preloader = document.querySelector('.preloader');
            preloader.classList.add('fade-out');
            setTimeout(() => {
                preloader.style.display = 'none';
            }, 500);
        });

        // Mobile Menu Toggle
        const mobileMenuBtn = document.getElementById('mobileMenuBtn');
        const mainNav = document.getElementById('mainNav');
        const overlay = document.getElementById('overlay');
        
        mobileMenuBtn.addEventListener('click', () => {
            mainNav.classList.toggle('active');
            overlay.classList.toggle('active');
            mobileMenuBtn.innerHTML = mainNav.classList.contains('active') ? 
                '<i class="fas fa-times"></i>' : '<i class="fas fa-bars"></i>';
        });

        // Close mobile menu when clicking on overlay
        overlay.addEventListener('click', () => {
            mainNav.classList.remove('active');
            overlay.classList.remove('active');
            mobileMenuBtn.innerHTML = '<i class="fas fa-bars"></i>';
        });

        // Sticky Header
        window.addEventListener('scroll', function() {
            const header = document.querySelector('header');
            header.classList.toggle('scrolled', window.scrollY > 50);
        });

        // Smooth Scrolling for Anchor Links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                e.preventDefault();
                
                if(this.getAttribute('href') === '#') return;
                
                const target = document.querySelector(this.getAttribute('href'));
                if(target) {
                    window.scrollTo({
                        top: target.offsetTop - 80,
                        behavior: 'smooth'
                    });
                    
                    // Close mobile menu if open
                    if(mainNav.classList.contains('active')) {
                        mainNav.classList.remove('active');
                        overlay.classList.remove('active');
                        mobileMenuBtn.innerHTML = '<i class="fas fa-bars"></i>';
                    }
                }
            });
        });
        
        // Product Filtering
        const filterBtns = document.querySelectorAll('.filter-btn');
        const productCards = document.querySelectorAll('.product-card');
        
        filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                // Update active button
                filterBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                
                const filter = btn.getAttribute('data-filter');
                
                // Filter products
                productCards.forEach(card => {
                    if(filter === 'all' || card.getAttribute('data-category') === filter) {
                        card.style.display = 'block';
                    } else {
                        card.style.display = 'none';
                    }
                });
            });
        });
        
        // Shopping Cart Functionality
        const cartIcon = document.getElementById('cartIcon');
        const cartSidebar = document.getElementById('cartSidebar');
        const closeCart = document.getElementById('closeCart');
        const overlayCart = document.getElementById('overlay');
        const cartItemsContainer = document.getElementById('cartItems');
        const cartFooter = document.getElementById('cartFooter');
        const cartTotal = document.getElementById('cartTotal');
        const cartCount = document.querySelector('.cart-count');
        
        let cart = [];
        
        // Toggle cart sidebar
        cartIcon.addEventListener('click', (e) => {
            e.preventDefault();
            cartSidebar.classList.add('active');
            overlay.classList.add('active');
        });
        
        closeCart.addEventListener('click', () => {
            cartSidebar.classList.remove('active');
            overlay.classList.remove('active');
        });
        
        // Add to cart functionality
        const addToCartBtns = document.querySelectorAll('.add-to-cart');
        
        addToCartBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const productCard = btn.closest('.product-card');
                const productId = productCard.getAttribute('data-id') || Math.floor(Math.random() * 1000);
                const productTitle = productCard.querySelector('.product-title').textContent;
                const productPrice = parseFloat(productCard.querySelector('.product-price').textContent.replace(/[^0-9.]/g, ''));
                const productImage = productCard.querySelector('.product-img img').src;
                
                // Check if product already in cart
                const existingItem = cart.find(item => item.id === productId);
                
                if(existingItem) {
                    existingItem.quantity += 1;
                } else {
                    cart.push({
                        id: productId,
                        title: productTitle,
                        price: productPrice,
                        image: productImage,
                        quantity: 1
                    });
                }
                
                updateCart();
                
                // Add animation
                btn.innerHTML = '<i class="fas fa-check"></i>';
                setTimeout(() => {
                    btn.innerHTML = '<i class="fas fa-shopping-cart"></i>';
                }, 1000);
            });
        });
        
        // Update cart function
        function updateCart() {
            // Update cart count
            const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
            cartCount.textContent = totalItems;
            
            // Update cart items
            if(cart.length === 0) {
                cartItemsContainer.innerHTML = `
                    <div class="empty-cart">
                        <i class="fas fa-shopping-cart"></i>
                        <p>Your cart is currently empty</p>
                        <a href="#products" class="btn">Continue Shopping</a>
                    </div>
                `;
                cartFooter.style.display = 'none';
            } else {
                cartItemsContainer.innerHTML = '';
                cart.forEach(item => {
                    const cartItem = document.createElement('div');
                    cartItem.className = 'cart-item';
                    cartItem.innerHTML = `
                        <div class="cart-item-image">
                            <img src="${item.image}" alt="${item.title}">
                        </div>
                        <div class="cart-item-details">
                            <h4 class="cart-item-title">${item.title}</h4>
                            <div class="cart-item-price">$${item.price.toFixed(2)}</div>
                            <div class="cart-item-quantity">
                                <button class="decrease-qty" data-id="${item.id}">-</button>
                                <input type="text" value="${item.quantity}" readonly>
                                <button class="increase-qty" data-id="${item.id}">+</button>
                                <span class="remove-item" data-id="${item.id}"><i class="fas fa-times"></i></span>
                            </div>
                        </div>
                    `;
                    cartItemsContainer.appendChild(cartItem);
                });
                
                // Calculate total
                const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
                cartTotal.textContent = `$${total.toFixed(2)}`;
                cartFooter.style.display = 'block';
            }
            
            // Open cart if not empty
            if(cart.length > 0 && !cartSidebar.classList.contains('active')) {
                cartSidebar.classList.add('active');
                overlay.classList.add('active');
            }
        }
        
        // Handle quantity changes and removal
        document.addEventListener('click', function(e) {
            // Increase quantity
            if(e.target.classList.contains('increase-qty')) {
                const productId = e.target.getAttribute('data-id');
                const item = cart.find(item => item.id === productId);
                if(item) {
                    item.quantity += 1;
                    updateCart();
                }
            }
            
            // Decrease quantity
            if(e.target.classList.contains('decrease-qty')) {
                const productId = e.target.getAttribute('data-id');
                const item = cart.find(item => item.id === productId);
                if(item && item.quantity > 1) {
                    item.quantity -= 1;
                    updateCart();
                }
            }
            
            // Remove item
            if(e.target.classList.contains('remove-item') || e.target.parentElement.classList.contains('remove-item')) {
                const productId = e.target.classList.contains('remove-item') ? 
                    e.target.getAttribute('data-id') : e.target.parentElement.getAttribute('data-id');
                cart = cart.filter(item => item.id !== productId);
                updateCart();
            }
        });
        
        // Testimonial Slider
        let currentTestimonial = 0;
        const testimonials = document.querySelectorAll('.testimonial-card');
        
        function showTestimonial(index) {
            testimonials.forEach((testimonial, i) => {
                testimonial.style.display = i === index ? 'block' : 'none';
            });
        }
        
        // Initialize
        showTestimonial(0);
        
        // Auto-rotate testimonials
        setInterval(() => {
            currentTestimonial = (currentTestimonial + 1) % testimonials.length;
            showTestimonial(currentTestimonial);
        }, 7000);
        
        // Form Submission
        const contactForm = document.getElementById('contactForm');
        
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Here you would typically send the form data to a server
            alert('Thank you for your message! We will get back to you soon.');
            contactForm.reset();
        });
        
        // Back to Top Button
        const backToTop = document.getElementById('backToTop');
        
        window.addEventListener('scroll', () => {
            if(window.pageYOffset > 300) {
                backToTop.classList.add('active');
            } else {
                backToTop.classList.remove('active');
            }
        });
        
        backToTop.addEventListener('click', (e) => {
            e.preventDefault();
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
        
        // Animation on Scroll
        function animateOnScroll() {
            const elements = document.querySelectorAll('.animate-in');
            
            elements.forEach(element => {
                const elementPosition = element.getBoundingClientRect().top;
                const screenPosition = window.innerHeight / 1.2;
                
                if(elementPosition < screenPosition) {
                    element.classList.add('animated');
                }
            });
        }
        
        window.addEventListener('scroll', animateOnScroll);
        animateOnScroll(); // Initialize
        
        // Counter Animation for Stats
        const statNumbers = document.querySelectorAll('.stat-number');
        
        function animateStats() {
            statNumbers.forEach(stat => {
                const target = parseInt(stat.getAttribute('data-count'));
                const duration = 2000;
                const step = target / (duration / 16);
                let current = 0;
                
                const counter = setInterval(() => {
                    current += step;
                    if(current >= target) {
                        clearInterval(counter);
                        stat.textContent = target;
                    } else {
                        stat.textContent = Math.floor(current);
                    }
                }, 16);
            });
        }
        
        // Initialize stats animation when in view
        const statsSection = document.querySelector('.stats');
        
        function checkStatsInView() {
            const statsPosition = statsSection.getBoundingClientRect().top;
            const screenPosition = window.innerHeight / 1.2;
            
            if(statsPosition < screenPosition) {
                animateStats();
                window.removeEventListener('scroll', checkStatsInView);
            }
        }
        
        window.addEventListener('scroll', checkStatsInView);
        checkStatsInView(); // Initialize
        
        // Product Quick View Modal
        const productModal = document.getElementById('productModal');
        const closeModal = document.getElementById('closeModal');
        const modalProductContent = document.getElementById('modalProductContent');
        const quickViewBtns = document.querySelectorAll('.quick-view');
        
        // Sample product data (in a real app, this would come from a database)
        const products = [
            {
                id: 1,
                title: "European Oak Timber",
                category: "Hardwood",
                price: 14.99,
                oldPrice: 17.99,
                image: "https://images.unsplash.com/photo-1595437193395-f77b5f744102",
                description: "Premium grade European oak with beautiful grain patterns, perfect for fine furniture and flooring. Sourced from sustainable forests in France, this oak is kiln-dried to 8% moisture content for superior stability.",
                details: [
                    "Species: Quercus robur",
                    "Thickness: 1\" (25mm)",
                    "Width: 6\" to 12\" (150mm to 300mm)",
                    "Length: 6' to 12' (1.8m to 3.6m)",
                    "Moisture Content: 8%",
                    "Finish: Rough sawn or planed"
                ],
                badge: "Premium"
            },
            {
                id: 2,
                title: "Clear Pine Timber",
                category: "Softwood",
                price: 8.49,
                oldPrice: null,
                image: "https://images.unsplash.com/photo-1560713781-d5b38725839e",
                description: "Knot-free clear pine with excellent workability, ideal for interior trim and cabinetry. This premium pine is sustainably harvested and carefully graded to ensure consistent quality throughout your project.",
                details: [
                    "Species: Pinus strobus",
                    "Thickness: 3/4\" (19mm)",
                    "Width: 4\" to 10\" (100mm to 250mm)",
                    "Length: 8' to 16' (2.4m to 4.8m)",
                    "Moisture Content: 12%",
                    "Finish: S4S (Surfaced 4 Sides)"
                ],
                badge: null
            },
            {
                id: 3,
                title: "Baltic Birch Plywood",
                category: "Plywood",
                price: 52.99,
                oldPrice: 59.99,
                image: "https://images.unsplash.com/photo-1595437193395-f77b5f744102",
                description: "Premium 18mm Baltic birch with void-free core and beautiful finish, perfect for cabinetry. Each sheet features multiple thin plies of birch veneer for exceptional strength and stability.",
                details: [
                    "Core: Baltic Birch",
                    "Thickness: 18mm (3/4\")",
                    "Size: 5' x 5' (1525mm x 1525mm)",
                    "Grade: B/BB",
                    "Finish: Sanded both sides",
                    "Edge: Plain (unbanded)"
                ],
                badge: "Best Seller"
            },
            {
                id: 4,
                title: "Premium Redwood Decking",
                category: "Decking",
                price: 7.99,
                oldPrice: null,
                image: "https://images.unsplash.com/photo-1595437193395-f77b5f744102",
                description: "Naturally resistant redwood deck boards with rich color and straight grain. This premium decking material is sustainably harvested and ideal for outdoor living spaces that combine beauty and durability.",
                details: [
                    "Species: Sequoia sempervirens",
                    "Thickness: 1\" (25mm)",
                    "Width: 6\" (150mm)",
                    "Length: 12' to 20' (3.6m to 6m)",
                    "Profile: Grooved or square edge",
                    "Finish: Rough sawn or smooth"
                ],
                badge: null
            },
            {
                id: 5,
                title: "Black Walnut Timber",
                category: "Hardwood",
                price: 19.75,
                oldPrice: null,
                image: "https://images.unsplash.com/photo-1595437193395-f77b5f744102",
                description: "Rich dark walnut with stunning grain, highly prized for furniture and veneers. This premium hardwood is sourced from sustainable forests and carefully dried to prevent warping and checking.",
                details: [
                    "Species: Juglans nigra",
                    "Thickness: 4/4, 5/4, 6/4, 8/4",
                    "Width: 6\" to 16\" (150mm to 400mm)",
                    "Length: 6' to 12' (1.8m to 3.6m)",
                    "Moisture Content: 8%",
                    "Finish: Rough sawn or planed"
                ],
                badge: "New"
            },
            {
                id: 6,
                title: "Reclaimed Barn Wood",
                category: "Specialty",
                price: 15.50,
                oldPrice: null,
                image: "https://images.unsplash.com/photo-1595437193395-f77b5f744102",
                description: "Authentic century-old barn wood with unique patina and character. Each piece tells a story with its weathered texture, nail holes, and natural aging that can't be replicated with new wood.",
                details: [
                    "Species: Mixed (primarily oak, pine)",
                    "Thickness: 3/4\" to 1 1/2\" (19mm to 38mm)",
                    "Width: 6\" to 12\" (150mm to 300mm)",
                    "Length: 4' to 12' (1.2m to 3.6m)",
                    "Finish: Naturally weathered",
                    "Treatment: Kiln-dried to eliminate pests"
                ],
                badge: null
            },
            {
                id: 7,
                title: "Aromatic Cedar",
                category: "Softwood",
                price: 10.99,
                oldPrice: null,
                image: "https://images.unsplash.com/photo-1595437193395-f77b5f744102",
                description: "Naturally insect-resistant cedar with distinctive aroma, perfect for closets and chests. This aromatic wood not only repels moths but also adds a pleasant scent to any storage space.",
                details: [
                    "Species: Juniperus virginiana",
                    "Thickness: 3/4\" (19mm)",
                    "Width: 4\" to 10\" (100mm to 250mm)",
                    "Length: 6' to 12' (1.8m to 3.6m)",
                    "Moisture Content: 12%",
                    "Finish: S4S (Surfaced 4 Sides)"
                ],
                badge: null
            },
            {
                id: 8,
                title: "Marine Grade Plywood",
                category: "Plywood",
                price: 92.99,
                oldPrice: null,
                image: "https://images.unsplash.com/photo-1595437193395-f77b5f744102",
                description: "Waterproof marine ply with exterior glue and hardwood veneers for boat building. This premium plywood is designed to withstand constant moisture exposure without delaminating.",
                details: [
                    "Core: Okoume or Meranti",
                    "Thickness: 6mm to 25mm",
                    "Size: 4' x 8' (1220mm x 2440mm)",
                    "Grade: BS1088",
                    "Finish: Sanded both sides",
                    "Glue: Waterproof WBP"
                ],
                badge: "Limited"
            }
        ];
        
        quickViewBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const productId = parseInt(btn.getAttribute('data-id'));
                const product = products.find(p => p.id === productId);
                
                if(product) {
                    modalProductContent.innerHTML = `
                        <div class="modal-product-image">
                            ${product.badge ? `<div class="modal-product-badge">${product.badge}</div>` : ''}
                            <img src="${product.image}" alt="${product.title}">
                        </div>
                        <div class="modal-product-info">
                            <span class="modal-product-category">${product.category}</span>
                            <h2>${product.title}</h2>
                            <div class="modal-product-price">
                                $${product.price.toFixed(2)}
                                ${product.oldPrice ? `<span class="old-price">$${product.oldPrice.toFixed(2)}</span>` : ''}
                            </div>
                            <p class="modal-product-description">${product.description}</p>
                            <div class="modal-product-meta">
                                ${product.details.map(detail => `<p><i class="fas fa-check"></i> ${detail}</p>`).join('')}
                            </div>
                            <div class="modal-product-actions">
                                <div class="quantity-selector">
                                    <button class="quantity-btn decrease">-</button>
                                    <input type="text" class="quantity-input" value="1">
                                    <button class="quantity-btn increase">+</button>
                                </div>
                                <button class="btn add-to-cart-modal">Add to Cart</button>
                            </div>
                        </div>
                    `;
                    
                    productModal.classList.add('active');
                    overlay.classList.add('active');
                }
            });
        });
        
        closeModal.addEventListener('click', () => {
            productModal.classList.remove('active');
            overlay.classList.remove('active');
        });
        
        // Close modal when clicking on overlay
        overlay.addEventListener('click', () => {
            productModal.classList.remove('active');
            cartSidebar.classList.remove('active');
            overlay.classList.remove('active');
        });
        
        // Add to cart from modal
        document.addEventListener('click', function(e) {
            if(e.target.classList.contains('add-to-cart-modal')) {
                const productCard = e.target.closest('.modal-product');
                const productTitle = productCard.querySelector('h2').textContent;
                const productPrice = parseFloat(productCard.querySelector('.modal-product-price').textContent.replace(/[^0-9.]/g, ''));
                const productImage = productCard.querySelector('img').src;
                const quantity = parseInt(productCard.querySelector('.quantity-input').value);
                
                // Generate a random ID for demo purposes
                const productId = Math.floor(Math.random() * 1000);
                
                // Check if product already in cart
                const existingItem = cart.find(item => item.title === productTitle);
                
                if(existingItem) {
                    existingItem.quantity += quantity;
                } else {
                    cart.push({
                        id: productId,
                        title: productTitle,
                        price: productPrice,
                        image: productImage,
                        quantity: quantity
                    });
                }
                
                updateCart();
                productModal.classList.remove('active');
                overlay.classList.remove('active');
                
                // Show added to cart message
                alert(`${quantity} ${productTitle} added to cart`);
            }
            
            // Handle quantity changes in modal
            if(e.target.classList.contains('quantity-btn')) {
                const input = e.target.parentElement.querySelector('.quantity-input');
                let value = parseInt(input.value);
                
                if(e.target.classList.contains('increase')) {
                    value += 1;
                } else if(e.target.classList.contains('decrease') && value > 1) {
                    value -= 1;
                }
                
                input.value = value;
            }
        });