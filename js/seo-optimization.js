// ===== SEO和性能优化专用JavaScript =====

document.addEventListener('DOMContentLoaded', function() {
    // 初始化所有优化功能
    initImageLazyLoading();
    initPrefetchResources();
    initPageLoadOptimizations();
    initAnalytics();
    initStructuredDataEnhancements();
    initPerformanceMonitoring();
});

// ===== 图片懒加载 =====
function initImageLazyLoading() {
    // 支持原生懒加载
    if ('loading' in HTMLImageElement.prototype) {
        const images = document.querySelectorAll('img[data-src]');
        images.forEach(img => {
            img.src = img.dataset.src;
            img.classList.add('loaded');
        });
        return;
    }

    // 交叉观察器实现懒加载
    const lazyImages = document.querySelectorAll('img[data-src]');

    if (lazyImages.length === 0) return;

    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;

                // 创建新图片对象预加载
                const newImg = new Image();
                newImg.onload = () => {
                    img.src = img.dataset.src;
                    img.classList.add('loaded');
                    imageObserver.unobserve(img);
                };
                newImg.onerror = () => {
                    // 加载失败时显示默认图片
                    img.src = 'images/placeholder.jpg';
                    img.classList.add('error');
                    imageObserver.unobserve(img);
                };
                newImg.src = img.dataset.src;
            }
        });
    }, {
        rootMargin: '50px 0px', // 提前50px开始加载
        threshold: 0.1
    });

    lazyImages.forEach(img => {
        imageObserver.observe(img);
    });
}

// ===== 资源预加载 =====
function initPrefetchResources() {
    // 预加载关键页面
    const criticalPages = [
        'property-search.html',
        'services.html',
        'vr-tour.html',
        'foreigner-guide.html'
    ];

    // 页面空闲时预加载
    if ('requestIdleCallback' in window) {
        requestIdleCallback(() => {
            criticalPages.forEach(page => {
                const link = document.createElement('link');
                link.rel = 'prefetch';
                link.href = page;
                document.head.appendChild(link);
            });
        });
    }

    // 预连接到外部域名
    const externalDomains = [
        'https://fonts.googleapis.com',
        'https://fonts.gstatic.com'
    ];

    externalDomains.forEach(domain => {
        const link = document.createElement('link');
        link.rel = 'preconnect';
        link.href = domain;
        document.head.appendChild(link);
    });

    // DNS预解析
    const dnsPrefetchDomains = [
        'https://www.google-analytics.com',
        'https://www.googletagmanager.com'
    ];

    dnsPrefetchDomains.forEach(domain => {
        const link = document.createElement('link');
        link.rel = 'dns-prefetch';
        link.href = domain;
        document.head.appendChild(link);
    });
}

// ===== 页面加载优化 =====
function initPageLoadOptimizations() {
    // 延迟加载非关键CSS
    setTimeout(() => {
        const nonCriticalCSS = [
            // 可以在这里添加非关键CSS文件
        ];

        nonCriticalCSS.forEach(cssFile => {
            const link = document.createElement('link');
            link.rel = 'stylesheet';
            link.href = cssFile;
            link.media = 'print';
            link.onload = () => {
                link.media = 'all';
            };
            document.head.appendChild(link);
        });
    }, 2000);

    // 优化第三方脚本加载
    const thirdPartyScripts = [
        // Google Analytics
        {
            src: 'https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID',
            async: true,
            defer: true
        }
        // 可以添加其他第三方脚本
    ];

    // 页面加载完成后加载第三方脚本
    window.addEventListener('load', () => {
        setTimeout(() => {
            thirdPartyScripts.forEach(script => {
                const scriptElement = document.createElement('script');
                Object.keys(script).forEach(key => {
                    if (key !== 'innerHTML') {
                        scriptElement[key] = script[key];
                    }
                });
                if (script.innerHTML) {
                    scriptElement.innerHTML = script.innerHTML;
                }
                document.head.appendChild(scriptElement);
            });
        }, 1000);
    });
}

