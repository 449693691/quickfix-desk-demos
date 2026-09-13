'use strict';

const STORAGE_KEY = 'mojian-notes-demo-v1';
const $ = (id) => document.getElementById(id);
const language = window.mojianLanguage;
const t = language.text;
const labels = { all: '全部笔记', starred: '我的收藏', archived: '已归档', 灵感: '灵感碎片', 阅读: '阅读与摘录', 生活: '日常生活' };
const seedNotes = [
  { id: 'september', title: '写给九月的一页', category: '灵感', starred: true, archived: false, cover: true, updated: '2026-09-13T06:30:00+08:00', body: '今天醒得比平时早了一点。窗外的光很轻，像有人把世界的音量调小了。\n\n想试着把注意力还给那些很小的事情：\n一杯慢慢变凉的茶，一段没有目的的散步，\n还有脑海里突然冒出来、还来不及命名的想法。\n\n不用急着把每一页写满。\n留一点空白，新的东西才有地方生长。' },
  { id: 'small-things', title: '关于「少一点」的设计', category: '灵感', starred: true, archived: false, cover: false, updated: '2026-09-12T18:10:00+08:00', body: '好的界面，不一定需要更多的功能。\n有时候，先让一个动作变得自然，就已经足够。\n\n删掉一行解释之前，先确认它的意思已经被布局说清楚。\n给按钮留出呼吸的距离，给文字留下被读完的时间。\n\n下一次设计时，问问自己：\n这件事还能不能再简单一点？' },
  { id: 'reading', title: '阅读时，想留下的几句话', category: '阅读', starred: false, archived: false, cover: false, updated: '2026-09-11T20:30:00+08:00', body: '不是书中的引文，只是读完之后自己的小小回声。\n\n理解一件事，有时不靠把它解释得更长，\n而是终于能用自己的话，说出最重要的一句。\n\n下次翻开书，先读十页，不着急记下所有内容。\n合上书后还留在心里的，才值得回到这里。' },
  { id: 'weekend', title: '一个不太满的周末', category: '生活', starred: false, archived: false, cover: false, updated: '2026-09-10T11:20:00+08:00', body: '周末的小计划\n\n· 去熟悉的街角，买一束不熟悉的花。\n· 留一个下午，把房间的书重新排一排。\n· 做一顿不用看手机的晚餐。\n· 如果下雨，就安心待在家里。\n\n没有完成的部分，也不算辜负。' },
  { id: 'colors', title: '从散步里收集颜色', category: '灵感', starred: false, archived: false, cover: false, updated: '2026-09-09T16:40:00+08:00', body: '今天的颜色不是从色卡上来的。\n\n苔藓的绿，比想象中更安静。\n干燥的树皮，有一点温柔的灰。\n下午四点的阳光，让米白色显得像一张旧信纸。\n\n把这些放在一起，也许能做出一个让人愿意停留的空间。' },
  { id: 'booklist', title: '下一本想读的书', category: '阅读', starred: false, archived: false, cover: false, updated: '2026-09-08T09:00:00+08:00', body: '先不急着列长长的清单。\n\n想找一本适合慢慢读的书：\n可以在某一页停下来，也可以过几天再接着读。\n\n这一页先留着，遇到喜欢的名字再写进来。' },
  { id: 'august', title: '八月，先收在这里', category: '生活', starred: false, archived: true, cover: false, updated: '2026-08-31T21:00:00+08:00', body: '这个月留下了几件小事。\n\n它们不需要每天被看见，但也不用被删掉。\n归档的意义，大概就是给过去找一个安静的位置。' },
];

let notes = seedNotes.map((note) => language.seed(note));
let selectedId = notes[0].id;
let filter = 'all';
let query = '';
let preview = false;
let canStore = true;
let lastArchived = null;
let toastTimer;

try {
  const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null');
  if (saved && Array.isArray(saved.notes) && saved.notes.length && saved.notes.every((note) =>
    note && typeof note.id === 'string' && typeof note.title === 'string' && typeof note.body === 'string' &&
    ['灵感', '阅读', '生活'].includes(note.category) && typeof note.updated === 'string' &&
    Number.isFinite(Date.parse(note.updated)) && typeof note.starred === 'boolean' && typeof note.archived === 'boolean')) {
    notes = saved.notes;
    selectedId = notes.some((note) => note.id === saved.selectedId) ? saved.selectedId : notes[0].id;
  }
} catch (_) { canStore = false; }

