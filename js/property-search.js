// ===== 房源搜索页面专用JavaScript =====

// 等待DOM加载完成
document.addEventListener('DOMContentLoaded', function() {
    initPropertySearch();
});

// ===== 主要搜索功能 =====
function initPropertySearch() {
    // 初始化搜索标签切换
    initSearchTabs();

    // 初始化搜索表单
    initSearchForms();

    // 初始化房源数据
    loadProperties();

    // 初始化排序功能
    initSorting();

    // 初始化推荐标签
    initRecommendedTags();

    // 初始化视图切换
    initViewToggle();

    // 初始化分页
    initPagination();

    // 初始化房源详情弹窗
    initPropertyModal();

    // 初始化语言切换（搜索页面特有）
    initSearchPageLanguage();
}

// ===== 搜索标签切换 =====
function initSearchTabs() {
    const tabBtns = document.querySelectorAll('.tab-btn');
    const searchForms = document.querySelectorAll('.search-form');

    tabBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const targetTab = this.getAttribute('data-tab');

            // 更新按钮状态
            tabBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');

            // 显示对应表单
            searchForms.forEach(form => {
                form.classList.remove('active');
                if (form.id === `${targetTab}-search`) {
                    form.classList.add('active');
                }
            });
        });
    });
}

// ===== 搜索表单处理 =====
function initSearchForms() {
    // 基本搜索
    const basicForm = document.querySelector('#basic-search .property-search-form');
    if (basicForm) {
        basicForm.addEventListener('submit', handleBasicSearch);
    }

    // 详细搜索
    const advancedForm = document.querySelector('#advanced-search .property-search-form');
    if (advancedForm) {
        advancedForm.addEventListener('submit', handleAdvancedSearch);
    }

    // 通勤时间搜索
    const commuteForm = document.querySelector('#commute-search .commute-search-form');
    if (commuteForm) {
        commuteForm.addEventListener('submit', handleCommuteSearch);
    }

    // VR搜索
    const vrForm = document.querySelector('#vr-search .vr-search-form');
    if (vrForm) {
        vrForm.addEventListener('submit', handleVRSearch);
    }

    // 重置按钮
    const resetBtn = document.getElementById('resetSearch');
    if (resetBtn) {
        resetBtn.addEventListener('click', resetBasicSearch);
    }

    const resetAdvancedBtn = document.getElementById('resetAdvanced');
    if (resetAdvancedBtn) {
        resetAdvancedBtn.addEventListener('click', resetAdvancedSearch);
    }

    const resetCommuteBtn = document.getElementById('resetCommute');
    if (resetCommuteBtn) {
        resetCommuteBtn.addEventListener('click', resetCommuteSearch);
    }
}

// ===== 搜索处理函数 =====
function handleBasicSearch(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const searchParams = Object.fromEntries(formData);

    performSearch(searchParams, 'basic');
}

function handleAdvancedSearch(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const searchParams = Object.fromEntries(formData);

    // 处理复选框
    const checkboxes = e.target.querySelectorAll('input[type="checkbox"]:checked');
    checkboxes.forEach(checkbox => {
        searchParams[checkbox.name] = '1';
    });

    performSearch(searchParams, 'advanced');
}

function handleCommuteSearch(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const searchParams = Object.fromEntries(formData);

    performSearch(searchParams, 'commute');
}

function handleVRSearch(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const searchParams = Object.fromEntries(formData);
    searchParams.vr = 'true';

    performSearch(searchParams, 'vr');
}

// ===== 执行搜索 =====
function performSearch(params, searchType) {
    // 显示加载状态
    showSearchLoading();

    // 构建搜索URL
    const searchUrl = buildSearchUrl(params);

    // 模拟API调用
    setTimeout(() => {
        // 加载房源数据
        loadProperties(params);

        // 更新结果统计
        updateResultsCount(1234);

        // 隐藏加载状态
        hideSearchLoading();

        // 滚动到结果区域
        scrollToResults();
    }, 1000);
}

function buildSearchUrl(params) {
    const urlParams = new URLSearchParams();

    Object.keys(params).forEach(key => {
        if (params[key]) {
            urlParams.append(key, params[key]);
        }
    });

    return `property-search.html?${urlParams.toString()}`;
}

// ===== 房源数据 =====
let allProperties = [];
let filteredProperties = [];
let currentPage = 1;
const propertiesPerPage = 12;

