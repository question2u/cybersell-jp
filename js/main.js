// ===== 主要JavaScript功能 =====

// 等待DOM加载完成
document.addEventListener('DOMContentLoaded', function() {
    // 初始化所有功能
    initLanguageSwitcher();
    initMobileMenu();
    initScrollEffects();
    initTestimonialCarousel();
    initModal();
    initFormHandlers();
    initAnimationEffects();
    initSmoothScrolling();
    initLazyLoading();
});

// ===== 语言切换功能 =====
function initLanguageSwitcher() {
    const langButtons = document.querySelectorAll('.lang-btn');
    const html = document.documentElement;

    // 从localStorage获取保存的语言设置
    const savedLang = localStorage.getItem('preferredLanguage') || 'ja';
    setLanguage(savedLang);

    langButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            const lang = this.getAttribute('data-lang');
            setLanguage(lang);

            // 保存到localStorage
            localStorage.setItem('preferredLanguage', lang);
        });
    });
}

function setLanguage(lang) {
    const html = document.documentElement;
    const langButtons = document.querySelectorAll('.lang-btn');

    // 设置HTML lang属性
    html.setAttribute('lang', lang);
    html.setAttribute('data-lang', lang);

    // 更新按钮状态
    langButtons.forEach(btn => {
        if (btn.getAttribute('data-lang') === lang) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });

    // 切换文本显示
    toggleLanguageText(lang);
}

function toggleLanguageText(lang) {
    // 日语文本切换
    const jaElements = document.querySelectorAll('[class*="-ja"]');
    const zhElements = document.querySelectorAll('[class*="-zh"]');
    const enElements = document.querySelectorAll('[class*="-en"]');

    jaElements.forEach(el => {
        if (el.classList.contains('title-ja') ||
            el.classList.contains('subtitle-ja') ||
            el.classList.contains('desc-ja')) {
            el.style.display = lang === 'ja' ? 'block' : 'none';
        }
    });

    zhElements.forEach(el => {
        if (el.classList.contains('title-zh') ||
            el.classList.contains('subtitle-zh') ||
            el.classList.contains('desc-zh')) {
            el.style.display = lang === 'zh' ? 'block' : 'none';
        }
    });

    enElements.forEach(el => {
        if (el.classList.contains('title-en') ||
            el.classList.contains('subtitle-en') ||
            el.classList.contains('desc-en')) {
            el.style.display = lang === 'en' ? 'block' : 'none';
        }
    });

    // 处理带有data属性的链接
    const linksWithLang = document.querySelectorAll('a[data-ja][data-zh][data-en]');
    linksWithLang.forEach(link => {
        const text = link.getAttribute(`data-${lang}`);
        if (text) {
            link.textContent = text;
        }
    });
}

// ===== 移动端菜单 =====
function initMobileMenu() {
    const hamburgerBtn = document.getElementById('hamburgerMenu');
    const mobileMenu = document.getElementById('mobileMenu');
    const mobileLinks = mobileMenu.querySelectorAll('a');

    if (!hamburgerBtn || !mobileMenu) return;

    // 汉堡菜单切换
    hamburgerBtn.addEventListener('click', function() {
        mobileMenu.classList.toggle('active');
        this.classList.toggle('active');

        // 防止背景滚动
        document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
    });

    // 点击链接关闭菜单
    mobileLinks.forEach(link => {
        link.addEventListener('click', function() {
            mobileMenu.classList.remove('active');
            hamburgerBtn.classList.remove('active');
            document.body.style.overflow = '';
        });
    });

    // 点击外部关闭菜单
    document.addEventListener('click', function(e) {
        if (!hamburgerBtn.contains(e.target) && !mobileMenu.contains(e.target)) {
            mobileMenu.classList.remove('active');
            hamburgerBtn.classList.remove('active');
            document.body.style.overflow = '';
        }
    });
}

// ===== 滚动效果 =====
function initScrollEffects() {
    const navbar = document.querySelector('.navbar');
    let lastScrollTop = 0;

    // 导航栏滚动隐藏/显示
    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

        if (navbar) {
            if (scrollTop > lastScrollTop && scrollTop > 100) {
                // 向下滚动 - 隐藏导航栏
                navbar.style.transform = 'translateY(-100%)';
            } else {
                // 向上滚动 - 显示导航栏
                navbar.style.transform = 'translateY(0)';
            }

            // 添加背景透明度
            if (scrollTop > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        }

        lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
    });

    // 滚动指示器点击
    const scrollIndicator = document.querySelector('.scroll-indicator');
    if (scrollIndicator) {
        scrollIndicator.addEventListener('click', function() {
            const nextSection = document.querySelector('.advantages');
            if (nextSection) {
                nextSection.scrollIntoView({ behavior: 'smooth' });
            }
        });
    }
}

