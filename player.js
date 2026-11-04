// Shared player: controls, pseudocode and iteration views. Each page supplies its steps and main visual.
const ALGOS = {}; // filled by the files in algos/
const $ = id => document.getElementById(id);
const fmt = a => '[' + a.join(', ') + ']';
const LIST_ERROR = 'Enter 2 to 16 whole numbers, up to 3 digits each, separated by commas.';
const ROW = 48, NODE_H = 36;
const LANGS = [['cpp', 'C++'], ['java', 'Java'], ['python', 'Python']];
let cfg, run, at = 0, timer = null;

function parseList(text) {
  const parts = text.split(/[\s,]+/).filter(Boolean);
  const ok = parts.length >= 2 && parts.length <= 16 && parts.every(p => /^-?\d{1,3}$/.test(p));
  return ok ? parts.map(Number) : null;
}

function isSortedRun(r) {
  const a = r.steps[r.steps.length - 1].A;
  return a.every((v, i) => !i || a[i - 1] <= v);
}

function slots(values, cls) {
  return values.map((v, i) => {
    const c = cls(i);
    return `<div class="slot ${c.cls || ''}"><small>${c.top ?? ''}</small><span class="cell">${v}</span><small class="ptr">${c.ptr || ''}</small></div>`;
  }).join('');
}

function renderTree(s, cellClass = () => '') {
  const n = s.A.length;
  const depth = Math.max(...run.nodes.map(x => x.d));
  const centre = x => ((x.lo + x.hi + 1) / 2 / n * 100) + '%';
  let lines = '';
  run.nodes.forEach((p, pi) => {
    if (!s.nodes[pi]) return;
    run.nodes.forEach((c, ci) => {
      if (!s.nodes[ci] || c.d !== p.d + 1 || c.lo < p.lo || c.hi > p.hi) return;
      lines += `<line class="${s.nodes[ci].state !== 'todo' ? 'on' : ''}" x1="${centre(p)}" y1="${p.d * ROW + NODE_H}" x2="${centre(c)}" y2="${c.d * ROW}"/>`;
    });
  });
  $('tree').style.height = (depth * ROW + NODE_H) + 'px';
  $('tree').innerHTML = `<svg aria-hidden="true">${lines}</svg>` + run.nodes.map((x, i) => {
    const st = s.nodes[i];
    if (!st) return '';
    const len = x.hi - x.lo + 1;
    const cells = Array.from({ length: len }, (_, c) => {
      const v = st.vals && st.vals[c] !== null ? st.vals[c] : '';
      return `<span class="${cellClass(x, st, c)}">${v}</span>`;
    }).join('');
    return `<div class="node ${st.state}${s.cur === x.key ? ' current' : ''}" title="A[${x.lo}..${x.hi}]"
      style="left:${x.lo / n * 100}%;width:${len / n * 100}%;top:${x.d * ROW}px"><div>${cells}</div></div>`;
  }).join('');
}

// Draws circles joined by lines. Nodes: { x (percent), y (px), label, cls }. Edges: { a, b, off } use node indexes.
function renderGraph(nodes, edges, height) {
  const tall = height || Math.max(...nodes.map(n => n.y)) + 34;
  $('graph').style.height = tall + 'px';
  const lines = edges.map(e => {
    const a = nodes[e.a], b = nodes[e.b];
    return `<line class="${e.off ? 'off' : ''}" x1="${a.x}%" y1="${a.y + 17}" x2="${b.x}%" y2="${b.y + 17}"/>`;
  }).join('');
  $('graph').innerHTML = `<svg aria-hidden="true">${lines}</svg>` + nodes.map(n =>
    `<span class="gnode ${n.cls}" style="left:${n.x}%;top:${n.y}px">${n.label}</span>`).join('');
}