function loadProperties(filters = {}) {
    // 模拟房源数据
    allProperties = generateMockProperties();

    // 应用过滤条件
    filteredProperties = filterProperties(allProperties, filters);

    // 渲染房源网格
    renderPropertiesGrid();

    // 更新分页
    updatePagination();
}

function generateMockProperties() {
    const properties = [];
    const areas = ['新宿区', '渋谷区', '目黒区', '世田谷区', '中野区', '杉並区', '練馬区', '豊島区', '文京区', '台東区'];
    const stations = ['新宿', '渋谷', '東京', '品川', '新橋', '秋葉原', '上野', '池袋', '高田馬場', '吉祥寺'];
    const layouts = ['1R', '1K', '1DK', '1LDK', '2K', '2DK', '2LDK', '3LDK'];
    const features = [
        { key: 'no-guarantor', label: '保証人不要', icon: '✅' },
        { key: 'furniture', label: '家具家電付き', icon: '🛋️' },
        { key: 'parking', label: '駐車場あり', icon: '🚗' },
        { key: 'vr', label: 'VR対応', icon: '🥽' },
        { key: 'pet', label: 'ペット可', icon: '🐕' },
        { key: 'internet', label: 'インターネット無料', icon: '📶' },
        { key: 'two-people', label: '二人入居可', icon: '👥' },
        { key: 'corner', label: '角部屋', icon: '📐' }
    ];

    for (let i = 1; i <= 120; i++) {
        const area = areas[Math.floor(Math.random() * areas.length)];
        const station = stations[Math.floor(Math.random() * stations.length)];
        const layout = layouts[Math.floor(Math.random() * layouts.length)];
        const price = Math.floor(Math.random() * 20) + 5; // 5-25万円
        const size = Math.floor(Math.random() * 40) + 20; // 20-60㎡
        const walkTime = Math.floor(Math.random() * 15) + 1; // 1-15分
        const buildingAge = Math.floor(Math.random() * 20); // 0-20年
        const floor = Math.floor(Math.random() * 10) + 1; // 1-10階

        // 随机选择特征
        const selectedFeatures = [];
        features.forEach(feature => {
            if (Math.random() > 0.7) {
                selectedFeatures.push(feature);
            }
        });

        // 添加特殊标记
        const isVR = selectedFeatures.some(f => f.key === 'vr') || Math.random() > 0.8;
        const isNew = Math.random() > 0.9;
        const isPopular = Math.random() > 0.85;

        properties.push({
            id: i,
            title: `${area}${station}駅徒歩${walkTime}分`,
            address: `東京都${area}${station}-${Math.floor(Math.random() * 50) + 1}-${Math.floor(Math.random() * 20) + 1}`,
            price: price,
            layout: layout,
            size: size,
            station: station,
            walkTime: walkTime,
            buildingAge: buildingAge,
            floor: floor,
            totalFloors: Math.floor(Math.random() * 5) + floor,
            features: selectedFeatures,
            isVR: isVR,
            isNew: isNew,
            isPopular: isPopular,
            description: `${station}駅から徒歩${walkTime}分の人気エリア。${layout}、${size}㎡の明るいお部屋。`,
            images: generateMockImages(i),
            likeCount: Math.floor(Math.random() * 50),
            viewCount: Math.floor(Math.random() * 1000) + 100
        });
    }

    return properties;
}

function generateMockImages(propertyId) {
    const images = [];
    for (let i = 1; i <= 3; i++) {
        images.push({
            id: `property-${propertyId}-${i}`,
            url: `https://picsum.photos/400/300?random=${propertyId}${i}`,
            alt: `物件画像 ${i}`
        });
    }
    return images;
}

