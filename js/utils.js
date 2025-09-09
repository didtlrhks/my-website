// 유틸리티 함수들

// 로컬 스토리지 관리
const Storage = {
    // 데이터 저장
    set(key, data) {
        try {
            localStorage.setItem(key, JSON.stringify(data));
            return true;
        } catch (error) {
            console.error('Storage set error:', error);
            return false;
        }
    },
    
    // 데이터 가져오기
    get(key, defaultValue = null) {
        try {
            const data = localStorage.getItem(key);
            return data ? JSON.parse(data) : defaultValue;
        } catch (error) {
            console.error('Storage get error:', error);
            return defaultValue;
        }
    },
    
    // 데이터 삭제
    remove(key) {
        try {
            localStorage.removeItem(key);
            return true;
        } catch (error) {
            console.error('Storage remove error:', error);
            return false;
        }
    },
    
    // 모든 데이터 삭제
    clear() {
        try {
            localStorage.clear();
            return true;
        } catch (error) {
            console.error('Storage clear error:', error);
            return false;
        }
    }
};

// 장바구니 관리
const CartManager = {
    CART_KEY: 'healthcare_cart',
    
    // 장바구니 저장
    save(cart) {
        return Storage.set(this.CART_KEY, cart);
    },
    
    // 장바구니 불러오기
    load() {
        return Storage.get(this.CART_KEY, []);
    },
    
    // 장바구니 초기화
    clear() {
        return Storage.remove(this.CART_KEY);
    }
};

// 사용자 설정 관리
const UserSettings = {
    SETTINGS_KEY: 'healthcare_settings',
    
    // 기본 설정
    defaultSettings: {
        theme: 'light',
        language: 'ko',
        currency: 'KRW',
        notifications: true,
        autoSave: true
    },
    
    // 설정 저장
    save(settings) {
        const currentSettings = this.load();
        const newSettings = { ...currentSettings, ...settings };
        return Storage.set(this.SETTINGS_KEY, newSettings);
    },
    
    // 설정 불러오기
    load() {
        return Storage.get(this.SETTINGS_KEY, this.defaultSettings);
    },
    
    // 특정 설정 가져오기
    get(key) {
        const settings = this.load();
        return settings[key];
    },
    
    // 특정 설정 저장
    set(key, value) {
        const settings = this.load();
        settings[key] = value;
        return this.save(settings);
    }
};

// 날짜/시간 유틸리티
const DateUtils = {
    // 현재 날짜를 YYYY-MM-DD 형식으로 반환
    getCurrentDate() {
        const now = new Date();
        return now.toISOString().split('T')[0];
    },
    
    // 현재 시간을 HH:MM:SS 형식으로 반환
    getCurrentTime() {
        const now = new Date();
        return now.toTimeString().split(' ')[0];
    },
    
    // 날짜를 한국어 형식으로 포맷
    formatKorean(date) {
        const options = { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric',
            weekday: 'long'
        };
        return new Date(date).toLocaleDateString('ko-KR', options);
    },
    
    // 상대적 시간 표시 (예: 3일 전)
    getRelativeTime(date) {
        const now = new Date();
        const targetDate = new Date(date);
        const diffInMs = now - targetDate;
        const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
        
        if (diffInDays === 0) return '오늘';
        if (diffInDays === 1) return '어제';
        if (diffInDays < 7) return `${diffInDays}일 전`;
        if (diffInDays < 30) return `${Math.floor(diffInDays / 7)}주 전`;
        if (diffInDays < 365) return `${Math.floor(diffInDays / 30)}개월 전`;
        return `${Math.floor(diffInDays / 365)}년 전`;
    }
};

// 숫자/통화 유틸리티
const NumberUtils = {
    // 숫자를 한국 원화 형식으로 포맷
    formatCurrency(amount, currency = 'KRW') {
        return new Intl.NumberFormat('ko-KR', {
            style: 'currency',
            currency: currency
        }).format(amount);
    },
    
    // 숫자를 천 단위 구분자와 함께 포맷
    formatNumber(number) {
        return new Intl.NumberFormat('ko-KR').format(number);
    },
    
    // 퍼센트 포맷
    formatPercent(value, decimals = 1) {
        return `${(value * 100).toFixed(decimals)}%`;
    },
    
    // 숫자를 K, M 단위로 축약
    formatCompact(number) {
        if (number >= 1000000) {
            return `${(number / 1000000).toFixed(1)}M`;
        }
        if (number >= 1000) {
            return `${(number / 1000).toFixed(1)}K`;
        }
        return number.toString();
    }
};