// One row per outer-loop pass: p = { label, note, vals, from, to, mark } (from..to are shown as sorted).
function renderPasses(s) {
  $('passes').innerHTML = s.passes.length
    ? s.passes.map(p => {
        const last = p.vals.length - 1;
        const cells = p.vals.map((v, i) => {
          const c = [];
          if (i === 0) c.push('first');
          if (i === last) c.push('last');
          if (i === p.mark) c.push('mid');
          else if (i >= p.from && i <= p.to) c.push('hit');
          return `<span class="${c.join(' ')}">${v}</span>`;
        }).join('');
        return `<div class="pass"><div class="pass-note"><b>${p.label}</b>${p.note}</div><div class="pass-cells">${cells}</div></div>`;
      }).join('')
    : '<div class="empty" style="min-height:90px">Each finished pass appears here.</div>';
}

function startPlayer(config) {
  cfg = config;
  const shell = document.createElement('div');
  shell.className = 'app';
  shell.innerHTML = `
  <main class="main">
    <div class="head">
      <div>
        <p class="eyebrow"><a class="back" href="${cfg.backHref || 'index.html'}">← ${cfg.backLabel || 'All visualizations'}</a></p>
        <h1 class="title-row">${cfg.title}${cfg.divideAndConquer ? '<span class="tag">Divide &amp; conquer</span>' : ''}</h1>
      </div>
      <form id="form">
        <input id="input" type="text" spellcheck="false" aria-label="List">
        ${cfg.targetLabel ? `<input id="target" class="field-target" type="text" spellcheck="false" aria-label="${cfg.targetLabel}" placeholder="${cfg.targetLabel}">` : ''}
        <button class="pill">${cfg.targetLabel ? 'Search' : 'Use list'}</button>
        <p class="error" id="error" role="alert"></p>
      </form>
    </div>
    <section class="card now">
      <div class="now-text" aria-live="polite"><small id="nowMeta"></small><span id="nowText"></span></div>
      <div class="controls">
        <div class="transport">
          <button id="restart" class="tbtn"><span>Restart</span><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 12a9 9 0 1 0 3-6.7L3 8"/><path d="M3 3v5h5"/></svg></button>
          <button id="back" class="tbtn" title="Left arrow"><span>Back</span><svg viewBox="0 0 24 24" aria-hidden="true"><path d="m15 5-7 7 7 7"/></svg></button>
          <button id="play" class="tbtn primary" title="Space"></button>
          <button id="next" class="tbtn" title="Right arrow"><span>Next</span><svg viewBox="0 0 24 24" aria-hidden="true"><path d="m9 5 7 7-7 7"/></svg></button>
        </div>
        <label class="field grow">
          <span class="count" id="count"></span>
          <input id="scrub" type="range" min="0" value="0">
        </label>
        <label class="field">
          <span>Speed</span>
          <select id="speed" class="pill">
            <option value="1500">Slow</option>
            <option value="800" selected>Normal</option>
            <option value="250">Fast</option>
          </select>
        </label>
      </div>
    </section>
    ${cfg.sections}
  </main>
  <aside class="side">
    <div class="seg">
      <button id="tabCode" aria-pressed="true">Pseudocode</button>
      <button id="tabList" aria-pressed="false">Iterations</button>
      <button id="tabViz" aria-pressed="false">Visualization</button>
      <button id="tabSrc" aria-pressed="false">Code</button>
    </div>
    <div class="pane pane-trace" id="paneCode">
      <div class="code listing" id="code"></div>
      <div class="src-view" id="srcView" hidden>
        <div class="seg lang" id="langs" role="group" aria-label="Programming language">
          ${LANGS.map(([id, name]) => `<button type="button" data-lang="${id}">${name}</button>`).join('')}
        </div>
        <div class="code listing" id="src"></div>
      </div>
      <div class="vars">
        <p class="label">Variables</p>
        <div class="chips" id="vars"></div>
        <p class="label">Call stack</p>
        <ul class="stack" id="stack"></ul>
      </div>
    </div>
    <div class="pane" id="paneList" hidden><ol class="rows" id="rows"></ol></div>
    <div class="pane" id="paneViz" hidden><div class="overview" id="overview"></div></div>
  </aside>`;
  document.body.prepend(shell);

  $('code').innerHTML = cfg.pseudo.map((t, i) =>
    `<div data-line="${i + 1}"><b>${i + 1}</b><span>${t.replace(/</g, '&lt;') || ' '}</span></div>`).join('');
  showLanguage(savedLanguage());
  $('langs').onclick = e => { const b = e.target.closest('button'); if (b) showLanguage(b.dataset.lang); };

  $('play').onclick = () => timer ? stop() : start();
  $('next').onclick = () => { stop(); go(at + 1); };
  $('back').onclick = () => { stop(); go(at - 1); };
  $('restart').onclick = () => { stop(); go(0); };
  $('scrub').oninput = e => { stop(); go(+e.target.value); };
  $('speed').onchange = () => { if (timer) { stop(); start(); } };
  $('tabCode').onclick = () => setView('code');
  $('tabSrc').onclick = () => setView('src');
  $('tabViz').onclick = () => setView('viz');
  $('tabList').onclick = () => setView('list');
  $('rows').onclick = e => { const b = e.target.closest('button'); if (b) { stop(); go(+b.dataset.i); } };
  $('form').onsubmit = e => { e.preventDefault(); submit(); };
  document.addEventListener('keydown', e => {
    if (['INPUT', 'SELECT'].includes(e.target.tagName)) return;
    if (e.key === 'ArrowRight') { e.preventDefault(); $('next').click(); }
    if (e.key === 'ArrowLeft') { e.preventDefault(); $('back').click(); }
    if (e.key === ' ' && e.target.tagName !== 'BUTTON') { e.preventDefault(); $('play').click(); }
  });

  $('input').value = cfg.initial;
  if (cfg.targetLabel) $('target').value = cfg.initialTarget;
  submit();
}

