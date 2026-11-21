/* 帖子附件面板：由 posts.json 的 assets 字段驱动
   帖子里放一个 <section class="assets" id="assets" hidden></section>，
   本脚本按当前文件名推出发帖编号，读取 ../posts.json 并渲染附件列表。
   读不到清单（例如以 file:// 打开）时保持隐藏，不影响正文。 */
(function () {
  'use strict';

  var box = document.getElementById('assets');
  if (!box) return;

  var id = (location.pathname.split('/').pop() || '')
    .replace(/\.html$/i, '').toLowerCase();
  if (!/^[0-9a-f]{8}$/.test(id)) return;
  if (location.protocol === 'file:') return;

  var KINDS = {
    png: 'IMG', jpg: 'IMG', jpeg: 'IMG', gif: 'IMG', svg: 'SVG', webp: 'IMG',
    cpp: 'CPP', cc: 'CPP', c: 'C', h: 'H', hpp: 'H',
    txt: 'TXT', md: 'MD', py: 'PY', java: 'JAVA',
    json: 'JSON', csv: 'CSV', pdf: 'PDF', zip: 'ZIP'
  };

  function el(tag, cls, text) {
    var node = document.createElement(tag);
    if (cls) node.className = cls;
    if (text) node.textContent = text;
    return node;
  }

  function clean(list) {
    if (!Array.isArray(list)) return [];
    return list.filter(function (a) {
      return a && typeof a.file === 'string' && /^[A-Za-z0-9._-]+$/.test(a.file);
    }).map(function (a) {
      var ext = a.file.split('.').pop().toLowerCase();
      return {
        file: a.file,
        name: String(a.name || a.file),
        note: String(a.note || ''),
        ext: KINDS[ext] || (ext.length <= 4 ? ext.toUpperCase() : 'FILE'),
        size: String(a.size || '')
      };
    });
  }

  function render(assets) {
    if (!assets.length) return;
    box.textContent = '';
    box.removeAttribute('hidden');

    box.appendChild(el('h2', 'assets-title', '附件 · ' + assets.length));

    var list = el('ul', 'asset-list');
    assets.forEach(function (a) {
      var row = el('a', 'asset-row');
      row.href = '../postassets/' + id + '/' + encodeURIComponent(a.file);
      row.setAttribute('download', a.file);

      row.appendChild(el('span', 'asset-ext', a.ext));

      var main = el('span', 'asset-main');
      main.appendChild(el('span', 'asset-name', a.name));
      if (a.note) main.appendChild(el('span', 'asset-note', a.note));
      row.appendChild(main);

      if (a.size) row.appendChild(el('span', 'asset-size', a.size));
      list.appendChild(row);
    });

    box.appendChild(list);
  }

  fetch('../posts.json', { cache: 'no-store' }).then(function (res) {
    if (!res.ok) return null;
    return res.json().then(function (data) {
      var posts = Array.isArray(data) ? data
        : (data && Array.isArray(data.posts) ? data.posts : []);
      var hit = null;
      posts.forEach(function (p) {
        if (!hit && String(p.id || '').toLowerCase() === id) hit = p;
      });
      render(clean(hit && hit.assets));
    });
  }).catch(function () { /* 清单不可达时静默跳过 */ });
}());