function filterProperties(properties, filters) {
    let filtered = [...properties];

    // 地区过滤
    if (filters.area && filters.area !== '') {
        filtered = filtered.filter(p =>
            p.title.includes(filters.area) || p.address.includes(filters.area)
        );
    }

    // 价格过滤
    if (filters.price && filters.price !== '') {
        const [min, max] = filters.price.split('-').map(p => parseInt(p));
        filtered = filtered.filter(p => {
            if (max === '+') return p.price >= min;
            return p.price >= min && p.price <= max;
        });
    }

    // 户型过滤
    if (filters.layout && filters.layout !== '') {
        filtered = filtered.filter(p => p.layout === filters.layout);
    }

    // 面积过滤
    if (filters['area-size'] && filters['area-size'] !== '') {
        const [min, max] = filters['area-size'].split('-').map(s => parseInt(s));
        filtered = filtered.filter(p => {
            if (max === '+') return p.size >= min;
            return p.size >= min && p.size <= max;
        });
    }

    // 车站过滤
    if (filters.station && filters.station !== '') {
        filtered = filtered.filter(p =>
            p.station.includes(filters.station) || p.title.includes(filters.station)
        );
    }

    // 楼龄过滤
    if (filters.age && filters.age !== '') {
        if (filters.age === 'new') {
            filtered = filtered.filter(p => p.buildingAge === 0);
        } else {
            const maxAge = parseInt(filters.age);
            filtered = filtered.filter(p => p.buildingAge <= maxAge);
        }
    }

    // VR过滤
    if (filters.vr === 'true') {
        filtered = filtered.filter(p => p.isVR);
    }

    // 特殊条件过滤
    const specialConditions = ['no-guarantor', 'furniture', 'parking', 'pet', 'internet', 'two-people'];
    specialConditions.forEach(condition => {
        if (filters[condition] === '1') {
            filtered = filtered.filter(p =>
                p.features.some(f => f.key === condition)
            );
        }
    });

    return filtered;
}

// ===== 渲染房源网格 =====
function renderPropertiesGrid() {
    const grid = document.getElementById('propertiesGrid');
    if (!grid) return;

    const startIndex = (currentPage - 1) * propertiesPerPage;
    const endIndex = startIndex + propertiesPerPage;
    const propertiesToShow = filteredProperties.slice(startIndex, endIndex);

    if (propertiesToShow.length === 0) {
        grid.innerHTML = `
            <div class="empty-state" style="grid-column: 1 / -1;">
                <div class="empty-icon">🔍</div>
                <h3 class="empty-title">
                    <span class="empty-title-ja">条件に合う物件が見つかりませんでした</span>
                    <span class="empty-title-zh" style="display:none">没有找到符合条件的房源</span>
                    <span class="empty-title-en" style="display:none">No properties found matching your criteria</span>
                </h3>
                <p class="empty-description">
                    <span class="empty-desc-ja">検索条件を変更して、再度お試しください。</span>
                    <span class="empty-desc-zh" style="display:none">请修改搜索条件后重试。</span>
                    <span class="empty-desc-en" style="display:none">Please modify your search criteria and try again.</span>
                </p>
                <button class="btn btn-primary" onclick="resetAllSearches()">
                    <span class="btn-ja">検索条件をリセット</span>
                    <span class="btn-zh" style="display:none">重置搜索条件</span>
                    <span class="btn-en" style="display:none">Reset Search Criteria</span>
                </button>
            </div>
        `;
        return;
    }

    grid.innerHTML = propertiesToShow.map(property => createPropertyCard(property)).join('');
}

function createPropertyCard(property) {
    const badges = [];
    if (property.isNew) badges.push('<span class="badge new">新着</span>');
    if (property.isPopular) badges.push('<span class="badge">🔥 人気</span>');
    if (property.isVR) badges.push('<span class="badge vr">VR対応</span>');
    if (property.features.some(f => f.key === 'no-guarantor')) {
        badges.push('<span class="badge no-guarantor">保証人不要</span>');
    }

    const features = property.features.slice(0, 4).map(f =>
        `<span class="feature-tag">${f.icon} ${f.label}</span>`
    ).join('');

    return `
        <div class="property-card" data-property-id="${property.id}">
            <div class="property-images">
                <img src="${property.images[0].url}" alt="${property.images[0].alt}" class="property-image">
                <div class="property-badges">
                    ${badges.join('')}
                </div>
                <div class="property-actions">
                    <button class="action-btn like-btn" onclick="toggleLike(${property.id})" title="お気に入り">
                        ${property.likeCount > 0 ? '❤️' : '🤍'}
                    </button>
                    <button class="action-btn share-btn" onclick="shareProperty(${property.id})" title="シェア">
                        🔗
                    </button>
                </div>
            </div>
            <div class="property-content">
                <div class="property-header">
                    <h3 class="property-title">${property.title}</h3>
                    <p class="property-address">
                        📍 ${property.address}
                    </p>
                </div>
                <div class="property-details">
                    <div class="detail-item">
                        <span class="detail-icon">🚇</span>
                        <span>${property.station}駅 徒歩${property.walkTime}分</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-icon">🏠</span>
                        <span>${property.layout} ${property.size}㎡</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-icon">🏢</span>
                        <span>${property.floor}階/${property.totalFloors}階建</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-icon">📅</span>
                        <span>築${property.buildingAge}年</span>
                    </div>
                </div>
                <div class="property-price">
                    <div class="price-row">
                        <span class="price-main">${property.price.toLocaleString()}</span>
                        <span class="price-unit">万円/月</span>
                    </div>
                    <p class="price-note">
                        <span class="price-note-ja">管理費・共益費別</span>
                        <span class="price-note-zh" style="display:none">管理费·公共费另计</span>
                        <span class="price-note-en" style="display:none">Management fee separate</span>
                    </p>
                </div>
                <div class="property-features">
                    ${features}
                </div>
                <div class="property-footer">
                    <button class="footer-btn" onclick="showPropertyDetails(${property.id})">
                        <span class="footer-btn-ja">詳細を見る</span>
                        <span class="footer-btn-zh" style="display:none">查看详情</span>
                        <span class="footer-btn-en" style="display:none">View Details</span>
                    </button>
                    <button class="footer-btn primary" onclick="contactAboutProperty(${property.id})">
                        <span class="footer-btn-ja">問い合わせ</span>
                        <span class="footer-btn-zh" style="display:none">咨询</span>
                        <span class="footer-btn-en" style="display:none">Inquire</span>
                    </button>
                </div>
            </div>
        </div>
    `;
}

