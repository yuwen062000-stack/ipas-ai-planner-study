/* 本檔案依各章資料動態產生科目二講義頁，統一導覽、表格、卡片與名詞搜尋行為。 */
(() => {
  const key = document.body.dataset.chapter;
  const chapter = window.SUBJECT2_CHAPTERS?.[key];
  if (!chapter) {
    document.body.innerHTML = '<main style="padding:3rem;font-family:sans-serif"><h1>找不到章節資料</h1></main>';
    return;
  }

  // 將資料陣列轉成既有講義版型所需的卡片、流程與表格。
  const cards = (items = []) => items.length ? `<div class="cards">${items.map((item, index) => `<article class="card"><span class="number">${item[0] || String(index + 1).padStart(2, '0')}</span><h3>${item[1]}</h3><p>${item[2]}</p></article>`).join('')}</div>` : '';
  const flow = (items = []) => items.length ? `<div class="flow">${items.map(item => `<div class="flow-step"><b>${item[0]}</b><span>${item[1]}</span></div>`).join('')}</div>` : '';
  const table = (data) => data ? `<div class="table-wrap"><table><thead><tr>${data.headers.map(h => `<th>${h}</th>`).join('')}</tr></thead><tbody>${data.rows.map(row => `<tr>${row.map(cell => `<td>${cell}</td>`).join('')}</tr>`).join('')}</tbody></table></div>` : '';
  const note = (data) => data ? `<div class="study-note"><h3>${data[0]}</h3><span class="formula">${data[1]}</span>${data[2] ? `<p>${data[2]}</p>` : ''}</div>` : '';

  const glossaryNumber = String(chapter.sections.length + 1).padStart(2, '0');
  const nav = chapter.sections.map((section, index) => `<a href="#s${index + 1}">${String(index + 1).padStart(2, '0')} ${section.short || section.title}</a>`).join('') + `<a href="#glossary">${glossaryNumber} 名詞總表</a>`;
  const sectionHtml = chapter.sections.map((section, index) => `<section id="s${index + 1}"><div class="section-head"><h2>${String(index + 1).padStart(2, '0')}｜${section.title}</h2><span class="meta">${section.meta || chapter.pages}</span></div>${section.lead ? `<p class="lead">${section.lead}</p>` : ''}${flow(section.flow)}${cards(section.cards)}${table(section.table)}${section.html || ''}${note(section.note)}</section>`).join('');
  const glossaryRows = chapter.terms.map(term => `<tr class="term"><td>${term[0]}${term[1] ? `<span class="term-en">${term[1]}</span>` : ''}</td><td>${term[2]}</td></tr>`).join('');

  document.body.innerHTML = `<div class="layout"><aside class="sidebar" aria-label="本頁目錄"><div class="brand"><div class="brand-mark">${chapter.number}</div><div><small>iPAS 中級・科目二</small><strong>${chapter.shortTitle}</strong></div></div><div class="toc-title">章節導覽</div><nav class="toc">${nav}</nav><div class="sidebar-note">官方科目二講義 ${chapter.pages} 為主；iSpan 講義作為相關機器學習應用補充。</div></aside><main><header class="hero" data-mark="${chapter.mark}"><p class="eyebrow">Subject 02 · Chapter ${chapter.number}</p><h1>${chapter.title}</h1><p>${chapter.summary}</p><div class="hero-meta"><span class="chip">官方 ${chapter.pages}</span><span class="chip">${chapter.sections.length} 個學習區塊</span><span class="chip">易混淆辨析</span><span class="chip">名詞可搜尋</span></div></header><div class="source-banner"><strong>整理原則：</strong>官方科目二學習指引是本頁定義與分類主軸；iSpan 補充只用於連結機器學習情境，不取代官方內容。<div class="source-key"><span class="source-tag official">官方主軸</span><span class="source-tag ispan">iSpan 應用補充</span></div></div>${sectionHtml}<section id="glossary"><div class="section-head"><h2>${glossaryNumber}｜名詞總表</h2><span class="meta">可即時搜尋</span></div><div class="search-panel"><input id="term-search" type="search" placeholder="搜尋本章名詞或英文……" aria-label="搜尋名詞"><span id="search-count" class="search-count">顯示全部</span></div><details open><summary>${chapter.title}核心名詞</summary><div class="table-wrap"><table><thead><tr><th>名詞</th><th>本章定義</th></tr></thead><tbody>${glossaryRows}</tbody></table></div></details><div id="no-results" class="no-results">找不到符合的名詞，請換一個關鍵字。</div></section><footer>科目二・${chapter.number} ${chapter.title}｜${chapter.footer}</footer></main></div>`;

  // 名詞表搜尋同時更新符合筆數與空結果狀態。
  const input = document.querySelector('#term-search');
  const terms = [...document.querySelectorAll('.term')];
  const count = document.querySelector('#search-count');
  const empty = document.querySelector('#no-results');
  function filterTerms() {
    const keyword = input.value.trim().toLocaleLowerCase('zh-Hant');
    let visible = 0;
    terms.forEach(row => {
      const matched = !keyword || row.textContent.toLocaleLowerCase('zh-Hant').includes(keyword);
      row.hidden = !matched;
      if (matched) visible += 1;
    });
    count.textContent = keyword ? `${visible} 筆符合` : `共 ${terms.length} 筆`;
    empty.style.display = visible ? 'none' : 'block';
  }
  input.addEventListener('input', filterTerms);
  filterTerms();
})();