// ===== 客户案例轮播 =====
function initTestimonialCarousel() {
    const slides = document.querySelectorAll('.testimonial-slide');
    const indicators = document.querySelectorAll('.indicator');
    const prevBtn = document.getElementById('prevTestimonial');
    const nextBtn = document.getElementById('nextTestimonial');
    let currentSlide = 0;
    let autoplayInterval;

    if (slides.length === 0) return;

    function showSlide(index) {
        // 隐藏所有幻灯片
        slides.forEach(slide => slide.classList.remove('active'));
        indicators.forEach(indicator => indicator.classList.remove('active'));

        // 显示当前幻灯片
        if (slides[index]) {
            slides[index].classList.add('active');
        }
        if (indicators[index]) {
            indicators[index].classList.add('active');
        }

        currentSlide = index;
    }

    function nextSlide() {
        const newIndex = (currentSlide + 1) % slides.length;
        showSlide(newIndex);
    }

    function prevSlide() {
        const newIndex = (currentSlide - 1 + slides.length) % slides.length;
        showSlide(newIndex);
    }

    function startAutoplay() {
        stopAutoplay();
        autoplayInterval = setInterval(nextSlide, 5000);
    }

    function stopAutoplay() {
        if (autoplayInterval) {
            clearInterval(autoplayInterval);
        }
    }

    // 上一张/下一张按钮
    if (prevBtn) {
        prevBtn.addEventListener('click', function() {
            prevSlide();
            startAutoplay();
        });
    }

    if (nextBtn) {
        nextBtn.addEventListener('click', function() {
            nextSlide();
            startAutoplay();
        });
    }

    // 指示器点击
    indicators.forEach((indicator, index) => {
        indicator.addEventListener('click', function() {
            showSlide(index);
            startAutoplay();
        });
    });

    // 鼠标悬停暂停自动播放
    const carousel = document.querySelector('.testimonials-carousel');
    if (carousel) {
        carousel.addEventListener('mouseenter', stopAutoplay);
        carousel.addEventListener('mouseleave', startAutoplay);
    }

    // 触摸事件支持
    let touchStartX = 0;
    let touchEndX = 0;

    if (carousel) {
        carousel.addEventListener('touchstart', function(e) {
            touchStartX = e.changedTouches[0].screenX;
        });

        carousel.addEventListener('touchend', function(e) {
            touchEndX = e.changedTouches[0].screenX;
            handleSwipe();
        });
    }

    function handleSwipe() {
        const swipeThreshold = 50;
        const diff = touchStartX - touchEndX;

        if (Math.abs(diff) > swipeThreshold) {
            if (diff > 0) {
                nextSlide(); // 向左滑动
            } else {
                prevSlide(); // 向右滑动
            }
            startAutoplay();
        }
    }

    // 开始自动播放
    startAutoplay();
}

// ===== 模态窗口 =====
function initModal() {
    const modal = document.getElementById('contactModal');
    const openModalBtns = document.querySelectorAll('[href="#contact"]');
    const closeBtn = document.getElementById('closeModal');

    if (!modal || !closeBtn) return;

    // 打开模态窗口
    openModalBtns.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            openModal();
        });
    });

    // 关闭模态窗口
    closeBtn.addEventListener('click', closeModal);

    // 点击背景关闭
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            closeModal();
        }
    });

    // ESC键关闭
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            closeModal();
        }
    });
}

function openModal() {
    const modal = document.getElementById('contactModal');
    if (modal) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';

        // 聚焦到第一个输入框
        const firstInput = modal.querySelector('input');
        if (firstInput) {
            setTimeout(() => firstInput.focus(), 100);
        }
    }
}

function closeModal() {
    const modal = document.getElementById('contactModal');
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }
}

// ===== 表单处理 =====
function initFormHandlers() {
    // 联系表单
    const contactForm = document.querySelector('.contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', handleContactForm);
    }

    // 工具表单
    const toolForms = document.querySelectorAll('.tool-form');
    toolForms.forEach(form => {
        form.addEventListener('submit', handleToolForm);
    });

    // 表单验证
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
        form.addEventListener('input', handleFormInput);
        form.addEventListener('change', handleFormChange);
    });
}