// ===== 排序功能 =====
function initSorting() {
    const sortSelect = document.getElementById('sortSelect');
    if (!sortSelect) return;

    sortSelect.addEventListener('change', function() {
        const sortBy = this.value;
        sortProperties(sortBy);
        renderPropertiesGrid();
        updatePagination();
    });
}

function sortProperties(sortBy) {
    switch (sortBy) {
        case 'price-low':
            filteredProperties.sort((a, b) => a.price - b.price);
            break;
        case 'price-high':
            filteredProperties.sort((a, b) => b.price - a.price);
            break;
        case 'area-large':
            filteredProperties.sort((a, b) => b.size - a.size);
            break;
        case 'station-near':
            filteredProperties.sort((a, b) => a.walkTime - b.walkTime);
            break;
        case 'new':
            filteredProperties.sort((a, b) => b.buildingAge - a.buildingAge);
            break;
        default: // 'new'
            filteredProperties.sort((a, b) => b.id - a.id);
            break;
    }
}

// ===== 推荐标签 =====
function initRecommendedTags() {
    const tagBtns = document.querySelectorAll('.tag-btn');

    tagBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const tag = this.getAttribute('data-tag');
            applyRecommendedTag(tag);
        });
    });
}

function applyRecommendedTag(tag) {
    const filters = {};

    switch (tag) {
        case 'popular':
            filters.isPopular = 'true';
            break;
        case 'new':
            filters.isNew = 'true';
            break;
        case 'no-guarantor':
            filters['no-guarantor'] = '1';
            break;
        case 'vr':
            filters.vr = 'true';
            break;
        case 'furniture':
            filters.furniture = '1';
            break;
        case 'near-station':
            filters.maxWalkTime = '5';
            break;
    }

    // 更新标签状态
    document.querySelectorAll('.tag-btn').forEach(btn => {
        btn.classList.remove('active');
        if (btn.getAttribute('data-tag') === tag) {
            btn.classList.add('active');
        }
    });

    // 执行搜索
    performSearch(filters, 'tag');
}

// ===== 视图切换 =====
function initViewToggle() {
    const viewBtns = document.querySelectorAll('.view-btn');
    const grid = document.getElementById('propertiesGrid');

    viewBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const view = this.getAttribute('data-view');

            // 更新按钮状态
            viewBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');

            // 切换视图
            if (view === 'map') {
                showMapView();
            } else {
                showGridView();
            }
        });
    });
}

function showGridView() {
    const grid = document.getElementById('propertiesGrid');
    if (grid) {
        grid.style.display = 'grid';
        // 隐藏地图容器
        const mapContainer = document.querySelector('.map-container');
        if (mapContainer) {
            mapContainer.style.display = 'none';
        }
    }
}

function showMapView() {
    const grid = document.getElementById('propertiesGrid');
    if (grid) {
        grid.style.display = 'none';

        // 创建或显示地图容器
        let mapContainer = document.querySelector('.map-container');
        if (!mapContainer) {
            mapContainer = createMapContainer();
            grid.parentNode.insertBefore(mapContainer, grid.nextSibling);
        }
        mapContainer.style.display = 'block';

        // 模拟地图加载
        showMapLoading();
    }
}

