// ===== 服务页面专用JavaScript =====

document.addEventListener('DOMContentLoaded', function() {
    // 初始化所有功能
    initFAQSystem();
    initConsultationModal();
    initProcessAnimations();
    initServiceCardsHover();
    initScrollAnimations();
});

// ===== FAQ系统 =====
function initFAQSystem() {
    const categoryBtns = document.querySelectorAll('.category-btn');
    const faqCategories = document.querySelectorAll('.faq-category');
    const faqItems = document.querySelectorAll('.faq-item');

    // 分类切换
    categoryBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const category = this.dataset.category;

            // 更新按钮状态
            categoryBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');

            // 显示对应分类
            faqCategories.forEach(cat => {
                cat.classList.remove('active');
                if (cat.id === category) {
                    cat.classList.add('active');
                }
            });
        });
    });

    // FAQ项目展开/收起
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');

        question.addEventListener('click', function() {
            const isActive = item.classList.contains('active');

            // 关闭其他项目
            faqItems.forEach(otherItem => {
                if (otherItem !== item && otherItem.classList.contains('active')) {
                    otherItem.classList.remove('active');
                }
            });

            // 切换当前项目
            if (!isActive) {
                item.classList.add('active');
            } else {
                item.classList.remove('active');
            }
        });
    });

    // 搜索功能
    initFAQSearch();
}

function initFAQSearch() {
    // 如果页面有搜索框，初始化搜索功能
    const searchInput = document.getElementById('faqSearch');
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            const searchTerm = this.value.toLowerCase();
            const faqItems = document.querySelectorAll('.faq-item');
            const activeCategory = document.querySelector('.category-btn.active').dataset.category;

            faqItems.forEach(item => {
                const category = item.closest('.faq-category').id;
                const question = item.querySelector('.faq-question h4').textContent.toLowerCase();
                const answer = item.querySelector('.faq-answer p').textContent.toLowerCase();

                const matchesSearch = question.includes(searchTerm) || answer.includes(searchTerm);
                const matchesCategory = category === activeCategory;

                if (matchesSearch && matchesCategory) {
                    item.style.display = 'block';
                } else {
                    item.style.display = 'none';
                }
            });
        });
    }
}

// ===== 咨询弹窗 =====
function initConsultationModal() {
    const modal = document.getElementById('consultationModal');
    const openBtn = document.querySelector('.btn-consultation');
    const closeBtn = document.getElementById('closeConsultationModal');
    const cancelBtn = document.getElementById('cancelConsultation');
    const form = document.getElementById('consultationForm');

    if (!modal) return;

    // 打开弹窗
    function openModal() {
        modal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
        modal.classList.add('active');
    }

    // 关闭弹窗
    function closeModal() {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
        modal.classList.remove('active');
        if (form) {
            form.reset();
        }
    }

    // 事件绑定
    if (openBtn) {
        openBtn.addEventListener('click', openModal);
    }

    if (closeBtn) {
        closeBtn.addEventListener('click', closeModal);
    }

    if (cancelBtn) {
        cancelBtn.addEventListener('click', closeModal);
    }

    // 点击背景关闭
    modal.addEventListener('click', function(e) {
        if (e.target === modal || e.target.classList.contains('modal-overlay')) {
            closeModal();
        }
    });

    // ESC键关闭
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            closeModal();
        }
    });

    // 表单提交
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            submitConsultationForm(form);
        });
    }

    // 设置最小日期时间为当前时间
    const datetimeInput = form?.querySelector('input[type="datetime-local"]');
    if (datetimeInput) {
        const now = new Date();
        const localDateTime = new Date(now.getTime() - now.getTimezoneOffset() * 60000)
            .toISOString()
            .slice(0, 16);
        datetimeInput.min = localDateTime;
    }
}

function submitConsultationForm(form) {
    const formData = new FormData(form);
    const data = Object.fromEntries(formData);

    // 显示加载状态
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<span class="loading-spinner"></span> 提交中...';

    // 模拟API调用
    setTimeout(() => {
        // 这里应该调用实际的API
        console.log('Consultation form submitted:', data);

        // 显示成功消息
        showNotification('预约提交成功！我们会尽快与您联系。', 'success');

        // 重置表单和关闭弹窗
        form.reset();
        closeModal();

        // 恢复按钮状态
        submitBtn.disabled = false;
        submitBtn.textContent = originalText;

        // 如果有Google Analytics，可以跟踪转化事件
        if (typeof gtag !== 'undefined') {
            gtag('event', 'consultation_form_submit', {
                'event_category': 'lead',
                'event_label': 'services_page'
            });
        }
    }, 2000);
}

// ===== 流程动画 =====
function initProcessAnimations() {
    const processSteps = document.querySelectorAll('.process-step');

    // 使用Intersection Observer实现滚动动画
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';

                    // 添加数字计数动画
                    const stepNumber = entry.target.querySelector('.step-number');
                    animateStepNumber(stepNumber);
                }, index * 200);
            }
        });
    }, {
        threshold: 0.3,
        rootMargin: '0px 0px -50px 0px'
    });

    processSteps.forEach((step, index) => {
        step.style.opacity = '0';
        step.style.transform = 'translateY(30px)';
        step.style.transition = `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`;
        observer.observe(step);
    });
}

function animateStepNumber(element) {
    if (!element) return;

    const targetNumber = parseInt(element.textContent);
    let currentNumber = 0;
    const increment = targetNumber / 30;

    const timer = setInterval(() => {
        currentNumber += increment;
        if (currentNumber >= targetNumber) {
            currentNumber = targetNumber;
            clearInterval(timer);
        }
        element.textContent = Math.floor(currentNumber);
    }, 30);
}

