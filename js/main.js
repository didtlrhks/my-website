// 디지털 헬스케어 스토어 JavaScript

// 전역 변수
let cart = [];
let products = [];

// 제품 데이터
const productData = [
    {
        id: 1,
        name: "종합 비타민",
        category: "vitamins",
        price: 25000,
        description: "하루 필요한 모든 비타민과 미네랄을 한 번에",
        image: "fas fa-capsules",
        rating: 4.8,
        reviews: 1250
    },
    {
        id: 2,
        name: "비타민 D3",
        category: "vitamins",
        price: 18000,
        description: "뼈 건강과 면역력 강화에 필수적인 비타민 D3",
        image: "fas fa-sun",
        rating: 4.9,
        reviews: 890
    },
    {
        id: 3,
        name: "비타민 C",
        category: "vitamins",
        price: 12000,
        description: "항산화 효과와 면역력 향상에 도움",
        image: "fas fa-lemon",
        rating: 4.7,
        reviews: 2100
    },
    {
        id: 4,
        name: "웨이 프로틴",
        category: "protein",
        price: 45000,
        description: "고품질 단백질로 근육 성장과 회복 지원",
        image: "fas fa-dumbbell",
        rating: 4.8,
        reviews: 1560
    },
    {
        id: 5,
        name: "크레아틴",
        category: "protein",
        price: 32000,
        description: "운동 성능 향상과 근력 증가에 도움",
        image: "fas fa-fire",
        rating: 4.6,
        reviews: 780
    },
    {
        id: 6,
        name: "BCAA",
        category: "protein",
        price: 28000,
        description: "근육 보호와 회복을 위한 필수 아미노산",
        image: "fas fa-atom",
        rating: 4.7,
        reviews: 920
    },
    {
        id: 7,
        name: "오메가3",
        category: "omega",
        price: 35000,
        description: "뇌 건강과 심혈관 건강에 필수적인 오메가3",
        image: "fas fa-fish",
        rating: 4.9,
        reviews: 1890
    },
    {
        id: 8,
        name: "코엔자임 Q10",
        category: "omega",
        price: 42000,
        description: "에너지 생산과 항산화에 도움",
        image: "fas fa-bolt",
        rating: 4.5,
        reviews: 650
    },
    {
        id: 9,
        name: "홍삼",
        category: "herbal",
        price: 55000,
        description: "전통 한방의 지혜, 면역력과 활력 증진",
        image: "fas fa-seedling",
        rating: 4.8,
        reviews: 1340
    },
    {
        id: 10,
        name: "프로폴리스",
        category: "herbal",
        price: 38000,
        description: "천연 항균 성분으로 면역력 강화",
        image: "fas fa-leaf",
        rating: 4.6,
        reviews: 980
    },
    {
        id: 11,
        name: "마그네슘",
        category: "vitamins",
        price: 15000,
        description: "근육 이완과 수면 개선에 도움",
        image: "fas fa-moon",
        rating: 4.4,
        reviews: 720
    },
    {
        id: 12,
        name: "콜라겐",
        category: "protein",
        price: 48000,
        description: "피부 탄력과 관절 건강에 도움",
        image: "fas fa-heart",
        rating: 4.7,
        reviews: 1680
    }
];

// DOM이 로드되면 실행
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

// 앱 초기화
function initializeApp() {
    products = [...productData];
    renderProducts();
    setupEventListeners();
    updateCartCount();
    setupScrollAnimations();
}

// 이벤트 리스너 설정
function setupEventListeners() {
    // 모바일 메뉴 토글
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navMenu = document.querySelector('.nav-menu');
    
    if (mobileMenuBtn && navMenu) {
        mobileMenuBtn.addEventListener('click', function() {
            navMenu.classList.toggle('active');
        });
    }

    // 제품 필터 버튼
    const filterBtns = document.querySelectorAll('.filter-btn');
    filterBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const filter = this.getAttribute('data-filter');
            filterProducts(filter);
            
            // 활성 버튼 변경
            filterBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
        });
    });

    // 카테고리 카드 클릭
    const categoryCards = document.querySelectorAll('.category-card');
    categoryCards.forEach(card => {
        card.addEventListener('click', function() {
            const category = this.getAttribute('data-category');
            filterProducts(category);
            
            // 해당 필터 버튼 활성화
            filterBtns.forEach(b => b.classList.remove('active'));
            const targetBtn = document.querySelector(`[data-filter="${category}"]`);
            if (targetBtn) targetBtn.classList.add('active');
            
            // 제품 섹션으로 스크롤
            document.getElementById('products').scrollIntoView({ 
                behavior: 'smooth' 
            });
        });
    });

    // 장바구니 버튼
    const cartBtn = document.querySelector('.cart-btn');
    if (cartBtn) {
        cartBtn.addEventListener('click', openCart);
    }

    // 모달 닫기
    const modal = document.getElementById('cartModal');
    const closeBtn = document.querySelector('.close');
    
    if (closeBtn) {
        closeBtn.addEventListener('click', closeCart);
    }
    
    if (modal) {
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                closeCart();
            }
        });
    }

    // 문의 폼 제출
    const contactForm = document.querySelector('.contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', handleContactForm);
    }

    // 부드러운 스크롤
    const navLinks = document.querySelectorAll('.nav-menu a[href^="#"]');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({ 
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // 히어로 버튼
    const heroButtons = document.querySelectorAll('.hero-buttons .btn');
    heroButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            if (this.textContent.includes('제품')) {
                document.getElementById('products').scrollIntoView({ 
                    behavior: 'smooth' 
                });
            } else {
                document.getElementById('contact').scrollIntoView({ 
                    behavior: 'smooth' 
                });
            }
        });
    });
}

