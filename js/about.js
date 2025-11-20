// ===== 关于我们页面专用JavaScript =====

document.addEventListener('DOMContentLoaded', function() {
    // 初始化所有功能
    initTestimonialCarousel();
    initContactForm();
    initScrollAnimations();
    initTeamMemberHover();
    initPartnerHover();
    initStatsAnimation();
});

// ===== 客户评价轮播 =====
function initTestimonialCarousel() {
    const testimonials = document.querySelectorAll('.testimonial-item');
    const dots = document.querySelectorAll('.dot');
    const prevBtn = document.getElementById('prevTestimonial');
    const nextBtn = document.getElementById('nextTestimonial');

    if (testimonials.length === 0) return;

    let currentIndex = 0;
    let autoplayInterval;

    // 显示指定索引的评价
    function showTestimonial(index) {
        // 隐藏所有评价
        testimonials.forEach(testimonial => {
            testimonial.classList.remove('active');
        });

        // 移除所有点活动状态
        dots.forEach(dot => {
            dot.classList.remove('active');
        });

        // 显示当前评价
        testimonials[index].classList.add('active');
        dots[index].classList.add('active');

        currentIndex = index;
    }

    // 下一个评价
    function nextTestimonial() {
        const nextIndex = (currentIndex + 1) % testimonials.length;
        showTestimonial(nextIndex);
    }

    // 上一个评价
    function prevTestimonial() {
        const prevIndex = (currentIndex - 1 + testimonials.length) % testimonials.length;
        showTestimonial(prevIndex);
    }

    // 开始自动播放
    function startAutoplay() {
        stopAutoplay();
        autoplayInterval = setInterval(nextTestimonial, 5000);
    }

    // 停止自动播放
    function stopAutoplay() {
        if (autoplayInterval) {
            clearInterval(autoplayInterval);
        }
    }

    // 事件绑定
    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            prevTestimonial();
            startAutoplay();
        });
    }

    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            nextTestimonial();
            startAutoplay();
        });
    }

    // 点点击事件
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            showTestimonial(index);
            startAutoplay();
        });
    });

    // 鼠标悬停时停止自动播放
    const carousel = document.querySelector('.testimonials-carousel');
    if (carousel) {
        carousel.addEventListener('mouseenter', stopAutoplay);
        carousel.addEventListener('mouseleave', startAutoplay);
    }

    // 开始自动播放
    startAutoplay();

    // 键盘导航
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') {
            prevTestimonial();
            startAutoplay();
        } else if (e.key === 'ArrowRight') {
            nextTestimonial();
            startAutoplay();
        }
    });
}

// ===== 联系表单 =====
function initContactForm() {
    const form = document.getElementById('contactForm');

    if (!form) return;

    form.addEventListener('submit', function(e) {
        e.preventDefault();
        submitContactForm(form);
    });

    // 表单验证
    const inputs = form.querySelectorAll('input[required], textarea[required]');
    inputs.forEach(input => {
        input.addEventListener('blur', () => {
            validateField(input);
        });

        input.addEventListener('input', () => {
            if (input.classList.contains('error')) {
                validateField(input);
            }
        });
    });
}

function validateField(field) {
    const value = field.value.trim();
    let isValid = true;
    let errorMessage = '';

    // 移除之前的错误状态
    field.classList.remove('error');
    const existingError = field.parentNode.querySelector('.error-message');
    if (existingError) {
        existingError.remove();
    }

    // 验证规则
    if (field.hasAttribute('required') && !value) {
        isValid = false;
        errorMessage = '此字段为必填项';
    } else if (field.type === 'email' && value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
            isValid = false;
            errorMessage = '请输入有效的邮箱地址';
        }
    } else if (field.type === 'tel' && value) {
        const phoneRegex = /^[0-9\-\+\(\)\s]+$/;
        if (!phoneRegex.test(value)) {
            isValid = false;
            errorMessage = '请输入有效的电话号码';
        }
    }

    // 显示错误信息
    if (!isValid) {
        field.classList.add('error');
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.textContent = errorMessage;
        field.parentNode.appendChild(errorDiv);
    }

    return isValid;
}

