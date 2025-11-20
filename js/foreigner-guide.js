// ===== 外国人指南页面专用JavaScript =====

document.addEventListener('DOMContentLoaded', function() {
    // 初始化所有功能
    initSidebar();
    initLivingGuideTabs();
    initTermsDictionary();
    initFeeCalculator();
    initSmoothScrolling();
    initConsultationModal();
    initIntersectionObserver();
});

// ===== 侧边导航 =====
function initSidebar() {
    const sidebar = document.querySelector('.guide-sidebar');
    const toggleBtn = document.getElementById('sidebarToggle');
    const navLinks = document.querySelectorAll('.sidebar-nav .nav-link');

    if (!sidebar || !toggleBtn) return;

    // 切换侧边栏
    toggleBtn.addEventListener('click', function() {
        sidebar.classList.toggle('collapsed');
        localStorage.setItem('sidebarCollapsed', sidebar.classList.contains('collapsed'));
    });

    // 恢复侧边栏状态
    const isCollapsed = localStorage.getItem('sidebarCollapsed') === 'true';
    if (isCollapsed) {
        sidebar.classList.add('collapsed');
    }

    // 导航链接点击事件
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);

            if (targetElement) {
                // 移除所有活动状态
                navLinks.forEach(l => l.classList.remove('active'));
                this.classList.add('active');

                // 平滑滚动到目标
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });

                // 移动端自动关闭侧边栏
                if (window.innerWidth <= 767) {
                    sidebar.classList.add('collapsed');
                }
            }
        });
    });

    // 监听滚动更新活动状态
    updateActiveNavLink();
    window.addEventListener('scroll', updateActiveNavLink);
}

function updateActiveNavLink() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.sidebar-nav .nav-link');

    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (scrollY >= sectionTop - 200) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
}

// ===== 生活指南标签页 =====
function initLivingGuideTabs() {
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabPanels = document.querySelectorAll('.tab-panel');

    if (tabButtons.length === 0) return;

    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            const targetTab = this.dataset.tab;

            // 更新按钮状态
            tabButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');

            // 更新内容显示
            tabPanels.forEach(panel => {
                panel.classList.remove('active');
                if (panel.id === targetTab) {
                    panel.classList.add('active');
                }
            });

            // 保存当前标签页状态
            localStorage.setItem('activeLivingTab', targetTab);
        });
    });

    // 恢复上次访问的标签页
    const savedTab = localStorage.getItem('activeLivingTab');
    if (savedTab) {
        const savedButton = document.querySelector(`.tab-btn[data-tab="${savedTab}"]`);
        if (savedButton) {
            savedButton.click();
        }
    }
}