// ===== 服务卡片hover效果 =====
function initServiceCardsHover() {
    const serviceCards = document.querySelectorAll('.service-card');

    serviceCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            // 添加hover效果
            this.style.transform = 'translateY(-12px) scale(1.02)';

            // 图标动画
            const icon = this.querySelector('.service-icon');
            if (icon) {
                icon.style.transform = 'scale(1.1) rotate(5deg)';
            }
        });

        card.addEventListener('mouseleave', function() {
            // 移除hover效果
            this.style.transform = '';

            // 图标动画恢复
            const icon = this.querySelector('.service-icon');
            if (icon) {
                icon.style.transform = '';
            }
        });

        // 点击效果
        card.addEventListener('click', function() {
            // 添加脉冲动画
            this.style.animation = 'pulse 0.6s ease';
            setTimeout(() => {
                this.style.animation = '';
            }, 600);
        });
    });
}

// ===== 滚动动画 =====
function initScrollAnimations() {
    // 为各个section添加滚动显示动画
    const animateElements = document.querySelectorAll('.service-card, .story-card, .fee-table');

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

    animateElements.forEach((element, index) => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(30px)';
        element.style.transition = `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`;
        observer.observe(element);
    });
}

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

// ===== 费用计算器 =====
function initFeeCalculator() {
    // 如果页面有费用计算器，初始化功能
    const calculator = document.getElementById('feeCalculator');
    if (!calculator) return;

    const rentInput = calculator.querySelector('#rentAmount');
    const calculateBtn = calculator.querySelector('#calculateFees');
    const resultDiv = calculator.querySelector('#feeResult');

    if (calculateBtn) {
        calculateBtn.addEventListener('click', () => {
            calculateFees();
        });
    }

    if (rentInput) {
        rentInput.addEventListener('input', () => {
            // 实时更新显示
            updateRentDisplay(rentInput.value);
        });
    }
}

function calculateFees() {
    const rentAmount = parseFloat(document.getElementById('rentAmount').value) || 0;

    if (rentAmount <= 0) {
        showNotification('请输入有效的租金金额', 'warning');
        return;
    }

    // 日清不动产费用计算
    const brokerFee = rentAmount * 0.3;
    const deposit = rentAmount;
    const keyMoney = rentAmount * 0.5;
    const guaranteeFee = rentAmount * 0.4;
    const insurance = 15000;
    const cleaning = 25000;
    const firstMonthRent = rentAmount;

    const total = brokerFee + deposit + keyMoney + guaranteeFee + insurance + cleaning + firstMonthRent;

    // 显示结果
    displayFeeResult({
        rentAmount,
        brokerFee,
        deposit,
        keyMoney,
        guaranteeFee,
        insurance,
        cleaning,
        firstMonthRent,
        total
    });
}

function displayFeeResult(fees) {
    const resultDiv = document.getElementById('feeResult');
    if (!resultDiv) return;

    resultDiv.innerHTML = `
        <h4>费用明细</h4>
        <div class="fee-breakdown">
            <div class="fee-row">
                <span>房租（1个月）</span>
                <span>¥${fees.rentAmount.toLocaleString()}</span>
            </div>
            <div class="fee-row">
                <span>中介费（0.3个月）</span>
                <span>¥${fees.brokerFee.toLocaleString()}</span>
            </div>
            <div class="fee-row">
                <span>押金（1个月）</span>
                <span>¥${fees.deposit.toLocaleString()}</span>
            </div>
            <div class="fee-row">
                <span>礼金（0.5个月）</span>
                <span>¥${fees.keyMoney.toLocaleString()}</span>
            </div>
            <div class="fee-row">
                <span>保证费（0.4个月）</span>
                <span>¥${fees.guaranteeFee.toLocaleString()}</span>
            </div>
            <div class="fee-row">
                <span>火灾保险</span>
                <span>¥${fees.insurance.toLocaleString()}</span>
            </div>
            <div class="fee-row">
                <span>清扫费</span>
                <span>¥${fees.cleaning.toLocaleString()}</span>
            </div>
            <div class="fee-row total">
                <span>合计</span>
                <span>¥${fees.total.toLocaleString()}</span>
            </div>
        </div>
        <p class="fee-note">* 实际费用可能因房源条件有所不同</p>
    `;

    // 添加动画效果
    resultDiv.style.opacity = '0';
    resultDiv.style.transform = 'translateY(20px)';
    setTimeout(() => {
        resultDiv.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        resultDiv.style.opacity = '1';
        resultDiv.style.transform = 'translateY(0)';
    }, 100);
}

function updateRentDisplay(value) {
    const display = document.getElementById('rentDisplay');
    if (display) {
        display.textContent = `¥${parseInt(value || 0).toLocaleString()}`;
    }
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

    .fee-breakdown {
        margin: 20px 0;
    }

    .fee-row {
        display: flex;
        justify-content: space-between;
        padding: 8px 0;
        border-bottom: 1px solid rgba(255,255,255,0.1);
    }

    .fee-row.total {
        border-top: 2px solid rgba(255,255,255,0.3);
        font-weight: bold;
        font-size: 18px;
        margin-top: 12px;
        padding-top: 12px;
    }

    .fee-note {
        font-size: 12px;
        opacity: 0.8;
        margin-top: 16px;
    }
`;
document.head.appendChild(style);