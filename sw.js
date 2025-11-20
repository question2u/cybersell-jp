// ===== Service Worker for PWA Functionality =====

const CACHE_NAME = 'nisshin-real-estate-v1';
const RUNTIME_CACHE = 'nisshin-runtime-v1';
const STATIC_CACHE = 'nisshin-static-v1';

// 需要缓存的静态资源
const STATIC_ASSETS = [
    '/',
    '/index.html',
    '/property-search.html',
    '/vr-tour.html',
    '/services.html',
    '/foreigner-guide.html',
    '/about.html',
    '/css/style.css',
    '/css/responsive.css',
    '/css/property-search.css',
    '/css/vr-tour.css',
    '/css/services.css',
    '/css/foreigner-guide.css',
    '/css/about.css',
    '/js/main.js',
    '/js/property-search.js',
    '/js/vr-tour.js',
    '/js/services.js',
    '/js/foreigner-guide.js',
    '/js/about.js',
    '/js/seo-optimization.js',
    '/images/nisshin-logo.png',
    '/images/nisshin-logo-white.png',
    '/images/favicon.ico',
    '/images/apple-touch-icon.png'
];

// 需要缓存的API响应
const API_CACHE_PATTERN = /^https:\/\/api\./;

// Service Worker安装
self.addEventListener('install', event => {
    console.log('Service Worker: Installing...');

    event.waitUntil(
        caches.open(STATIC_CACHE)
            .then(cache => {
                console.log('Service Worker: Caching static assets');
                return cache.addAll(STATIC_ASSETS);
            })
            .then(() => {
                console.log('Service Worker: Installation complete');
                return self.skipWaiting();
            })
            .catch(error => {
                console.error('Service Worker: Installation failed:', error);
            })
    );
});

// Service Worker激活
self.addEventListener('activate', event => {
    console.log('Service Worker: Activating...');

    event.waitUntil(
        caches.keys()
            .then(cacheNames => {
                return Promise.all(
                    cacheNames.map(cacheName => {
                        // 删除旧版本缓存
                        if (cacheName !== STATIC_CACHE &&
                            cacheName !== RUNTIME_CACHE &&
                            cacheName !== STATIC_CACHE) {
                            console.log('Service Worker: Deleting old cache:', cacheName);
                            return caches.delete(cacheName);
                        }
                    })
                );
            })
            .then(() => {
                console.log('Service Worker: Activation complete');
                return self.clients.claim();
            })
    );
});

// 网络请求拦截
self.addEventListener('fetch', event => {
    const request = event.request;
    const url = new URL(request.url);

    // 跳过Chrome扩展请求
    if (url.protocol === 'chrome-extension:') {
        return;
    }

    // 处理API请求
    if (API_CACHE_PATTERN.test(url)) {
        event.respondWith(handleAPIRequest(request));
        return;
    }

    // 处理静态资源请求
    if (STATIC_ASSETS.some(asset => request.url.includes(asset))) {
        event.respondWith(handleStaticRequest(request));
        return;
    }

    // 处理导航请求
    if (request.mode === 'navigate') {
        event.respondWith(handleNavigationRequest(request));
        return;
    }

    // 其他请求使用网络优先策略
    event.respondWith(
        fetch(request)
            .catch(() => {
                // 网络失败时尝试从缓存获取
                return caches.match(request);
            })
    );
});

// 处理API请求 - 网络优先，缓存备用
function handleAPIRequest(request) {
    return fetch(request)
        .then(response => {
            // 只缓存成功的GET请求
            if (request.method === 'GET' && response.ok) {
                const responseClone = response.clone();
                caches.open(RUNTIME_CACHE)
                    .then(cache => {
                        cache.put(request, responseClone);
                    });
            }
            return response;
        })
        .catch(() => {
            // 网络失败时从缓存获取
            return caches.match(request)
                .then(cachedResponse => {
                    if (cachedResponse) {
                        console.log('API request served from cache:', request.url);
                        return cachedResponse;
                    }
                    throw new Error('API request failed and no cache available');
                });
        });
}

// 处理静态资源请求 - 缓存优先
function handleStaticRequest(request) {
    return caches.match(request)
        .then(cachedResponse => {
            if (cachedResponse) {
                // 后台更新缓存
                updateCache(request);
                return cachedResponse;
            }

            // 缓存中没有则从网络获取
            return fetch(request)
                .then(response => {
                    if (response.ok) {
                        const responseClone = response.clone();
                        caches.open(STATIC_CACHE)
                            .then(cache => {
                                cache.put(request, responseClone);
                            });
                    }
                    return response;
                });
        });
}