function submitContactForm(form) {
    // 验证所有必填字段
    const requiredFields = form.querySelectorAll('input[required], textarea[required]');
    let isValid = true;

    requiredFields.forEach(field => {
        if (!validateField(field)) {
            isValid = false;
        }
    });

    if (!isValid) {
        showNotification('请填写所有必填字段', 'error');
        return;
    }

    // 收集表单数据
    const formData = new FormData(form);
    const data = Object.fromEntries(formData);

    // 显示加载状态
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<span class="loading-spinner"></span> 发送中...';

    // 模拟API调用
    setTimeout(() => {
        // 这里应该调用实际的API
        console.log('Contact form submitted:', data);

        // 显示成功消息
        showNotification('留言发送成功！我们会尽快与您联系。', 'success');

        // 重置表单
        form.reset();

        // 恢复按钮状态
        submitBtn.disabled = false;
        submitBtn.textContent = originalText;

        // 跟踪转化事件
        if (typeof gtag !== 'undefined') {
            gtag('event', 'contact_form_submit', {
                'event_category': 'lead',
                'event_label': 'about_page'
            });
        }
    }, 2000);
}

// ===== 滚动动画 =====
function initScrollAnimations() {
    const animatedElements = document.querySelectorAll(
        '.company-stats .stat-item, ' +
        '.value-card, ' +
        '.advantage-item, ' +
        '.team-member, ' +
        '.certification-item, ' +
        '.partner-item, ' +
        '.contact-item'
    );

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    animatedElements.forEach((element, index) => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(30px)';
        element.style.transition = `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`;
        observer.observe(element);
    });
}

// ===== 团队成员悬停效果 =====
function initTeamMemberHover() {
    const teamMembers = document.querySelectorAll('.team-member');

    teamMembers.forEach(member => {
        member.addEventListener('mouseenter', function() {
            // 添加悬停效果
            this.style.transform = 'translateY(-12px) scale(1.02)';

            // 图片缩放效果已在CSS中处理
        });

        member.addEventListener('mouseleave', function() {
            // 移除悬停效果
            this.style.transform = '';
        });

        // 点击效果
        member.addEventListener('click', function() {
            // 添加脉冲动画
            this.style.animation = 'pulse 0.6s ease';
            setTimeout(() => {
                this.style.animation = '';
            }, 600);
        });
    });
}

// ===== 合作伙伴悬停效果 =====
function initPartnerHover() {
    const partnerItems = document.querySelectorAll('.partner-item');

    partnerItems.forEach(item => {
        item.addEventListener('mouseenter', function() {
            // 添加悬停效果
            this.style.transform = 'translateY(-8px) scale(1.05)';
        });

        item.addEventListener('mouseleave', function() {
            // 移除悬停效果
            this.style.transform = '';
        });
    });
}

// ===== 统计数字动画 =====
function animateNumbers() {
    const statNumbers = document.querySelectorAll('.stat-number');

    statNumbers.forEach(stat => {
        const finalText = stat.textContent;
        const finalNumber = parseInt(finalText.replace(/[^0-9]/g, ''));
        const suffix = finalText.replace(/[0-9]/g, '');

        if (isNaN(finalNumber)) return;

        let currentNumber = 0;
        const increment = finalNumber / 50;
        const timer = setInterval(() => {
            currentNumber += increment;
            if (currentNumber >= finalNumber) {
                currentNumber = finalNumber;
                clearInterval(timer);
            }
            stat.textContent = Math.floor(currentNumber) + suffix;
        }, 30);
    });
}

// 页面加载完成后启动数字动画
window.addEventListener('load', () => {
    // 延迟启动动画，让页面先渲染完成
    setTimeout(animateNumbers, 500);
});

// ===== 平滑滚动 =====
function initSmoothScrolling() {
    // 为所有内部链接添加平滑滚动
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);

            if (targetElement) {
                const offsetTop = targetElement.offsetTop - 80; // 考虑固定导航栏高度
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// 初始化平滑滚动
initSmoothScrolling();

// ===== 通知系统 =====
function showNotification(message, type = 'info') {
    // 创建通知元素
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <span class="notification-icon">${getNotificationIcon(type)}</span>
            <span class="notification-message">${message}</span>
            <button class="notification-close">&times;</button>
        </div>
    `;

    // 添加样式
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${getNotificationColor(type)};
        color: white;
        padding: 16px 20px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 10000;
        max-width: 400px;
        transform: translateX(100%);
        transition: transform 0.3s ease;
    `;

    // 添加到页面
    document.body.appendChild(notification);

    // 显示动画
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);

    // 关闭功能
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.addEventListener('click', () => {
        removeNotification(notification);
    });

    // 自动关闭
    setTimeout(() => {
        removeNotification(notification);
    }, 5000);
}