function handleContactForm(e) {
    e.preventDefault();

    const form = e.target;
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;

    // 显示加载状态
    submitBtn.innerHTML = '<span class="loading-spinner"></span>送信中...';
    submitBtn.disabled = true;
    form.classList.add('loading');

    // 获取表单数据
    const formData = new FormData(form);
    const data = {};
    formData.forEach((value, key) => {
        data[key] = value;
    });

    // 模拟发送请求
    setTimeout(() => {
        // 显示成功消息
        showMessage('お問い合わせありがとうございます。折り返しご連絡いたします。', 'success');

        // 重置表单
        form.reset();

        // 关闭模态窗口
        closeModal();

        // 恢复按钮状态
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
        form.classList.remove('loading');
    }, 2000);
}

function handleToolForm(e) {
    e.preventDefault();

    const form = e.target;
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;

    // 显示计算状态
    submitBtn.innerHTML = '<span class="loading-spinner"></span>計算中...';
    submitBtn.disabled = true;

    // 模拟计算过程
    setTimeout(() => {
        // 显示结果
        const toolTitle = form.closest('.tool-card').querySelector('.tool-title').textContent;
        showToolResult(toolTitle);

        // 恢复按钮状态
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
    }, 1500);
}

function handleFormInput(e) {
    const input = e.target;

    // 实时验证
    if (input.hasAttribute('required') && input.value.trim()) {
        input.classList.remove('error');
        input.classList.add('valid');
    } else if (input.hasAttribute('required') && !input.value.trim()) {
        input.classList.remove('valid');
        input.classList.add('error');
    }
}

function handleFormChange(e) {
    handleFormInput(e);
}

function showToolResult(toolName) {
    let message = '';

    switch(toolName) {
        case 'AI購房资格评估器':
        case 'AI购房资格评估器':
            message = '評価結果：ご条件に合った物件が多数見つかりました。詳しくはお問い合わせください。';
            break;
        case 'ROI投資計算機':
        case 'ROI投资计算器':
            message = '計算結果：想定利回り5.2%、年間収益見込み120万円です。詳細レポートをお送りします。';
            break;
        case 'ローン可能額計算機':
        case '贷款额度计算器':
            message = '審査結果：最大借入可能額2,800万円です。詳細な条件をご案内いたします。';
            break;
        case '通勤時間検索':
        case '通勤时间搜索':
            message = '検索結果：条件に合う物件が156件見つかりました。詳細はこちらからご確認ください。';
            break;
        default:
            message = '計算が完了しました。結果については、お問い合わせフォームよりご連絡ください。';
    }

    showMessage(message, 'info');
}

function showMessage(message, type = 'info') {
    // 创建消息元素
    const messageEl = document.createElement('div');
    messageEl.className = `message message-${type}`;
    messageEl.innerHTML = `
        <div class="message-content">
            <span class="message-text">${message}</span>
            <button class="message-close" onclick="this.parentElement.parentElement.remove()">×</button>
        </div>
    `;

    // 添加到页面
    document.body.appendChild(messageEl);

    // 显示动画
    setTimeout(() => messageEl.classList.add('show'), 100);

    // 自动移除
    setTimeout(() => {
        messageEl.classList.remove('show');
        setTimeout(() => {
            if (messageEl.parentNode) {
                messageEl.parentNode.removeChild(messageEl);
            }
        }, 300);
    }, 5000);
}

// ===== 动画效果 =====
function initAnimationEffects() {
    // 初始化AOS库
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 800,
            once: true,
            offset: 100,
            disable: 'mobile'
        });
    }

    // 数字动画
    initCounterAnimation();

    // 进度条动画
    initProgressBar();
}

function initCounterAnimation() {
    const counters = document.querySelectorAll('[data-target]');
    const speed = 200;

    counters.forEach(counter => {
        const animate = () => {
            const target = parseInt(counter.getAttribute('data-target'));
            const count = parseInt(counter.innerText);
            const increment = target / speed;

            if (count < target) {
                counter.innerText = Math.ceil(count + increment);
                setTimeout(animate, 10);
            } else {
                counter.innerText = target.toLocaleString();
            }
        };

        // 使用Intersection Observer
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animate();
                    observer.unobserve(entry.target);
                }
            });
        });

        observer.observe(counter);
    });
}