// 문자열 유틸리티
const StringUtils = {
    // 문자열을 지정된 길이로 자르고 말줄임표 추가
    truncate(str, length = 100) {
        if (str.length <= length) return str;
        return str.substring(0, length) + '...';
    },
    
    // 첫 글자를 대문자로 변환
    capitalize(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    },
    
    // 카멜케이스를 케밥케이스로 변환
    camelToKebab(str) {
        return str.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();
    },
    
    // 케밥케이스를 카멜케이스로 변환
    kebabToCamel(str) {
        return str.replace(/-([a-z])/g, (match, letter) => letter.toUpperCase());
    },
    
    // 문자열에서 HTML 태그 제거
    stripHtml(html) {
        const tmp = document.createElement('div');
        tmp.innerHTML = html;
        return tmp.textContent || tmp.innerText || '';
    }
};

// DOM 유틸리티
const DOMUtils = {
    // 요소가 뷰포트에 있는지 확인
    isInViewport(element) {
        const rect = element.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    },
    
    // 요소에 클래스가 있는지 확인
    hasClass(element, className) {
        return element.classList.contains(className);
    },
    
    // 클래스 토글
    toggleClass(element, className) {
        element.classList.toggle(className);
    },
    
    // 요소의 부모 요소 찾기
    findParent(element, selector) {
        let parent = element.parentElement;
        while (parent) {
            if (parent.matches(selector)) {
                return parent;
            }
            parent = parent.parentElement;
        }
        return null;
    },
    
    // 요소에 이벤트 리스너 추가 (이벤트 위임)
    delegate(parent, selector, event, handler) {
        parent.addEventListener(event, function(e) {
            if (e.target.matches(selector)) {
                handler.call(e.target, e);
            }
        });
    }
};

// 애니메이션 유틸리티
const AnimationUtils = {
    // 페이드 인 애니메이션
    fadeIn(element, duration = 300) {
        element.style.opacity = '0';
        element.style.display = 'block';
        
        const start = performance.now();
        
        function animate(time) {
            const elapsed = time - start;
            const progress = Math.min(elapsed / duration, 1);
            
            element.style.opacity = progress;
            
            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        }
        
        requestAnimationFrame(animate);
    },
    
    // 페이드 아웃 애니메이션
    fadeOut(element, duration = 300) {
        const start = performance.now();
        const startOpacity = parseFloat(getComputedStyle(element).opacity);
        
        function animate(time) {
            const elapsed = time - start;
            const progress = Math.min(elapsed / duration, 1);
            
            element.style.opacity = startOpacity * (1 - progress);
            
            if (progress < 1) {
                requestAnimationFrame(animate);
            } else {
                element.style.display = 'none';
            }
        }
        
        requestAnimationFrame(animate);
    },
    
    // 슬라이드 다운 애니메이션
    slideDown(element, duration = 300) {
        element.style.height = '0';
        element.style.overflow = 'hidden';
        element.style.display = 'block';
        
        const targetHeight = element.scrollHeight;
        const start = performance.now();
        
        function animate(time) {
            const elapsed = time - start;
            const progress = Math.min(elapsed / duration, 1);
            
            element.style.height = (targetHeight * progress) + 'px';
            
            if (progress < 1) {
                requestAnimationFrame(animate);
            } else {
                element.style.height = 'auto';
                element.style.overflow = 'visible';
            }
        }
        
        requestAnimationFrame(animate);
    },
    
    // 슬라이드 업 애니메이션
    slideUp(element, duration = 300) {
        const startHeight = element.offsetHeight;
        const start = performance.now();
        
        element.style.overflow = 'hidden';
        
        function animate(time) {
            const elapsed = time - start;
            const progress = Math.min(elapsed / duration, 1);
            
            element.style.height = (startHeight * (1 - progress)) + 'px';
            
            if (progress < 1) {
                requestAnimationFrame(animate);
            } else {
                element.style.display = 'none';
                element.style.height = 'auto';
                element.style.overflow = 'visible';
            }
        }
        
        requestAnimationFrame(animate);
    }
};