// ===== Google Analytics =====
function initAnalytics() {
    // 检查是否已配置Google Analytics
    if (typeof gtag !== 'undefined') {
        // 自定义事件跟踪
        initCustomEventTracking();
        return;
    }

    // 如果没有配置，提供基本的页面访问跟踪
    console.log('Google Analytics not configured. Consider adding gtag.js for tracking.');
}

function initCustomEventTracking() {
    // 跟踪页面停留时间
    let startTime = Date.now();

    window.addEventListener('beforeunload', () => {
        const timeOnPage = Math.round((Date.now() - startTime) / 1000);
        gtag('event', 'time_on_page', {
            'event_category': 'engagement',
            'value': timeOnPage,
            'custom_parameter': window.location.pathname
        });
    });

    // 跟踪表单提交
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
        form.addEventListener('submit', () => {
            gtag('event', 'form_submit', {
                'event_category': 'conversion',
                'form_id': form.id || 'unknown',
                'form_location': window.location.pathname
            });
        });
    });

    // 跟踪按钮点击
    const trackableButtons = document.querySelectorAll('[data-track]');
    trackableButtons.forEach(button => {
        button.addEventListener('click', () => {
            gtag('event', 'button_click', {
                'event_category': 'interaction',
                'button_text': button.textContent.trim(),
                'button_id': button.id || 'unknown'
            });
        });
    });
}

// ===== 结构化数据增强 =====
function initStructuredDataEnhancements() {
    // 动态生成面包屑结构化数据
    const breadcrumb = document.querySelector('.breadcrumb');
    if (breadcrumb) {
        const breadcrumbItems = breadcrumb.querySelectorAll('a');
        if (breadcrumbItems.length > 0) {
            const breadcrumbStructuredData = {
                '@context': 'https://schema.org',
                '@type': 'BreadcrumbList',
                'itemListElement': []
            };

            breadcrumbItems.forEach((item, index) => {
                breadcrumbStructuredData.itemListElement.push({
                    '@type': 'ListItem',
                    'position': index + 1,
                    'name': item.textContent.trim(),
                    'item': item.href
                });
            });

            // 添加当前页面
            const currentPage = document.querySelector('.breadcrumb-current');
            if (currentPage) {
                breadcrumbStructuredData.itemListElement.push({
                    '@type': 'ListItem',
                    'position': breadcrumbItems.length + 1,
                    'name': currentPage.textContent.trim()
                });
            }

            // 插入到页面
            const script = document.createElement('script');
            script.type = 'application/ld+json';
            script.textContent = JSON.stringify(breadcrumbStructuredData);
            document.head.appendChild(script);
        }
    }

    // 动态生成FAQ结构化数据（如果页面有FAQ）
    const faqItems = document.querySelectorAll('.faq-item');
    if (faqItems.length > 0) {
        const faqStructuredData = {
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            'mainEntity': []
        };

        faqItems.forEach(item => {
            const question = item.querySelector('.faq-question h4');
            const answer = item.querySelector('.faq-answer p');

            if (question && answer) {
                faqStructuredData.mainEntity.push({
                    '@type': 'Question',
                    'name': question.textContent.trim(),
                    'acceptedAnswer': {
                        '@type': 'Answer',
                        'text': answer.textContent.trim()
                    }
                });
            }
        });

        if (faqStructuredData.mainEntity.length > 0) {
            const script = document.createElement('script');
            script.type = 'application/ld+json';
            script.textContent = JSON.stringify(faqStructuredData);
            document.head.appendChild(script);
        }
    }
}