// ===== 术语词典 =====
function initTermsDictionary() {
    const termsData = [
        // あ行
        { jp: '敷金（しききん）', reading: 'しききん', cn: '押金', category: 'あ-お' },
        { jp: '礼金（れいきん）', reading: 'れいきん', cn: '礼金', category: 'あ-お' },
        { jp: '仲介手数料（ちゅうかいてすうりょう）', reading: 'ちゅうかいてすうりょう', cn: '中介费', category: 'あ-お' },
        { jp: '保証人（ほしょうにん）', reading: 'ほしょうにん', cn: '保证人', category: 'あ-お' },
        { jp: '更新料（こうしんりょう）', reading: 'こうしんりょう', cn: '续约费', category: 'あ-お' },
        { jp: '解約予告（かいやくよこく）', reading: 'かいやくよこく', cn: '解约预告', category: 'あ-お' },
        { jp: '火災保険料（かさいほけんりょう）', reading: 'かさいほけんりょう', cn: '火灾保险费', category: 'あ-お' },
        { jp: '鍵交換費用（かぎこうかんひよう）', reading: 'かぎこうかんひよう', cn: '换钥匙费', category: 'あ-お' },

        // か行
        { jp: '共益費（きょうえきひ）', reading: 'きょうえきひ', cn: '管理费', category: 'か-こ' },
        { jp: '管理費（かんりひ）', reading: 'かんりひ', cn: '管理费', category: 'か-こ' },
        { jp: '契約（けいやく）', reading: 'けいやく', cn: '合同', category: 'か-こ' },
        { jp: '建物（たてもの）', reading: 'たてもの', cn: '建筑物', category: 'か-こ' },
        { jp: '間取り（まどり）', reading: 'まどり', cn: '户型', category: 'か-こ' },
        { jp: '物件（ぶっけん）', reading: 'ぶっけん', cn: '房源', category: 'か-こ' },
        { jp: '家賃（やちん）', reading: 'やちん', cn: '房租', category: 'か-こ' },
        { jp: '駐車場（ちゅうしゃじょう）', reading: 'ちゅうしゃじょう', cn: '停车场', category: 'か-こ' },

        // さ行
        { jp: '修繕費（しゅうぜんひ）', reading: 'しゅうぜんひ', cn: '维修费', category: 'さ-そ' },
        { jp: '初期費用（しょきひよう）', reading: 'しょきひよう', cn: '初期费用', category: 'さ-そ' },
        { jp: '重要事項説明（じゅうようじこうせつめい）', reading: 'じゅうようじこうせつめい', cn: '重要事项说明', category: 'さ-そ' },
        { jp: '証明書（しょうめいしょ）', reading: 'しょうめいしょ', cn: '证明书', category: 'さ-そ' },
        { jp: '申込書（もうしこみしょ）', reading: 'もうしこみしょ', cn: '申请表', category: 'さ-そ' },
        { jp: '洗面所（せんめんじょ）', reading: 'せんめんじょ', cn: '洗手间', category: 'さ-そ' },
        { jp: '専有部分（せんゆうぶぶん）', reading: 'せんゆうぶぶん', cn: '专有部分', category: 'さ-そ' },
        { jp: '総括（そうかつ）', reading: 'そうかつ', cn: '概括', category: 'さ-そ' },

        // た行
        { jp: '退去（たいきょ）', reading: 'たいきょ', cn: '退租', category: 'た-と' },
        { jp: '退去時クリーニング（たいきょじクリーニング）', reading: 'たいきょじクリーニング', cn: '退租清扫费', category: 'た-と' },
        { jp: '大家（おおや）', reading: 'おおや', cn: '房东', category: 'た-と' },
        { jp: '単身（たんしん）', reading: 'たんしん', cn: '单身', category: 'た-と' },
        { jp: '賃貸（ちんたい）', reading: 'ちんたい', cn: '租赁', category: 'た-と' },
        { jp: '通帳（つうちょう）', reading: 'つうちょう', cn: '银行存折', category: 'た-と' },
        { jp: '定期借家（ていきしゃっか）', reading: 'ていきしゃっか', cn: '定期租赁', category: 'た-と' },
        { jp: '登記（とうき）', reading: 'とうき', cn: '登记', category: 'た-と' },

        // な行
        { jp: '入居（にゅうきょ）', reading: 'にゅうきょ', cn: '入住', category: 'な-ほ' },
        { jp: '入居審査（にゅうきょしんさ）', reading: 'にゅうきょしんさ', cn: '入住审查', category: 'な-ほ' },
        { jp: '入居時費用（にゅうきょじひよう）', reading: 'にゅうきょじひよう', cn: '入住费用', category: 'な-ほ' },
        { jp: '任意保険（にんいほけん）', reading: 'にんいほけん', cn: '自愿保险', category: 'な-ほ' },
        { jp: '年収（ねんしゅう）', reading: 'ねんしゅう', cn: '年收入', category: 'な-ほ' },
        { jp: '農地（のうち）', reading: 'のうち', cn: '农地', category: 'な-ほ' },
        { jp: '法人（ほうじん）', reading: 'ほうじん', cn: '法人', category: 'な-ほ' },
        { jp: '保証会社（ほしょうがいしゃ）', reading: 'ほしょうがいしゃ', cn: '保证公司', category: 'な-ほ' },

        // ま行
        { jp: '面積（めんせき）', reading: 'めんせき', cn: '面积', category: 'ま-よ' },
        { jp: 'モデルルーム（モデルルーム）', reading: 'モデルルーム', cn: '样板间', category: 'ま-よ' },
        { jp: '持家（もちや）', reading: 'もちや', cn: '自有住房', category: 'ま-よ' },
        { jp: '募集（ぼしゅう）', reading: 'ぼしゅう', cn: '招租', category: 'ま-よ' },
        { jp: '免許（めんきょ）', reading: 'めんきょ', cn: '执照', category: 'ま-よ' },
        { jp: '申込金（もうしこみきん）', reading: 'もうしこみきん', cn: '申请费', category: 'ま-よ' },
        { jp: '模様替え（もようがえ）', reading: 'もようがえ', cn: '装修改造', category: 'ま-よ' },
        { jp: '問屋（といや）', reading: 'といや', cn: '批发商', category: 'ま-よ' },

        // や行
        { jp: '浴室（よくしつ）', reading: 'よくしつ', cn: '浴室', category: 'や-よ' },
        { jp: '予防（よぼう）', reading: 'よぼう', cn: '预防', category: 'や-よ' },
        { jp: '用途（ようと）', reading: 'ようと', cn: '用途', category: 'や-よ' },
        { jp: '洋室（ようしつ）', reading: 'ようしつ', cn: '西式房间', category: 'や-よ' },
        { jp: '床面積（ゆかめんせき）', reading: 'ゆかめんせき', cn: '地板面积', category: 'や-よ' },
        { jp: '輸入（ゆにゅう）', reading: 'ゆにゅう', cn: '进口', category: 'や-よ' },

        // ら行
        { jp: '礼金（れいきん）', reading: 'れいきん', cn: '礼金', category: 'ら-わ' },
        { jp: '連帯保証人（れんたいほしょうにん）', reading: 'れんたいほしょうにん', cn: '连带保证人', category: 'ら-わ' },
        { jp: '留学生（りゅうがくせい）', reading: 'りゅうがくせい', cn: '留学生', category: 'ら-わ' },
        { jp: '旅券（りょけん）', reading: 'りょけん', cn: '护照', category: 'ら-わ' },
        { jp: '定期借地権（ていきしゃくちけん）', reading: 'ていきしゃくちけん', cn: '定期借地权', category: 'ら-わ' },
        { jp: '労働者（ろうどうしゃ）', reading: 'ろうどうしゃ', cn: '劳动者', category: 'ら-わ' }
    ];

    const termsGrid = document.getElementById('termsGrid');
    const searchInput = document.getElementById('termsSearch');
    const searchBtn = document.getElementById('searchTermsBtn');
    const alphaButtons = document.querySelectorAll('.alpha-btn');

    if (!termsGrid) return;

    let currentFilter = 'all';
    let currentSearch = '';

    // 渲染术语卡片
    function renderTerms() {
        let filteredTerms = termsData;

        // 按字母过滤
        if (currentFilter !== 'all') {
            filteredTerms = filteredTerms.filter(term => term.category === currentFilter);
        }

        // 按搜索词过滤
        if (currentSearch) {
            filteredTerms = filteredTerms.filter(term =>
                term.jp.includes(currentSearch) ||
                term.reading.includes(currentSearch) ||
                term.cn.includes(currentSearch)
            );
        }

        // 生成HTML
        const html = filteredTerms.map(term => `
            <div class="term-card">
                <div class="term-jp">${term.jp}</div>
                <div class="term-reading">${term.reading}</div>
                <div class="term-cn">${term.cn}</div>
            </div>
        `).join('');

        termsGrid.innerHTML = html || '<div class="no-results">没有找到匹配的术语</div>';

        // 添加动画效果
        const cards = termsGrid.querySelectorAll('.term-card');
        cards.forEach((card, index) => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px)';
            setTimeout(() => {
                card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }, index * 50);
        });
    }

    // 字母过滤
    alphaButtons.forEach(button => {
        button.addEventListener('click', function() {
            alphaButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            currentFilter = this.dataset.alpha;
            renderTerms();
        });
    });

    // 搜索功能
    function performSearch() {
        currentSearch = searchInput.value.trim();
        renderTerms();
    }

    if (searchBtn) {
        searchBtn.addEventListener('click', performSearch);
    }

    if (searchInput) {
        searchInput.addEventListener('keyup', function(e) {
            if (e.key === 'Enter') {
                performSearch();
            }
        });

        // 实时搜索（防抖）
        let searchTimeout;
        searchInput.addEventListener('input', function() {
            clearTimeout(searchTimeout);
            searchTimeout = setTimeout(performSearch, 300);
        });
    }

    // 初始渲染
    renderTerms();
}