function createMapContainer() {
    const container = document.createElement('div');
    container.className = 'map-container';
    container.innerHTML = `
        <div class="map-loading">
            <div class="spinner"></div>
            <p>地図を読み込み中...</p>
        </div>
    `;
    return container;
}

function showMapLoading() {
    // 模拟地图加载
    setTimeout(() => {
        const mapContainer = document.querySelector('.map-container');
        if (mapContainer) {
            mapContainer.innerHTML = `
                <div style="width: 100%; height: 100%; background: url('https://picsum.photos/1200/600?random=map') center/cover; display: flex; align-items: center; justify-content: center; position: relative;">
                    <div style="background: rgba(255,255,255,0.9); padding: 2rem; border-radius: 8px; text-align: center;">
                        <h3>インタラクティブ地図</h3>
                        <p>実際のアプリケーションでは、Google Mapsが表示されます</p>
                    </div>
                </div>
            `;
        }
    }, 1500);
}

// ===== 分页 =====
function initPagination() {
    // 上一页
    const prevBtn = document.querySelector('.pagination-btn.prev');
    if (prevBtn) {
        prevBtn.addEventListener('click', () => goToPage(currentPage - 1));
    }

    // 下一页
    const nextBtn = document.querySelector('.pagination-btn.next');
    if (nextBtn) {
        nextBtn.addEventListener('click', () => goToPage(currentPage + 1));
    }

    // 页码按钮
    const pageBtns = document.querySelectorAll('.page-btn');
    pageBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const page = parseInt(this.textContent);
            goToPage(page);
        });
    });
}

function updatePagination() {
    const totalPages = Math.ceil(filteredProperties.length / propertiesPerPage);

    // 更新按钮状态
    const prevBtn = document.querySelector('.pagination-btn.prev');
    const nextBtn = document.querySelector('.pagination-btn.next');

    if (prevBtn) {
        prevBtn.disabled = currentPage === 1;
    }

    if (nextBtn) {
        nextBtn.disabled = currentPage === totalPages;
    }

    // 更新页码
    updatePageNumbers(totalPages);
}

function updatePageNumbers(totalPages) {
    const pageNumbersContainer = document.querySelector('.pagination-numbers');
    if (!pageNumbersContainer) return;

    let pageNumbers = '';

    // 计算显示的页码范围
    let startPage = Math.max(1, currentPage - 2);
    let endPage = Math.min(totalPages, currentPage + 2);

    // 调整范围确保显示7个页码（包括省略号）
    if (endPage - startPage < 4) {
        if (startPage === 1) {
            endPage = Math.min(totalPages, 7);
        } else if (endPage === totalPages) {
            startPage = Math.max(1, totalPages - 6);
        }
    }

    // 第一页
    if (startPage > 1) {
        pageNumbers += '<button class="page-btn" onclick="goToPage(1)">1</button>';
        if (startPage > 2) {
            pageNumbers += '<span class="pagination-ellipsis">...</span>';
        }
    }

    // 中间页码
    for (let i = startPage; i <= endPage; i++) {
        const activeClass = i === currentPage ? 'active' : '';
        pageNumbers += `<button class="page-btn ${activeClass}" onclick="goToPage(${i})">${i}</button>`;
    }

    // 最后一页
    if (endPage < totalPages) {
        if (endPage < totalPages - 1) {
            pageNumbers += '<span class="pagination-ellipsis">...</span>';
        }
        pageNumbers += `<button class="page-btn" onclick="goToPage(${totalPages})">${totalPages}</button>`;
    }

    pageNumbersContainer.innerHTML = pageNumbers;
}

function goToPage(page) {
    const totalPages = Math.ceil(filteredProperties.length / propertiesPerPage);

    if (page < 1 || page > totalPages) return;

    currentPage = page;
    renderPropertiesGrid();
    updatePagination();

    // 滚动到结果顶部
    const resultsSection = document.getElementById('results');
    if (resultsSection) {
        resultsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}

// ===== 房源详情弹窗 =====
function initPropertyModal() {
    const modal = document.getElementById('propertyModal');
    const closeBtn = document.getElementById('closePropertyModal');

    if (closeBtn) {
        closeBtn.addEventListener('click', closePropertyModal);
    }

    if (modal) {
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                closePropertyModal();
            }
        });
    }

    // ESC键关闭
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            closePropertyModal();
        }
    });
}