// ===== 性能监控 =====
function initPerformanceMonitoring() {
    // 监控页面加载性能
    if ('performance' in window) {
        window.addEventListener('load', () => {
            setTimeout(() => {
                const perfData = performance.getEntriesByType('navigation')[0];
                if (perfData) {
                    const metrics = {
                        'dns_lookup': Math.round(perfData.domainLookupEnd - perfData.domainLookupStart),
                        'tcp_connect': Math.round(perfData.connectEnd - perfData.connectStart),
                        'server_response': Math.round(perfData.responseStart - perfData.requestStart),
                        'dom_load': Math.round(perfData.domContentLoadedEventEnd - perfData.domContentLoadedEventStart),
                        'page_load': Math.round(perfData.loadEventEnd - perfData.loadEventStart),
                        'total_load_time': Math.round(perfData.loadEventEnd - perfData.startTime)
                    };

                    // 记录到控制台（开发环境）
                    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
                        console.log('Performance Metrics:', metrics);
                    }

                    // 发送到分析服务（如果可用）
                    if (typeof gtag !== 'undefined') {
                        gtag('event', 'page_performance', {
                            'event_category': 'performance',
                            'custom_map': {
                                'dimension1': 'total_load_time',
                                'dimension2': 'server_response',
                                'dimension3': 'dom_load'
                            },
                            'total_load_time': metrics.total_load_time,
                            'server_response': metrics.server_response,
                            'dom_load': metrics.dom_load
                        });
                    }
                }
            }, 0);
        });
    }

    // 监控长任务
    if ('PerformanceObserver' in window) {
        const longTaskObserver = new PerformanceObserver((list) => {
            const entries = list.getEntries();
            entries.forEach(entry => {
                if (entry.duration > 50) { // 超过50ms的任务
                    console.warn('Long task detected:', {
                        duration: entry.duration,
                        startTime: entry.startTime,
                        name: entry.name
                    });

                    // 可以发送到分析服务
                    if (typeof gtag !== 'undefined') {
                        gtag('event', 'long_task', {
                            'event_category': 'performance',
                            'value': Math.round(entry.duration),
                            'custom_parameter': entry.name
                        });
                    }
                }
            });
        });

        try {
            longTaskObserver.observe({ entryTypes: ['longtask'] });
        } catch (e) {
            console.log('Long task observation not supported');
        }
    }

    // 监控内存使用（Chrome支持）
    if ('memory' in performance) {
        setInterval(() => {
            const memoryInfo = performance.memory;
            const memoryUsage = {
                used: Math.round(memoryInfo.usedJSHeapSize / 1048576) + ' MB',
                total: Math.round(memoryInfo.totalJSHeapSize / 1048576) + ' MB',
                limit: Math.round(memoryInfo.jsHeapSizeLimit / 1048576) + ' MB'
            };

            // 只在开发环境显示
            if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
                console.log('Memory Usage:', memoryUsage);
            }
        }, 30000); // 每30秒检查一次
    }
}

// ===== SEO优化功能 =====

// 自动生成描述
function generateMetaDescription() {
    const existingMetaDesc = document.querySelector('meta[name="description"]');
    if (existingMetaDesc && existingMetaDesc.getAttribute('data-auto-generated') === 'true') {
        return;
    }

    // 如果没有描述，从页面内容自动生成
    if (!existingMetaDesc || !existingMetaDesc.content) {
        const h1 = document.querySelector('h1');
        const firstParagraph = document.querySelector('p');

        let description = '';

        if (h1) {
            description += h1.textContent.trim() + ' - ';
        }

        if (firstParagraph) {
            description += firstParagraph.textContent.trim().substring(0, 150);
        }

        if (description.length > 0) {
            const meta = document.createElement('meta');
            meta.name = 'description';
            meta.content = description;
            meta.setAttribute('data-auto-generated', 'true');
            document.head.appendChild(meta);
        }
    }
}

// 优化标题标签
function optimizeTitleTag() {
    const title = document.title;
    const siteName = '日清不动产 Nisshin Real Estate';

    // 如果标题没有包含网站名称，添加它
    if (!title.includes(siteName)) {
        document.title = title + ' | ' + siteName;
    }

    // 确保标题长度在合理范围内（50-60字符）
    if (document.title.length > 60) {
        document.title = document.title.substring(0, 57) + '...';
    }
}