// 제품 렌더링
function renderProducts(productsToRender = products) {
    const productGrid = document.getElementById('productGrid');
    if (!productGrid) return;

    productGrid.innerHTML = '';

    productsToRender.forEach(product => {
        const productCard = createProductCard(product);
        productGrid.appendChild(productCard);
    });
}

// 제품 카드 생성
function createProductCard(product) {
    const card = document.createElement('div');
    card.className = 'product-card scroll-animate';
    card.innerHTML = `
        <div class="product-image">
            <i class="${product.image}"></i>
        </div>
        <div class="product-info">
            <div class="product-category">${getCategoryName(product.category)}</div>
            <h3 class="product-name">${product.name}</h3>
            <p class="product-description">${product.description}</p>
            <div class="product-rating">
                <div class="stars">
                    ${generateStars(product.rating)}
                </div>
                <span class="rating-text">${product.rating} (${product.reviews}개 리뷰)</span>
            </div>
            <div class="product-price">${product.price.toLocaleString()}원</div>
            <div class="product-actions">
                <button class="btn btn-outline btn-small" onclick="addToCart(${product.id})">
                    <i class="fas fa-cart-plus"></i> 장바구니
                </button>
                <button class="btn btn-primary btn-small" onclick="buyNow(${product.id})">
                    바로구매
                </button>
            </div>
        </div>
    `;
    return card;
}

// 카테고리명 반환
function getCategoryName(category) {
    const categoryNames = {
        'vitamins': '비타민 & 미네랄',
        'protein': '단백질 & 운동',
        'omega': '오메가 & 오일',
        'herbal': '한방 & 허브'
    };
    return categoryNames[category] || category;
}

// 별점 생성
function generateStars(rating) {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    let stars = '';
    
    for (let i = 0; i < fullStars; i++) {
        stars += '<i class="fas fa-star"></i>';
    }
    
    if (hasHalfStar) {
        stars += '<i class="fas fa-star-half-alt"></i>';
    }
    
    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
        stars += '<i class="far fa-star"></i>';
    }
    
    return stars;
}

// 제품 필터링
function filterProducts(category) {
    let filteredProducts = products;
    
    if (category !== 'all') {
        filteredProducts = products.filter(product => product.category === category);
    }
    
    renderProducts(filteredProducts);
    
    // 애니메이션 트리거
    setTimeout(() => {
        const cards = document.querySelectorAll('.product-card');
        cards.forEach((card, index) => {
            setTimeout(() => {
                card.classList.add('animate');
            }, index * 100);
        });
    }, 100);
}

// 장바구니에 제품 추가
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            ...product,
            quantity: 1
        });
    }
    
    updateCartCount();
    showNotification(`${product.name}이(가) 장바구니에 추가되었습니다.`);
}

// 바로 구매
function buyNow(productId) {
    addToCart(productId);
    openCart();
}

// 장바구니 열기
function openCart() {
    const modal = document.getElementById('cartModal');
    if (!modal) return;
    
    renderCartItems();
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden';
}

// 장바구니 닫기
function closeCart() {
    const modal = document.getElementById('cartModal');
    if (!modal) return;
    
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
}