function showPropertyDetails(propertyId) {
    const property = allProperties.find(p => p.id === propertyId);
    if (!property) return;

    const modal = document.getElementById('propertyModal');
    const modalBody = modal.querySelector('.modal-body');

    modalBody.innerHTML = createPropertyDetailContent(property);
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closePropertyModal() {
    const modal = document.getElementById('propertyModal');
    modal.classList.remove('active');
    document.body.style.overflow = '';
}

function createPropertyDetailContent(property) {
    const badges = [];
    if (property.isNew) badges.push('<span class="badge new">新着</span>');
    if (property.isPopular) badges.push('<span class="badge">🔥 人気</span>');
    if (property.isVR) badges.push('<span class="badge vr">VR対応</span>');

    const images = property.images.map(img =>
        `<img src="${img.url}" alt="${img.alt}" style="width: 100%; border-radius: 8px; margin-bottom: 8px;">`
    ).join('');

    return `
        <div style="max-width: 800px; margin: 0 auto;">
            <!-- 房源图片 -->
            <div style="margin-bottom: 2rem;">
                ${images}
            </div>

            <!-- 基本信息 -->
            <div style="display: grid; grid-template-columns: 2fr 1fr; gap: 2rem; margin-bottom: 2rem;">
                <div>
                    <h2 style="margin-bottom: 1rem;">${property.title}</h2>
                    <p style="color: var(--text-secondary); margin-bottom: 1rem;">📍 ${property.address}</p>
                    <div style="margin-bottom: 1rem;">
                        ${badges.join(' ')}
                    </div>
                </div>
                <div style="text-align: right;">
                    <div style="font-size: 2rem; font-weight: bold; color: var(--primary-dark); margin-bottom: 0.5rem;">
                        ¥${property.price.toLocaleString()}/月
                    </div>
                    <p style="color: var(--text-secondary); font-size: 0.9rem;">
                        管理費・共益費別
                    </p>
                </div>
            </div>

            <!-- 详细信息 -->
            <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 1rem; margin-bottom: 2rem; padding: 1rem; background: var(--bg-tertiary); border-radius: 8px;">
                <div>🏠 間取り: ${property.layout}</div>
                <div>📐 専有面積: ${property.size}㎡</div>
                <div>🚇 最寄り駅: ${property.station}駅</div>
                <div>🚶‍♂️ 徒歩時間: ${property.walkTime}分</div>
                <div>🏢 階数: ${property.floor}階/${property.totalFloors}階建</div>
                <div>📅 築年数: ${property.buildingAge}年</div>
            </div>

            <!-- 特征 -->
            <div style="margin-bottom: 2rem;">
                <h3 style="margin-bottom: 1rem;">特徴</h3>
                <div style="display: flex; flex-wrap: wrap; gap: 0.5rem;">
                    ${property.features.map(f =>
                        `<span style="padding: 0.5rem 1rem; background: var(--bg-secondary); border-radius: 20px; font-size: 0.9rem;">
                            ${f.icon} ${f.label}
                        </span>`
                    ).join('')}
                </div>
            </div>

            <!-- 描述 -->
            <div style="margin-bottom: 2rem;">
                <h3 style="margin-bottom: 1rem;">物件説明</h3>
                <p>${property.description}</p>
            </div>

            <!-- 行动按钮 -->
            <div style="display: flex; gap: 1rem;">
                <button class="btn btn-primary" onclick="contactAboutProperty(${property.id})" style="flex: 1;">
                    お問い合わせ
                </button>
                <button class="btn btn-secondary" onclick="scheduleViewing(${property.id})" style="flex: 1;">
                    内見予約
                </button>
                ${property.isVR ? `
                    <button class="btn btn-outline" onclick="startVRTour(${property.id})" style="flex: 1;">
                        🥽 VR見学
                    </button>
                ` : ''}
            </div>
        </div>
    `;
}

// ===== 交互功能 =====
function toggleLike(propertyId) {
    const property = allProperties.find(p => p.id === propertyId);
    if (property) {
        property.likeCount = property.likeCount > 0 ? 0 : 1;
        renderPropertiesGrid(); // 重新渲染以更新爱心图标
    }
}

function shareProperty(propertyId) {
    const property = allProperties.find(p => p.id === propertyId);
    if (property) {
        const shareUrl = `${window.location.origin}/property/${propertyId}`;

        if (navigator.share) {
            navigator.share({
                title: property.title,
                text: property.description,
                url: shareUrl
            });
        } else {
            // 回退方案：复制链接
            navigator.clipboard.writeText(shareUrl).then(() => {
                showMessage('リンクをクリップボードにコピーしました。', 'success');
            });
        }
    }
}

function contactAboutProperty(propertyId) {
    const property = allProperties.find(p => p.id === propertyId);
    if (property) {
        // 打开联系表单并预填房源信息
        openModal();
        setTimeout(() => {
            const messageField = document.querySelector('textarea[name="message"]');
            if (messageField) {
                messageField.value = `「${property.title}」についてお問い合わせしたいです。`;
            }
        }, 500);
    }
}

function scheduleViewing(propertyId) {
    const property = allProperties.find(p => p.id === propertyId);
    if (property) {
        showMessage(`${property.title}の内見予約を受け付けました。担当者よりご連絡いたします。`, 'success');
    }
}

function startVRTour(propertyId) {
    const property = allProperties.find(p => p.id === propertyId);
    if (property) {
        showMessage('VR見学を開始します。新しいウィンドウで開きます。', 'info');
        // 实际应用中，这里会打开VR查看器
        setTimeout(() => {
            window.open(`/vr-tour/${propertyId}`, '_blank');
        }, 1000);
    }
}

// ===== 重置功能 =====
function resetBasicSearch() {
    const form = document.querySelector('#basic-search .property-search-form');
    if (form) {
        form.reset();
    }
}

function resetAdvancedSearch() {
    const form = document.querySelector('#advanced-search .property-search-form');
    if (form) {
        form.reset();
        // 清除复选框
        form.querySelectorAll('input[type="checkbox"]').forEach(cb => cb.checked = false);
    }
}

function resetCommuteSearch() {
    const form = document.querySelector('#commute-search .commute-search-form');
    if (form) {
        form.reset();
    }
}

function resetAllSearches() {
    resetBasicSearch();
    resetAdvancedSearch();
    resetCommuteSearch();

    // 清除推荐标签
    document.querySelectorAll('.tag-btn').forEach(btn => btn.classList.remove('active'));

    // 重新加载所有房源
    loadProperties();
}

// ===== 工具函数 =====
function showSearchLoading() {
    const grid = document.getElementById('propertiesGrid');
    if (grid) {
        grid.innerHTML = `
            <div class="loading-overlay" style="grid-column: 1 / -1;">
                <div class="loading-spinner"></div>
                <div class="loading-text">検索中...</div>
            </div>
        `;
    }
}

function hideSearchLoading() {
    // 加载状态会在渲染房源时自动消失
}

function updateResultsCount(count) {
    const countElement = document.querySelector('.results-count');
    if (countElement) {
        countElement.innerHTML = `
            <span class="count-ja">${count.toLocaleString()}件の物件が見つかりました</span>
            <span class="count-zh" style="display:none">找到${count.toLocaleString()}套房源</span>
            <span class="count-en" style="display:none">Found ${count.toLocaleString()} properties</span>
        `;
    }
}

function scrollToResults() {
    const resultsSection = document.getElementById('results');
    if (resultsSection) {
        resultsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}

// ===== 语言切换（搜索页面特有） =====
function initSearchPageLanguage() {
    // 搜索页面的语言切换逻辑
    updateSearchPageLanguage(getCurrentLanguage());
}

function updateSearchPageLanguage(lang) {
    // 更新搜索页面的所有文本
    const elements = {
        '.breadcrumb-ja': { zh: '首页', en: 'Home' },
        '.current-ja': { zh: '房源搜索', en: 'Property Search' },
        '.title-ja': { zh: '房源搜索', en: 'Property Search' },
        '.subtitle-ja': { zh: 'VR看房・8语言支持・无需保证人房源众多', en: 'VR Tours · 8 Languages · Many No-Guarantor Properties' },
        // 可以继续添加更多映射...
    };

    // 简化的语言切换逻辑
    document.querySelectorAll('[class*="-ja"]').forEach(el => {
        const className = Array.from(el.classList).find(c => c.endsWith('-ja'));
        if (className && elements[className]) {
            const translation = elements[className][lang];
            if (translation) {
                // 这里可以根据需要更新元素内容
                el.style.display = lang === 'ja' ? '' : 'none';
            }
        }
    });
}