// 自动生成关键词
function generateMetaKeywords() {
    const existingKeywords = document.querySelector('meta[name="keywords"]');
    if (existingKeywords) {
        return;
    }

    // 从页面内容提取关键词
    const textContent = document.body.textContent.toLowerCase();
    const commonWords = ['的', '了', '和', '是', '在', '我', '有', '你', '他', '她', '它', '们', '这个', '那个', 'the', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by'];

    const words = textContent
        .replace(/[^\w\s\u4e00-\u9fff]/g, ' ')
        .split(/\s+/)
        .filter(word => word.length > 1 && !commonWords.includes(word));

    // 统计词频
    const wordCount = {};
    words.forEach(word => {
        wordCount[word] = (wordCount[word] || 0) + 1;
    });

    // 获取前10个高频词
    const keywords = Object.keys(wordCount)
        .sort((a, b) => wordCount[b] - wordCount[a])
        .slice(0, 10)
        .join(', ');

    if (keywords) {
        const meta = document.createElement('meta');
        meta.name = 'keywords';
        meta.content = keywords;
        document.head.appendChild(meta);
    }
}

// 添加Canonical URL
function addCanonicalURL() {
    let canonicalLink = document.querySelector('link[rel="canonical"]');

    if (!canonicalLink) {
        canonicalLink = document.createElement('link');
        canonicalLink.rel = 'canonical';
        canonicalLink.href = window.location.href;
        document.head.appendChild(canonicalLink);
    }
}

// 添加Open Graph标签
function addOpenGraphTags() {
    const existingOgTitle = document.querySelector('meta[property="og:title"]');
    const existingOgDesc = document.querySelector('meta[property="og:description"]');

    if (!existingOgTitle) {
        const meta = document.createElement('meta');
        meta.property = 'og:title';
        meta.content = document.title;
        document.head.appendChild(meta);
    }

    if (!existingOgDesc) {
        const meta = document.createElement('meta');
        meta.property = 'og:description';
        meta.content = document.querySelector('meta[name="description"]')?.content || '';
        document.head.appendChild(meta);
    }

    // 添加其他OG标签
    const ogTags = [
        { property: 'og:type', content: 'website' },
        { property: 'og:url', content: window.location.href },
        { property: 'og:site_name', content: '日清不动产 Nisshin Real Estate' },
        { property: 'og:locale', content: 'zh_CN' }
    ];

    ogTags.forEach(tag => {
        const existing = document.querySelector(`meta[property="${tag.property}"]`);
        if (!existing) {
            const meta = document.createElement('meta');
            meta.property = tag.property;
            meta.content = tag.content;
            document.head.appendChild(meta);
        }
    });
}

// 执行SEO优化
function executeSEOOptimizations() {
    generateMetaDescription();
    optimizeTitleTag();
    generateMetaKeywords();
    addCanonicalURL();
    addOpenGraphTags();
}

// 页面加载完成后执行SEO优化
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', executeSEOOptimizations);
} else {
    executeSEOOptimizations();
}

// ===== 服务工作者注册（用于PWA功能）=====
function registerServiceWorker() {
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
            navigator.serviceWorker.register('/sw.js')
                .then(registration => {
                    console.log('SW registered: ', registration);
                })
                .catch(registrationError => {
                    console.log('SW registration failed: ', registrationError);
                });
        });
    }
}

// 注册服务工作者（如果存在）
registerServiceWorker();