// 장바구니 아이템 렌더링
function renderCartItems() {
    const cartItems = document.getElementById('cartItems');
    const cartTotal = document.getElementById('cartTotal');
    
    if (!cartItems || !cartTotal) return;
    
    if (cart.length === 0) {
        cartItems.innerHTML = '<p style="text-align: center; color: #666; padding: 2rem;">장바구니가 비어있습니다.</p>';
        cartTotal.textContent = '0';
        return;
    }
    
    cartItems.innerHTML = '';
    let total = 0;
    
    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;
        
        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';
        cartItem.style.cssText = `
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 1rem;
            border-bottom: 1px solid #e0e0e0;
        `;
        
        cartItem.innerHTML = `
            <div style="display: flex; align-items: center; gap: 1rem;">
                <i class="${item.image}" style="font-size: 1.5rem; color: #4CAF50;"></i>
                <div>
                    <h4 style="margin: 0; color: #333;">${item.name}</h4>
                    <p style="margin: 0; color: #666; font-size: 0.9rem;">${item.price.toLocaleString()}원</p>
                </div>
            </div>
            <div style="display: flex; align-items: center; gap: 1rem;">
                <div style="display: flex; align-items: center; gap: 0.5rem;">
                    <button onclick="updateQuantity(${item.id}, -1)" style="background: #f0f0f0; border: none; width: 30px; height: 30px; border-radius: 50%; cursor: pointer;">-</button>
                    <span style="min-width: 30px; text-align: center;">${item.quantity}</span>
                    <button onclick="updateQuantity(${item.id}, 1)" style="background: #4CAF50; color: white; border: none; width: 30px; height: 30px; border-radius: 50%; cursor: pointer;">+</button>
                </div>
                <span style="font-weight: 600; color: #4CAF50;">${itemTotal.toLocaleString()}원</span>
                <button onclick="removeFromCart(${item.id})" style="background: #ff4757; color: white; border: none; width: 30px; height: 30px; border-radius: 50%; cursor: pointer;">
                    <i class="fas fa-trash" style="font-size: 0.8rem;"></i>
                </button>
            </div>
        `;
        
        cartItems.appendChild(cartItem);
    });
    
    cartTotal.textContent = total.toLocaleString();
}

// 수량 업데이트
function updateQuantity(productId, change) {
    const item = cart.find(item => item.id === productId);
    if (!item) return;
    
    item.quantity += change;
    
    if (item.quantity <= 0) {
        removeFromCart(productId);
    } else {
        updateCartCount();
        renderCartItems();
    }
}

// 장바구니에서 제품 제거
function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    updateCartCount();
    renderCartItems();
    showNotification('제품이 장바구니에서 제거되었습니다.');
}

// 장바구니 개수 업데이트
function updateCartCount() {
    const cartCount = document.querySelector('.cart-count');
    if (!cartCount) return;
    
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.textContent = totalItems;
    cartCount.style.display = totalItems > 0 ? 'flex' : 'none';
}

// 알림 표시
function showNotification(message) {
    // 기존 알림 제거
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: #4CAF50;
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 10px;
        box-shadow: 0 5px 15px rgba(0,0,0,0.2);
        z-index: 3000;
        animation: slideIn 0.3s ease-out;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease-in';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 300);
    }, 3000);
}

// 문의 폼 처리
function handleContactForm(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const data = {
        name: formData.get('name') || e.target.querySelector('input[type="text"]').value,
        email: formData.get('email') || e.target.querySelector('input[type="email"]').value,
        phone: formData.get('phone') || e.target.querySelector('input[type="tel"]').value,
        message: formData.get('message') || e.target.querySelector('textarea').value
    };
    
    // 간단한 유효성 검사
    if (!data.name || !data.email || !data.message) {
        showNotification('필수 항목을 모두 입력해주세요.');
        return;
    }
    
    // 실제로는 서버로 데이터를 전송
    console.log('문의 데이터:', data);
    showNotification('문의가 성공적으로 전송되었습니다. 빠른 시일 내에 연락드리겠습니다.');
    e.target.reset();
}

// 스크롤 애니메이션 설정
function setupScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');
            }
        });
    }, observerOptions);
    
    // 애니메이션할 요소들 관찰
    const animateElements = document.querySelectorAll('.scroll-animate');
    animateElements.forEach(el => {
        observer.observe(el);
    });
}

// 검색 기능 (향후 확장용)
function searchProducts(query) {
    const filteredProducts = products.filter(product => 
        product.name.toLowerCase().includes(query.toLowerCase()) ||
        product.description.toLowerCase().includes(query.toLowerCase())
    );
    
    renderProducts(filteredProducts);
}

// 가격 정렬
function sortProducts(sortBy) {
    let sortedProducts = [...products];
    
    switch(sortBy) {
        case 'price-low':
            sortedProducts.sort((a, b) => a.price - b.price);
            break;
        case 'price-high':
            sortedProducts.sort((a, b) => b.price - a.price);
            break;
        case 'rating':
            sortedProducts.sort((a, b) => b.rating - a.rating);
            break;
        case 'name':
            sortedProducts.sort((a, b) => a.name.localeCompare(b.name));
            break;
    }
    
    renderProducts(sortedProducts);
}

// CSS 애니메이션 추가
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
    
    .product-rating {
        margin: 1rem 0;
    }
    
    .stars {
        color: #ffc107;
        margin-bottom: 0.5rem;
    }
    
    .rating-text {
        font-size: 0.9rem;
        color: #666;
    }
`;
document.head.appendChild(style);