// ===== 费用计算器 =====
function initFeeCalculator() {
    const rentInput = document.getElementById('calcRent');
    const manageInput = document.getElementById('calcManage');
    const calculateBtn = document.getElementById('calculateBtn');
    const resultDiv = document.getElementById('calcResult');

    if (!calculateBtn) return;

    calculateBtn.addEventListener('click', function() {
        const rent = parseInt(rentInput.value) || 0;
        const manage = parseInt(manageInput.value) || 0;

        if (rent <= 0) {
            showNotification('请输入有效的租金金额', 'warning');
            return;
        }

        // 计算各项费用（日清不动产费率）
        const deposit = rent; // 押金：1个月
        const keyMoney = rent * 0.5; // 礼金：0.5个月
        const brokerFee = rent * 0.3; // 中介费：0.3个月
        const guaranteeFee = rent * 0.4; // 保证费：0.4个月
        const insurance = 15000; // 火灾保险
        const keyChange = 16500; // 换钥匙费
        const firstMonthRent = rent; // 第一个月房租
        const firstMonthManage = manage; // 第一个月管理费

        const total = deposit + keyMoney + brokerFee + guaranteeFee + insurance + keyChange + firstMonthRent + firstMonthManage;

        // 显示结果
        resultDiv.innerHTML = `
            <h4>费用计算结果</h4>
            <div class="calc-result-grid">
                <div class="result-item">
                    <span class="result-label">押金（1个月）</span>
                    <span class="result-value">¥${deposit.toLocaleString()}</span>
                </div>
                <div class="result-item">
                    <span class="result-label">礼金（0.5个月）</span>
                    <span class="result-value">¥${keyMoney.toLocaleString()}</span>
                </div>
                <div class="result-item">
                    <span class="result-label">中介费（0.3个月）</span>
                    <span class="result-value">¥${brokerFee.toLocaleString()}</span>
                </div>
                <div class="result-item">
                    <span class="result-label">保证费（0.4个月）</span>
                    <span class="result-value">¥${guaranteeFee.toLocaleString()}</span>
                </div>
                <div class="result-item">
                    <span class="result-label">火灾保险</span>
                    <span class="result-value">¥${insurance.toLocaleString()}</span>
                </div>
                <div class="result-item">
                    <span class="result-label">换钥匙费</span>
                    <span class="result-value">¥${keyChange.toLocaleString()}</span>
                </div>
                <div class="result-item">
                    <span class="result-label">首月房租</span>
                    <span class="result-value">¥${firstMonthRent.toLocaleString()}</span>
                </div>
                <div class="result-item">
                    <span class="result-label">首月管理费</span>
                    <span class="result-value">¥${firstMonthManage.toLocaleString()}</span>
                </div>
                <div class="result-item total">
                    <span class="result-label">初期费用合计</span>
                    <span class="result-value">¥${total.toLocaleString()}</span>
                </div>
                <div class="result-item monthly">
                    <span class="result-label">月度费用</span>
                    <span class="result-value">¥${(rent + manage).toLocaleString()}</span>
                </div>
            </div>
            <p class="calc-note">* 以上为日清不动产的优惠费率，实际费用可能因房源条件有所不同</p>
        `;

        resultDiv.style.display = 'block';
        resultDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

        // 添加动画效果
        resultDiv.style.opacity = '0';
        resultDiv.style.transform = 'translateY(20px)';
        setTimeout(() => {
            resultDiv.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
            resultDiv.style.opacity = '1';
            resultDiv.style.transform = 'translateY(0)';
        }, 100);
    });
}

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
        console.log('Guide consultation form submitted:', data);

        // 显示成功消息
        showNotification('咨询预约成功！我们会尽快与您联系。', 'success');

        // 重置表单和关闭弹窗
        form.reset();
        closeModal();

        // 恢复按钮状态
        submitBtn.disabled = false;
        submitBtn.textContent = originalText;

        // 跟踪转化事件
        if (typeof gtag !== 'undefined') {
            gtag('event', 'guide_consultation_submit', {
                'event_category': 'lead',
                'event_label': 'foreigner_guide_page'
            });
        }
    }, 2000);
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

// ===== 滚动动画观察器 =====
function initIntersectionObserver() {
    const animatedElements = document.querySelectorAll('.overview-card, .process-step-detailed, .doc-item, .fee-item-detailed, .utility-item, .term-card, .phrase-card');

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

    .no-results {
        grid-column: 1 / -1;
        text-align: center;
        padding: var(--space-2xl);
        color: var(--text-muted);
        font-size: 16px;
    }

    .calc-result-grid {
        display: grid;
        gap: var(--space-md);
        margin: var(--space-xl) 0;
    }

    .result-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: var(--space-md);
        background: var(--bg-tertiary);
        border-radius: var(--radius-md);
    }

    .result-item.total {
        background: linear-gradient(135deg, var(--primary-light), var(--accent-gold));
        color: white;
        font-weight: 600;
        font-size: 18px;
    }

    .result-item.monthly {
        background: var(--accent-green);
        color: white;
        font-weight: 600;
    }

    .result-label {
        font-weight: 500;
    }

    .result-value {
        font-weight: 600;
    }

    .calc-note {
        text-align: center;
        color: var(--text-muted);
        font-size: 14px;
        margin-top: var(--space-lg);
        font-style: italic;
    }
`;
document.head.appendChild(style);