// 处理导航请求
function handleNavigationRequest(request) {
    return caches.match(request)
        .then(cachedResponse => {
            if (cachedResponse) {
                return cachedResponse;
            }

            return fetch(request)
                .then(response => {
                    if (response.ok) {
                        const responseClone = response.clone();
                        caches.open(RUNTIME_CACHE)
                            .then(cache => {
                                cache.put(request, responseClone);
                            });
                    }
                    return response;
                })
                .catch(() => {
                    // 导航请求失败，返回离线页面
                    return caches.match('/index.html');
                });
        });
}

// 后台更新缓存
function updateCache(request) {
    fetch(request)
        .then(response => {
            if (response.ok) {
                caches.open(STATIC_CACHE)
                    .then(cache => {
                        cache.put(request, response);
                    });
            }
        })
        .catch(error => {
            console.log('Background cache update failed:', error);
        });
}

// 消息处理
self.addEventListener('message', event => {
    if (event.data && event.data.type === 'SKIP_WAITING') {
        self.skipWaiting();
    }

    if (event.data && event.data.type === 'GET_VERSION') {
        event.ports[0].postMessage({ version: CACHE_NAME });
    }
});

// 后台同步
self.addEventListener('sync', event => {
    if (event.tag === 'background-sync') {
        event.waitUntil(doBackgroundSync());
    }
});

// 后台同步操作
function doBackgroundSync() {
    return new Promise((resolve, reject) => {
        // 这里可以实现后台数据同步逻辑
        console.log('Background sync completed');
        resolve();
    });
}

// 推送通知
self.addEventListener('push', event => {
    const options = {
        body: event.data ? event.data.text() : '您有新的房源信息',
        icon: '/images/nisshin-logo.png',
        badge: '/images/favicon.ico',
        tag: 'nisshin-notification',
        renotify: true,
        requireInteraction: false,
        actions: [
            {
                action: 'view',
                title: '查看详情'
            },
            {
                action: 'dismiss',
                title: '关闭'
            }
        ]
    };

    event.waitUntil(
        self.registration.showNotification('日清不动产', options)
    );
});

// 通知点击处理
self.addEventListener('notificationclick', event => {
    event.notification.close();

    if (event.action === 'view') {
        // 打开应用或特定页面
        event.waitUntil(
            clients.openWindow('/')
        );
    } else if (event.action === 'dismiss') {
        // 关闭通知
        event.waitUntil(
            self.registration.getNotifications()
                .then(notifications => {
                    notifications.forEach(notification => notification.close());
                })
        );
    } else {
        // 默认点击行为
        event.waitUntil(
            clients.openWindow('/')
        );
    }
});

// 缓存清理
function cleanupCache() {
    return caches.keys().then(cacheNames => {
        return Promise.all(
            cacheNames.map(cacheName => {
                if (!STATIC_ASSETS.some(asset => cacheName.includes(asset))) {
                    return caches.delete(cacheName);
                }
            })
        );
    });
}

// 定期缓存清理（每天执行一次）
const CACHE_CLEANUP_INTERVAL = 24 * 60 * 60 * 1000; // 24小时

setInterval(() => {
    console.log('Performing periodic cache cleanup...');
    cleanupCache().then(() => {
        console.log('Cache cleanup completed');
    });
}, CACHE_CLEANUP_INTERVAL);

// 存储配额检查
function checkStorageQuota() {
    if ('storage' in navigator && 'estimate' in navigator.storage) {
        navigator.storage.estimate().then(estimate => {
            const usage = estimate.usage;
            const quota = estimate.quota;
            const usagePercentage = (usage / quota) * 100;

            console.log(`Storage usage: ${Math.round(usage / 1048576)}MB of ${Math.round(quota / 1048576)}MB (${Math.round(usagePercentage)}%)`);

            // 如果使用超过80%的配额，清理缓存
            if (usagePercentage > 80) {
                console.log('Storage usage high, cleaning cache...');
                cleanupCache();
            }
        });
    }
}

// 检查存储配额
checkStorageQuota();

// 错误处理
self.addEventListener('error', event => {
    console.error('Service Worker error:', event.error);
});

// 未处理的Promise拒绝
self.addEventListener('unhandledrejection', event => {
    console.error('Unhandled promise rejection:', event.reason);
    event.preventDefault();
});

// 导出Service Worker方法供外部调用
self.addEventListener('install', () => {
    self.skipWaiting();
});

self.addEventListener('activate', event => {
    event.waitUntil(clients.claim());
});