function currentNote() { return notes.find((note) => note.id === selectedId); }
function sizeBody() {
  const body = $('note-body');
  body.style.height = 'auto';
  body.style.height = `${Math.max(205, body.scrollHeight)}px`;
}
function formatDate(value) { return new Intl.DateTimeFormat(language.locale, { month: 'long', day: 'numeric' }).format(new Date(value)); }
function setSaveStatus() {
  $('save-status').classList.toggle('error', !canStore);
  $('save-status').querySelector('span').textContent = t(canStore ? '已保存' : '未能保存，请导出');
}
function persist() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ notes, selectedId }));
    canStore = true;
  } catch (_) { canStore = false; }
  setSaveStatus();
}
function matchesFilter(note) {
  if (filter === 'archived') return note.archived;
  if (note.archived) return false;
  if (filter === 'starred') return note.starred;
  return filter === 'all' || note.category === filter;
}
function visibleNotes() {
  return notes.filter((note) => matchesFilter(note) && `${note.title}\n${note.body}`.toLocaleLowerCase().includes(query.toLocaleLowerCase()))
    .sort((a, b) => Number(b.starred) - Number(a.starred) || Date.parse(b.updated) - Date.parse(a.updated));
}
function addText(parent, className, text) {
  const span = document.createElement('span');
  span.className = className;
  span.textContent = text;
  parent.append(span);
  return span;
}
function addStar(parent) {
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('aria-hidden', 'true');
  const use = document.createElementNS('http://www.w3.org/2000/svg', 'use');
  use.setAttribute('href', '#i-star');
  svg.append(use);
  parent.append(svg);
}
function renderList() {
  const visible = visibleNotes();
  const fragment = document.createDocumentFragment();
  for (const note of visible) {
    const button = document.createElement('button');
    button.className = `note-card${note.id === selectedId ? ' selected' : ''}`;
    button.setAttribute('aria-label', `${t('打开笔记：')}${note.title || t('无标题笔记')}`);
    button.setAttribute('aria-pressed', String(note.id === selectedId));
    const title = addText(button, 'card-title', '');
    addText(title, 'title-text', note.title || t('无标题笔记'));
    if (note.starred) addStar(title);
    addText(button, 'card-excerpt', note.body.trim() || t('还没有正文，从一句话开始。'));
    const footer = addText(button, 'card-footer', '');
    addText(footer, 'card-category', t(note.category));
    addText(footer, 'card-date', formatDate(note.updated));
    button.addEventListener('click', () => selectNote(note.id, true));
    fragment.append(button);
  }
  $('note-list').replaceChildren(fragment);
  $('visible-count').textContent = visible.length;
  $('list-title').firstChild.textContent = `${t(labels[filter])} `;
  $('crumb').textContent = t(labels[filter]);
  $('empty-list').hidden = visible.length > 0;
  $('empty-message').textContent = t(query ? '没有找到相符的标题或正文，换个词试试。' : '这里还没有笔记，新的想法随时可以开始。');
  $('clear-search').hidden = !query;
  for (const count of document.querySelectorAll('[data-count]')) {
    const mode = count.dataset.count;
    count.textContent = notes.filter((note) => mode === 'archived' ? note.archived : !note.archived &&
      (mode === 'all' || (mode === 'starred' ? note.starred : note.category === mode))).length;
  }
  for (const nav of document.querySelectorAll('[data-filter]')) {
    nav.classList.toggle('active', nav.dataset.filter === filter);
    nav.setAttribute('aria-current', nav.dataset.filter === filter ? 'page' : 'false');
  }
  $('mobile-filter').value = filter;
}
function renderEditor() {
  const note = currentNote();
  $('editor').hidden = !note;
  $('no-selection').hidden = Boolean(note);
  if (!note) return;
  $('note-title').value = note.title;
  $('note-body').value = note.body;
  $('note-preview').textContent = note.body || t('这一页还是空白。');
  $('note-category').value = note.category;
  $('note-date').textContent = formatDate(note.updated);
  $('word-count').textContent = language.count(note.body);
  $('note-cover').hidden = !note.cover;
  $('star-note').setAttribute('aria-pressed', String(note.starred));
  $('star-note').setAttribute('aria-label', t(note.starred ? '取消收藏' : '收藏笔记'));
  $('star-note').title = t(note.starred ? '取消收藏' : '收藏笔记');
  $('archive-note').setAttribute('aria-label', t(note.archived ? '移出归档' : '归档笔记'));
  $('archive-note').title = t(note.archived ? '移出归档' : '归档笔记');
  $('note-body').hidden = preview;
  $('note-preview').hidden = !preview;
  $('note-title').readOnly = preview;
  $('note-category').disabled = preview;
  $('edit-mode').setAttribute('aria-pressed', String(!preview));
  $('preview-mode').setAttribute('aria-pressed', String(preview));
  if (!preview) sizeBody();
  setSaveStatus();
}
function selectNote(id, openMobile = false) {
  selectedId = id;
  preview = false;
  renderList();
  renderEditor();
  if (openMobile) {
    document.body.dataset.mobileView = 'editor';
    if (matchMedia('(max-width:680px)').matches) window.scrollTo({ top: 0 });
    requestAnimationFrame(sizeBody);
  }
  persist();
}
function changeFilter(value) {
  filter = value;
  const visible = visibleNotes();
  if (!visible.some((note) => note.id === selectedId)) selectedId = visible[0]?.id || null;
  preview = false;
  renderList();
  renderEditor();
  document.body.dataset.mobileView = 'list';
}
function notify(message, allowUndo = false) {
  clearTimeout(toastTimer);
  $('toast-message').dataset.original = message;
  $('toast-message').textContent = t(message);
  $('undo-archive').hidden = !allowUndo;
  $('toast').hidden = false;
  toastTimer = setTimeout(() => { $('toast').hidden = true; }, allowUndo ? 10000 : 4000);
}
function createNote() {
  const id = crypto.randomUUID();
  const category = ['灵感', '阅读', '生活'].includes(filter) ? filter : '灵感';
  notes.unshift({ id, title: '', body: '', category, starred: false, archived: false, cover: false, updated: new Date().toISOString() });
  filter = 'all'; query = ''; $('search').value = '';
  selectNote(id, true);
  $('note-title').focus();
}