// ===== 添加CSS样式支持 =====
const style = document.createElement('style');
style.textContent = `
    /* 懒加载图片样式 */
    img[data-src] {
        opacity: 0;
        transition: opacity 0.3s ease;
    }

    img.loaded {
        opacity: 1;
    }

    img.error {
        opacity: 0.5;
        background: #f0f0f0;
    }

    /* 性能监控指示器 */
    .performance-indicator {
        position: fixed;
        bottom: 20px;
        right: 20px;
        background: rgba(0, 0, 0, 0.8);
        color: white;
        padding: 8px 12px;
        border-radius: 4px;
        font-size: 12px;
        z-index: 9999;
        display: none;
    }

    /* 团队成员弹窗样式 */
    .team-member-modal {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.8);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10000;
        padding: 20px;
    }

    .team-member-modal .modal-content {
        background: white;
        border-radius: 12px;
        max-width: 600px;
        width: 100%;
        max-height: 80vh;
        overflow-y: auto;
    }

    .team-member-modal .modal-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 20px;
        border-bottom: 1px solid #eee;
    }

    .team-member-modal .modal-header h3 {
        margin: 0;
        color: #1e3a8a;
    }

    .team-member-modal .modal-close {
        background: none;
        border: none;
        font-size: 24px;
        cursor: pointer;
        color: #666;
    }

    .team-member-modal .modal-body {
        padding: 20px;
    }

    .member-detail-position {
        font-size: 18px;
        font-weight: 600;
        color: #f59e0b;
        margin-bottom: 20px;
    }

    .member-detail-languages,
    .member-detail-bio {
        margin-bottom: 20px;
    }

    .member-detail-languages h4,
    .member-detail-bio h4 {
        font-size: 16px;
        font-weight: 600;
        color: #1e3a8a;
        margin-bottom: 10px;
    }

    .languages-list {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
    }

    .languages-list .lang-badge {
        background: #e5e7eb;
        color: #374151;
        padding: 4px 8px;
        border-radius: 12px;
        font-size: 12px;
    }

    /* 响应式优化 */
    @media (max-width: 767px) {
        .team-member-modal .modal-content {
            margin: 10px;
        }

        .performance-indicator {
            font-size: 10px;
            padding: 6px 10px;
        }
    }

    /* 预加载指示器 */
    .preloader {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: white;
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 9999;
        transition: opacity 0.3s ease;
    }

    .preloader.hidden {
        opacity: 0;
        pointer-events: none;
    }

    .preloader-spinner {
        width: 40px;
        height: 40px;
        border: 4px solid #f3f3f3;
        border-top: 4px solid #1e3a8a;
        border-radius: 50%;
        animation: spin 1s linear infinite;
    }

    @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
    }
`;
document.head.appendChild(style);

// ===== 预加载器 =====
function initPreloader() {
    const preloader = document.createElement('div');
    preloader.className = 'preloader';
    preloader.innerHTML = '<div class="preloader-spinner"></div>';
    document.body.appendChild(preloader);

    window.addEventListener('load', () => {
        setTimeout(() => {
            preloader.classList.add('hidden');
            setTimeout(() => {
                preloader.remove();
            }, 300);
        }, 500);
    });
}

// 启用预加载器（可选）
// initPreloader();

// ===== 导出优化功能供其他脚本使用 =====
window.SEOSOptimization = {
    showPerformanceIndicator: function(text) {
        let indicator = document.querySelector('.performance-indicator');
        if (!indicator) {
            indicator = document.createElement('div');
            indicator.className = 'performance-indicator';
            document.body.appendChild(indicator);
        }

        indicator.textContent = text;
        indicator.style.display = 'block';

        setTimeout(() => {
            indicator.style.display = 'none';
        }, 5000);
    },

    trackCustomEvent: function(eventName, parameters = {}) {
        if (typeof gtag !== 'undefined') {
            gtag('event', eventName, {
                'event_category': 'custom',
                ...parameters
            });
        }
    },

    lazyLoadImage: function(img) {
        if ('loading' in HTMLImageElement.prototype) {
            img.src = img.dataset.src;
        } else {
            const observer = new IntersectionObserver((entries) => {
                if (entries[0].isIntersecting) {
                    img.src = img.dataset.src;
                    observer.unobserve(img);
                }
            });
            observer.observe(img);
        }
    }
};