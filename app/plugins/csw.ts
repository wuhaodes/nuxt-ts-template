try {
  if (location.protocol.indexOf('https') === 0) {
    // 取消所有 Service Worker 注册
    navigator.serviceWorker.getRegistrations().then(registrations => {
      for (const registration of registrations)
        registration.unregister().then()
    })

    // 删除所有 Cache Storage
    caches.keys().then(cacheNames => {
      for (const cacheName of cacheNames)
        caches.delete(cacheName).then()
    })
  }
} catch (e) {
  console.log('cse执行失败:', e)
}
