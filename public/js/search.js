// Data Beauty Lab 搜索脚本
(function() {
  'use strict';
  
  const Search = {
    // 搜索索引数据（简化版，实际可以从searchindex.json加载）
    index: [],
    
    // 初始化
    init: function() {
      console.log('搜索脚本加载成功');
      
      // 1. 处理搜索按钮点击
      const searchBtn = document.querySelector('.search-button');
      const searchModal = document.querySelector('.search-modal');
      
      if (searchBtn && searchModal) {
        searchBtn.addEventListener('click', function() {
          searchModal.classList.add('active');
          const input = searchModal.querySelector('input[type="search"]');
          if (input) {
            input.focus();
            // 如果有URL参数，填充搜索框
            const urlParams = new URLSearchParams(window.location.search);
            const q = urlParams.get('q');
            if (q) input.value = q;
          }
        });
        
        // 关闭按钮
        const closeBtn = searchModal.querySelector('.search-close');
        if (closeBtn) {
          closeBtn.addEventListener('click', function() {
            searchModal.classList.remove('active');
          });
        }
        
        // 点击模态框外部关闭
        searchModal.addEventListener('click', function(e) {
          if (e.target === this) {
            this.classList.remove('active');
          }
        });
      }
      
      // 2. 处理搜索表单提交
      const searchForms = document.querySelectorAll('form[action*="search"]');
      searchForms.forEach(form => {
        form.addEventListener('submit', function(e) {
          const input = this.querySelector('input[type="search"]');
          if (input && !input.value.trim()) {
            e.preventDefault();
            input.focus();
          }
        });
      });
      
      // 3. 如果有搜索关键词，显示简单结果
      this.showSimpleResults();
    },
    
    // 显示简单搜索结果
    showSimpleResults: function() {
      const urlParams = new URLSearchParams(window.location.search);
      const query = urlParams.get('q');
      
      if (query && window.location.pathname.includes('/search')) {
        const resultsContainer = document.querySelector('.search-results');
        if (resultsContainer) {
          // 简单模拟搜索
          const articles = Array.from(document.querySelectorAll('article'));
          const matched = articles.filter(article => {
            const text = article.textContent.toLowerCase();
            return text.includes(query.toLowerCase());
          });
          
          if (matched.length > 0) {
            resultsContainer.innerHTML = `
              <h3>找到 ${matched.length} 个结果：</h3>
              <p>关键词: <strong>${query}</strong></p>
              <div class="search-result-list">
                ${matched.map(article => {
                  const title = article.querySelector('h2, h1, .post-title')?.textContent || '无标题';
                  const link = article.querySelector('a')?.href || '#';
                  const excerpt = article.textContent.substring(0, 150) + '...';
                  return `
                    <div class="search-result-item">
                      <h4><a href="${link}">${title}</a></h4>
                      <p>${excerpt}</p>
                    </div>
                  `;
                }).join('')}
              </div>
            `;
          } else {
            resultsContainer.innerHTML = `
              <h3>未找到相关结果</h3>
              <p>没有找到包含 "<strong>${query}</strong>" 的文章。</p>
              <p>建议：</p>
              <ul>
                <li>检查拼写是否正确</li>
                <li>尝试其他关键词</li>
                <li>浏览<a href="/categories/">分类</a>或<a href="/tags/">标签</a></li>
              </ul>
            `;
          }
        }
      }
    }
  };
  
  // 页面加载完成后初始化
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => Search.init());
  } else {
    Search.init();
  }
})();