function getNotificationIcon(type) {
    const icons = {
        'success': '✓',
        'error': '✕',
        'warning': '⚠',
        'info': 'ℹ'
    };
    return icons[type] || icons.info;
}

function getNotificationColor(type) {
    const colors = {
        'success': '#10B981',
        'error': '#EF4444',
        'warning': '#F59E0B',
        'info': '#3B82F6'
    };
    return colors[type] || colors.info;
}

function removeNotification(notification) {
    notification.style.transform = 'translateX(100%)';
    setTimeout(() => {
        if (notification.parentNode) {
            notification.parentNode.removeChild(notification);
        }
    }, 300);
}

// ===== 添加CSS动画支持 =====
const style = document.createElement('style');
style.textContent = `
    @keyframes pulse {
        0% { transform: scale(1); }
        50% { transform: scale(1.05); }
        100% { transform: scale(1); }
    }

    .loading-spinner {
        display: inline-block;
        width: 16px;
        height: 16px;
        border: 2px solid rgba(255,255,255,0.3);
        border-radius: 50%;
        border-top-color: white;
        animation: spin 1s ease-in-out infinite;
    }

    @keyframes spin {
        to { transform: rotate(360deg); }
    }

    .notification-content {
        display: flex;
        align-items: center;
        gap: 12px;
    }

    .notification-close {
        background: none;
        border: none;
        color: white;
        font-size: 20px;
        cursor: pointer;
        padding: 0;
        margin-left: 12px;
    }

    .error-message {
        color: var(--accent-red);
        font-size: 12px;
        margin-top: 4px;
    }

    .error {
        border-color: var(--accent-red) !important;
    }
`;
document.head.appendChild(style);

// ===== 页面性能优化 =====
// 图片懒加载
function initLazyLoading() {
    const images = document.querySelectorAll('img[loading="lazy"]');

    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src || img.src;
                    img.classList.remove('lazy');
                    imageObserver.unobserve(img);
                }
            });
        });

        images.forEach(img => {
            imageObserver.observe(img);
        });
    }
}

// 初始化懒加载
initLazyLoading();

// ===== 团队成员详细信息展示 =====
function initTeamMemberDetails() {
    const teamMembers = document.querySelectorAll('.team-member');

    teamMembers.forEach(member => {
        // 双击显示详细信息
        member.addEventListener('dblclick', function(e) {
            e.preventDefault();
            showTeamMemberDetails(this);
        });
    });
}

function showTeamMemberDetails(member) {
    const memberInfo = member.querySelector('.member-info');
    const name = memberInfo.querySelector('.member-name').textContent;
    const position = memberInfo.querySelector('.member-position').textContent;
    const bio = memberInfo.querySelector('.member-bio').textContent;
    const languages = Array.from(memberInfo.querySelectorAll('.lang-badge')).map(badge => badge.textContent);

    // 创建详情弹窗
    const modal = document.createElement('div');
    modal.className = 'team-member-modal';
    modal.innerHTML = `
        <div class="modal-overlay">
            <div class="modal-content">
                <div class="modal-header">
                    <h3>${name}</h3>
                    <button class="modal-close">&times;</button>
                </div>
                <div class="modal-body">
                    <div class="member-detail-position">${position}</div>
                    <div class="member-detail-languages">
                        <h4>语言能力</h4>
                        <div class="languages-list">
                            ${languages.map(lang => `<span class="lang-badge">${lang}</span>`).join('')}
                        </div>
                    </div>
                    <div class="member-detail-bio">
                        <h4>个人简介</h4>
                        <p>${bio}</p>
                    </div>
                </div>
            </div>
        </div>
    `;

    // 添加样式
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0,0,0,0.5);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10000;
        padding: 20px;
    `;

    document.body.appendChild(modal);

    // 关闭功能
    const closeBtn = modal.querySelector('.modal-close');
    const overlay = modal.querySelector('.modal-overlay');

    function closeModal() {
        modal.remove();
    }

    closeBtn.addEventListener('click', closeModal);
    overlay.addEventListener('click', closeModal);

    // ESC键关闭
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeModal();
        }
    });
}

// 初始化团队成员详情功能
initTeamMemberDetails();