function initProgressBar() {
    const progressBars = document.querySelectorAll('.progress-bar');

    progressBars.forEach(bar => {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const width = bar.getAttribute('data-width');
                    bar.style.width = width + '%';
                    observer.unobserve(entry.target);
                }
            });
        });

        observer.observe(bar);
    });
}

// ===== 平滑滚动 =====
function initSmoothScrolling() {
    const links = document.querySelectorAll('a[href^="#"]');

    links.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');

            if (href === '#') return;

            e.preventDefault();

            const target = document.querySelector(href);
            if (target) {
                const offset = 80; // 导航栏高度
                const targetPosition = target.offsetTop - offset;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });

                // 更新URL
                history.pushState(null, null, href);
            }
        });
    });
}

// ===== 懒加载 =====
function initLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');

    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.getAttribute('data-src');
                    img.removeAttribute('data-src');
                    img.classList.add('loaded');
                    imageObserver.unobserve(img);
                }
            });
        });

        images.forEach(img => imageObserver.observe(img));
    } else {
        // 回退方案
        images.forEach(img => {
            img.src = img.getAttribute('data-src');
            img.removeAttribute('data-src');
        });
    }
}

// ===== 工具函数 =====

// 防抖函数
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// 节流函数
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// 获取元素在视口中的位置
function getElementPosition(element) {
    const rect = element.getBoundingClientRect();
    return {
        top: rect.top + window.pageYOffset,
        bottom: rect.bottom + window.pageYOffset,
        left: rect.left + window.pageXOffset,
        right: rect.right + window.pageXOffset
    };
}

// 检查元素是否在视口中
function isElementInViewport(element, threshold = 0) {
    const rect = element.getBoundingClientRect();
    const windowHeight = window.innerHeight || document.documentElement.clientHeight;
    const windowWidth = window.innerWidth || document.documentElement.clientWidth;

    const verticalThreshold = windowHeight * threshold;
    const horizontalThreshold = windowWidth * threshold;

    return (
        rect.top >= -verticalThreshold &&
        rect.left >= -horizontalThreshold &&
        rect.bottom <= windowHeight + verticalThreshold &&
        rect.right <= windowWidth + horizontalThreshold
    );
}

// 复制到剪贴板
function copyToClipboard(text) {
    if (navigator.clipboard) {
        return navigator.clipboard.writeText(text).then(() => {
            showMessage('クリップボードにコピーしました。', 'success');
        });
    } else {
        // 回退方案
        const textArea = document.createElement('textarea');
        textArea.value = text;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        showMessage('クリップボードにコピーしました。', 'success');
    }
}

// 格式化数字
function formatNumber(num) {
    return new Intl.NumberFormat('ja-JP').format(num);
}

// 格式化货币
function formatCurrency(amount, currency = 'JPY') {
    return new Intl.NumberFormat('ja-JP', {
        style: 'currency',
        currency: currency
    }).format(amount);
}

// 验证邮箱
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

// 验证电话号码
function validatePhone(phone) {
    const re = /^[\d\s\-\+\(\)]+$/;
    return re.test(phone) && phone.replace(/\D/g, '').length >= 10;
}

// 生成随机ID
function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

// 获取当前语言
function getCurrentLanguage() {
    return document.documentElement.getAttribute('lang') || 'ja';
}

// 设置Cookie
function setCookie(name, value, days) {
    const expires = new Date();
    expires.setTime(expires.getTime() + (days * 24 * 60 * 60 * 1000));
    document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/`;
}

// 获取Cookie
function getCookie(name) {
    const nameEQ = name + "=";
    const ca = document.cookie.split(';');
    for(let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) === ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
}

// 删除Cookie
function deleteCookie(name) {
    document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:01 GMT;path=/`;
}

// 错误处理
window.addEventListener('error', function(e) {
    console.error('JavaScript Error:', e.error);
    // 可以在这里添加错误报告逻辑
});

// 性能监控
window.addEventListener('load', function() {
    if ('performance' in window) {
        const perfData = performance.getEntriesByType('navigation')[0];
        console.log('Page Load Time:', perfData.loadEventEnd - perfData.fetchStart, 'ms');
    }
});

// Service Worker注册（如果需要PWA功能）
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        navigator.serviceWorker.register('/sw.js')
            .then(function(registration) {
                console.log('ServiceWorker registration successful');
            })
            .catch(function(err) {
                console.log('ServiceWorker registration failed');
            });
    });
}