function submit() {
  const parsed = cfg.parse($('input').value, cfg.targetLabel ? $('target').value : undefined);
  $('error').textContent = parsed.error || '';
  if (parsed.error) return;
  $('input').value = parsed.text;
  stop();
  run = cfg.build(parsed.data);
  if (cfg.check) console.assert(cfg.check(run), cfg.title + ' failed its check');
  at = 0;
  $('scrub').max = run.steps.length - 1;
  $('rows').innerHTML = run.steps.map((s, i) => `<li><button data-i="${i}" class="${s.major ? 'major' : ''}">
    <span class="n">${i + 1}</span><span>${s.line ? `Line ${s.line}: ` : ''}${s.text}</span><code>${s.output}</code></button></li>`).join('');
  renderOverview();
  render();
}

function renderOverview() {
  const rows = cfg.overview(run);
  $('overview').innerHTML = (rows.note ? `<p class="ov-note">${rows.note}</p>` : '') + rows.map(r => {
    const groups = r.groups.map(g => `<span class="ov-g">[${g.map(c =>
      typeof c === 'object' ? `<i class="${c.c}">${c.v}</i>` : c).join(', ')}]</span>`).join('');
    return `<div class="ov-row"><div class="ov-groups">${groups}</div><p>${r.label}</p></div>`;
  }).join('');
}

// Whole-algorithm rows for algorithms that record a list of passes.
function overviewFromPasses(r) {
  const last = r.steps[r.steps.length - 1];
  const rows = [{ label: 'Start', groups: [r.steps[0].A] }];
  last.passes.forEach(p => rows.push({
    label: `${p.label}: ${p.note}`,
    groups: [p.vals.map((v, i) => i === p.mark ? { v, c: 'v' } : i >= p.from && i <= p.to ? { v, c: 'g' } : v)],
  }));
  return rows;
}