// 검증 유틸리티
const ValidationUtils = {
    // 이메일 유효성 검사
    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    },
    
    // 전화번호 유효성 검사
    isValidPhone(phone) {
        const phoneRegex = /^[0-9-+\s()]+$/;
        return phoneRegex.test(phone) && phone.replace(/\D/g, '').length >= 10;
    },
    
    // 비밀번호 강도 검사
    getPasswordStrength(password) {
        let score = 0;
        
        if (password.length >= 8) score++;
        if (/[a-z]/.test(password)) score++;
        if (/[A-Z]/.test(password)) score++;
        if (/[0-9]/.test(password)) score++;
        if (/[^A-Za-z0-9]/.test(password)) score++;
        
        const levels = ['매우 약함', '약함', '보통', '강함', '매우 강함'];
        return {
            score: score,
            level: levels[score] || '매우 약함'
        };
    },
    
    // 한국 주민등록번호 유효성 검사
    isValidKoreanSSN(ssn) {
        const ssnRegex = /^\d{6}-\d{7}$/;
        if (!ssnRegex.test(ssn)) return false;
        
        const numbers = ssn.replace(/-/g, '');
        const multipliers = [2, 3, 4, 5, 6, 7, 8, 9, 2, 3, 4, 5];
        
        let sum = 0;
        for (let i = 0; i < 12; i++) {
            sum += parseInt(numbers[i]) * multipliers[i];
        }
        
        const remainder = sum % 11;
        const checkDigit = (11 - remainder) % 10;
        
        return checkDigit === parseInt(numbers[12]);
    }
};

// API 유틸리티
const ApiUtils = {
    // GET 요청
    async get(url, options = {}) {
        try {
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    ...options.headers
                },
                ...options
            });
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            return await response.json();
        } catch (error) {
            console.error('GET request failed:', error);
            throw error;
        }
    },
    
    // POST 요청
    async post(url, data, options = {}) {
        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    ...options.headers
                },
                body: JSON.stringify(data),
                ...options
            });
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            return await response.json();
        } catch (error) {
            console.error('POST request failed:', error);
            throw error;
        }
    },
    
    // PUT 요청
    async put(url, data, options = {}) {
        try {
            const response = await fetch(url, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    ...options.headers
                },
                body: JSON.stringify(data),
                ...options
            });
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            return await response.json();
        } catch (error) {
            console.error('PUT request failed:', error);
            throw error;
        }
    },
    
    // DELETE 요청
    async delete(url, options = {}) {
        try {
            const response = await fetch(url, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    ...options.headers
                },
                ...options
            });
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            return await response.json();
        } catch (error) {
            console.error('DELETE request failed:', error);
            throw error;
        }
    }
};

// 디바운스 함수
function debounce(func, wait, immediate = false) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            timeout = null;
            if (!immediate) func(...args);
        };
        const callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func(...args);
    };
}

// 스로틀 함수
function throttle(func, limit) {
    let inThrottle;
    return function(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// 랜덤 ID 생성
function generateId(prefix = 'id') {
    return `${prefix}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

// 딥 클론
function deepClone(obj) {
    if (obj === null || typeof obj !== 'object') return obj;
    if (obj instanceof Date) return new Date(obj.getTime());
    if (obj instanceof Array) return obj.map(item => deepClone(item));
    if (typeof obj === 'object') {
        const clonedObj = {};
        for (const key in obj) {
            if (obj.hasOwnProperty(key)) {
                clonedObj[key] = deepClone(obj[key]);
            }
        }
        return clonedObj;
    }
}

// 객체 병합
function mergeObjects(target, ...sources) {
    if (!sources.length) return target;
    const source = sources.shift();
    
    if (isObject(target) && isObject(source)) {
        for (const key in source) {
            if (isObject(source[key])) {
                if (!target[key]) Object.assign(target, { [key]: {} });
                mergeObjects(target[key], source[key]);
            } else {
                Object.assign(target, { [key]: source[key] });
            }
        }
    }
    
    return mergeObjects(target, ...sources);
}

function isObject(item) {
    return item && typeof item === 'object' && !Array.isArray(item);
}

// 전역으로 유틸리티 함수들 노출
window.Storage = Storage;
window.CartManager = CartManager;
window.UserSettings = UserSettings;
window.DateUtils = DateUtils;
window.NumberUtils = NumberUtils;
window.StringUtils = StringUtils;
window.DOMUtils = DOMUtils;
window.AnimationUtils = AnimationUtils;
window.ValidationUtils = ValidationUtils;
window.ApiUtils = ApiUtils;
window.debounce = debounce;
window.throttle = throttle;
window.generateId = generateId;
window.deepClone = deepClone;
window.mergeObjects = mergeObjects;