for (const nav of document.querySelectorAll('[data-filter]')) nav.addEventListener('click', () => changeFilter(nav.dataset.filter));
$('mobile-filter').addEventListener('change', (event) => changeFilter(event.target.value));
$('new-note').addEventListener('click', createNote);
$('empty-new').addEventListener('click', createNote);
$('search').addEventListener('input', (event) => { query = event.target.value.trim(); changeFilter(filter); });
$('clear-search').addEventListener('click', () => { query = ''; $('search').value = ''; changeFilter(filter); $('search').focus(); });
$('back-to-list').addEventListener('click', () => { document.body.dataset.mobileView = 'list'; document.querySelector('.note-card[aria-pressed="true"]')?.focus({ preventScroll: true }); });
for (const [id, field] of [['note-title', 'title'], ['note-body', 'body'], ['note-category', 'category']]) {
  $(id).addEventListener('input', (event) => {
    const note = currentNote(); if (!note) return;
    note[field] = event.target.value;
    note.updated = new Date().toISOString();
    if (field === 'category' && !matchesFilter(note)) filter = note.category;
    $('word-count').textContent = language.count(note.body);
    $('note-date').textContent = formatDate(note.updated);
    if (field === 'body') sizeBody();
    renderList(); persist();
  });
}
$('edit-mode').addEventListener('click', () => { preview = false; renderEditor(); });
$('preview-mode').addEventListener('click', () => { preview = true; renderEditor(); });
$('star-note').addEventListener('click', () => { const note = currentNote(); if (!note) return; note.starred = !note.starred; if (filter === 'starred' && !note.starred) selectedId = visibleNotes()[0]?.id || null; renderList(); renderEditor(); persist(); });
$('archive-note').addEventListener('click', () => {
  const note = currentNote(); if (!note) return;
  lastArchived = { id: note.id, archived: note.archived };
  note.archived = !note.archived;
  notify(note.archived ? '笔记已放入归档' : '笔记已移回全部笔记', true);
  changeFilter(filter); persist();
});
$('undo-archive').addEventListener('click', () => {
  if (!lastArchived) return;
  const note = notes.find((item) => item.id === lastArchived.id);
  if (note) { note.archived = lastArchived.archived; selectedId = note.id; filter = note.archived ? 'archived' : 'all'; query = ''; $('search').value = ''; renderList(); renderEditor(); persist(); }
  lastArchived = null; $('toast').hidden = true;
});
$('export-note').addEventListener('click', () => {
  const note = currentNote(); if (!note) return;
  const blob = new Blob([`${note.title || t('无标题笔记')}\n\n${note.body}\n`], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url; anchor.download = `${(note.title || t('无标题笔记')).replace(/[<>:"/\\|?*\u0000-\u001f]/g, '-').slice(0,80)}.txt`;
  anchor.click(); setTimeout(() => URL.revokeObjectURL(url), 1000); notify('已导出这篇笔记');
});
$('interface-language').addEventListener('change', (event) => {
  language.setLocale(event.target.value);
  renderList();
  renderEditor();
  if (!$('toast').hidden) $('toast-message').textContent = t($('toast-message').dataset.original);
});
document.addEventListener('keydown', (event) => {
  if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') {
    event.preventDefault(); document.body.dataset.mobileView = 'list'; $('search').focus();
  }
});
window.addEventListener('resize', () => { if (currentNote() && !preview) sizeBody(); });
if (/Mac|iPhone|iPad/.test(navigator.platform)) document.querySelector('.search-box kbd').textContent = '⌘ K';
if (!visibleNotes().some((note) => note.id === selectedId)) selectedId = visibleNotes()[0]?.id || null;
renderList();
renderEditor();