function render() {
  const s = run.steps[at];
  $('count').textContent = `Iteration ${at + 1} of ${run.steps.length}`;
  $('scrub').value = at;
  $('back').disabled = at === 0;
  $('next').disabled = at === run.steps.length - 1;
  $('nowMeta').textContent = s.line ? `Line ${s.line}: ${cfg.pseudo[s.line - 1].trim()}` : 'Done';
  $('nowText').textContent = s.text;

  document.querySelectorAll('#code .on').forEach(e => e.classList.remove('on'));
  if (s.line) {
    const line = document.querySelector(`#code [data-line="${s.line}"]`);
    line.classList.add('on');
    keepVisible(line, $('code'));
  }
  markSource(s.line);
  $('vars').innerHTML = Object.entries(s.vars).map(([k, v]) => `<span>${k} = ${v}</span>`).join('');
  $('stack').innerHTML = s.stack.length ? s.stack.map(c => `<li>${c}</li>`).join('') : '<li>(empty)</li>';

  document.querySelectorAll('#rows .on').forEach(e => e.classList.remove('on'));
  const row = document.querySelector(`#rows [data-i="${at}"]`);
  row.classList.add('on');
  keepVisible(row, $('paneList'));

  cfg.render(s);
}

function keepVisible(row, pane) {
  if (pane.hidden || pane.offsetParent === null) return;
  const r = row.getBoundingClientRect(), p = pane.getBoundingClientRect();
  if (r.top < p.top) pane.scrollTop -= p.top - r.top + 8;
  else if (r.bottom > p.bottom) pane.scrollTop += r.bottom - p.bottom + 8;
}

function savedLanguage() {
  try {
    const saved = localStorage.getItem('codeLanguage');
    return LANGS.some(([id]) => id === saved) ? saved : 'cpp';
  } catch { return 'cpp'; }
}

function showLanguage(lang) {
  try { localStorage.setItem('codeLanguage', lang); } catch {}
  document.querySelectorAll('#langs button').forEach(b => b.setAttribute('aria-pressed', b.dataset.lang === lang));
  const lines = cfg.code[lang].replace(/^\n/, '').split('\n');
  $('src').innerHTML = lines.map((l, i) => {
    const bar = l.indexOf('|');
    const text = l.slice(bar + 1).replace(/&/g, '&amp;').replace(/</g, '&lt;');
    return `<div data-src="${l.slice(0, bar) || 0}"><b>${i + 1}</b><span>${text || ' '}</span></div>`;
  }).join('');
  $('src').scrollTop = 0;
  if (run) markSource(run.steps[at].line);
}

function markSource(line) {
  document.querySelectorAll('#src .on').forEach(e => e.classList.remove('on'));
  if (!line) return;
  const src = document.querySelectorAll(`#src [data-src="${line}"]`);
  src.forEach(e => e.classList.add('on'));
  if (src.length) keepVisible(src[0], $('src'));
}

function go(i) { at = Math.max(0, Math.min(run.steps.length - 1, i)); render(); }
function setPlay(playing) {
  $('play').innerHTML = playing
    ? '<span>Pause</span><svg viewBox="0 0 24 24" aria-hidden="true"><rect x="6" y="5" width="4" height="14" rx="1"/><rect x="14" y="5" width="4" height="14" rx="1"/></svg>'
    : '<span>Play</span><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 5v14l12-7z"/></svg>';
}
function stop() { clearInterval(timer); timer = null; setPlay(false); }
function start() {
  if (at === run.steps.length - 1) go(0);
  setPlay(true);
  timer = setInterval(() => { if (at >= run.steps.length - 1) stop(); else go(at + 1); }, +$('speed').value);
}
function setView(v) {
  $('tabCode').setAttribute('aria-pressed', v === 'code');
  $('tabSrc').setAttribute('aria-pressed', v === 'src');
  $('tabList').setAttribute('aria-pressed', v === 'list');
  $('tabViz').setAttribute('aria-pressed', v === 'viz');
  $('paneCode').hidden = v === 'list' || v === 'viz';
  $('code').hidden = v !== 'code';
  $('srcView').hidden = v !== 'src';
  $('paneList').hidden = v !== 'list';
  $('paneViz').hidden = v !== 'viz';
  const box = { code: 'code', src: 'src', list: 'rows' }[v];
  const on = box && document.querySelector(`#${box} .on`);
  if (on) on.scrollIntoView({ block: 'center' });
}
