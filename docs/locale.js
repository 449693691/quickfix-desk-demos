'use strict';

(() => {
  const preferenceKey = 'mojian-interface-language-v1';
  const supported = (value) => value === 'en' || value === 'zh';
  const requested = new URL(location.href).searchParams.get('lang');
  let preferred;
  try { preferred = localStorage.getItem(preferenceKey); } catch (_) { /* Optional preference. */ }
  let locale = supported(requested) ? requested : supported(preferred) ? preferred :
    navigator.language.toLowerCase().startsWith('zh') ? 'zh' : 'en';

  const english = {
    '跳转到工作区': 'Skip to workspace',
    '笔记导航': 'Notes navigation',
    '木间': 'Mojian',
    '我的空间': 'My space',
    '全部笔记': 'All notes',
    '我的收藏': 'Favorites',
    '已归档': 'Archive',
    '主题手帐': 'Topics',
    '灵感碎片': 'Inspiration',
    '阅读与摘录': 'Books & reading',
    '日常生活': 'Everyday life',
    '不必每个想法，': 'Every idea deserves ',
    '都有一个去处。': 'a little space.',
    '先把它写下来就好。': 'Start by writing it down.',
    'Seda 的手帐': 'Seda’s notebook',
    '个人空间 · 交互样例': 'Personal space · interactive study',
    '浏览器内保存': 'Stored in this browser',
    'Seda · AI 协作样例': 'Seda · AI-assisted study',
    '给想法留一点空间': 'Make room for your thoughts',
    '。': '.',
    '随手记下的片刻，也值得被好好收藏。': 'Little moments are worth keeping.',
    '新建笔记': 'New note',
    '查看': 'View',
    '笔记工作台': 'Notes workspace',
    '寻找一个想法…': 'Find a thought…',
    '搜索笔记': 'Search notes',
    '最近编辑': 'Recently edited',
    '笔记列表': 'Note list',
    '这里还没有笔记': 'No notes here yet',
    '写下第一个想法吧。': 'Write your first thought.',
    '清除搜索': 'Clear search',
    '小小的记录，慢慢积累。': 'Small notes, slowly gathered.',
    '当前笔记': 'Current note',
    '返回笔记列表': 'Back to note list',
    '已保存': 'Saved',
    '未能保存，请导出': 'Not saved; export',
    '笔记视图': 'Note view',
    '编辑': 'Edit',
    '阅读': 'Reading',
    '收藏笔记': 'Favorite note',
    '取消收藏': 'Remove favorite',
    '归档笔记': 'Archive note',
    '移出归档': 'Restore note',
    '导出笔记': 'Export note',
    '导出为文本': 'Export as text',
    '晨光穿过森林，照亮一条通向溪边小屋的小径': 'Morning light falls through a forest onto a path leading to a riverside cabin',
    '笔记主题': 'Note topic',
    '灵感': 'Inspiration',
    '生活': 'Life',
    '0 字': '0 characters',
    '笔记标题': 'Note title',
    '给这个想法起个名字': 'Give this thought a name',
    '笔记正文': 'Note body',
    '从一句话开始，也很好。': 'Start with a sentence.',
    '把日子过成自己喜欢的样子。': 'Make space for the days you want.',
    '留一页空白': 'A little blank space',
    '选择一篇笔记，或者写下新的想法。': 'Choose a note, or start a new thought.',
    '写点什么': 'Write something',
    '原创界面与示例内容 · AI 协作制作 · 不连接云端笔记服务': 'Original interface & sample notes · AI-assisted · no cloud sync',
    '查看源代码与其他样例': 'Source & more studies',
    '撤销': 'Undo',
    '打开笔记：': 'Open note: ',
    '无标题笔记': 'Untitled note',
    '还没有正文，从一句话开始。': 'No text yet. Start with a sentence.',
    '没有找到相符的标题或正文，换个词试试。': 'No matching title or text. Try another word.',
    '这里还没有笔记，新的想法随时可以开始。': 'A new thought can start here any time.',
    '这一页还是空白。': 'This page is still blank.',
    '笔记已放入归档': 'Note archived',
    '笔记已移回全部笔记': 'Note restored to all notes',
    '已导出这篇笔记': 'Note exported',
    '木间 · 给想法留一点空间': 'Mojian · Make room for your thoughts',
    '木间：一个可以新建、编辑、搜索和收藏笔记的交互界面样例。Seda 以 AI 协作制作。': 'Mojian: an interactive notes study with editing, search and favorites. Created with AI assistance for Seda.',
  };
  const sampleText = {
    september: ['A page for September', 'I woke a little earlier today. The light outside was soft, as if someone had turned down the volume of the world.\n\nI want to pay attention to small things again:\na cup of tea slowly cooling, a walk without a destination,\nand thoughts that arrive before I have a name for them.\n\nThere is no hurry to fill every page.\nLeave a little space for something new to grow.'],
    'small-things': ['Designing a little less', 'A good interface does not always need more features.\nSometimes making one action feel natural is enough.\n\nBefore removing a line of explanation, make sure the layout already says it clearly.\nGive buttons room to breathe, and words enough time to be read.\n\nNext time I design something, I want to ask:\ncould this be a little simpler?'],
    reading: ['What stays after reading', 'These are my own reflections after reading, not quotations from a book.\n\nUnderstanding something is not always about explaining it at greater length.\nSometimes it means finally saying the important part in my own words.\n\nNext time, I will read ten pages without trying to record everything.\nWhat stays with me after I close the book can find a home here.'],
    weekend: ['A weekend with room in it', 'A few small plans\n\n· Buy an unfamiliar flower at a familiar corner shop.\n· Leave an afternoon for rearranging the books.\n· Cook dinner without looking at my phone.\n· If it rains, enjoy staying home.\n\nAnything left unfinished is allowed to wait.'],
    colors: ['Colors collected on a walk', 'Today’s colors did not come from a swatch book.\n\nThe green of moss was quieter than I expected.\nDry bark held a soft, gentle gray.\nThe four o’clock sun made ivory look like an old letter.\n\nPut them together, and perhaps they could become a place worth lingering in.'],
    booklist: ['The next book', 'There is no need for a long list just yet.\n\nI want a book I can read slowly:\none where I can pause on a page, then return a few days later.\n\nThis note can wait until a title catches my attention.'],
    august: ['August, tucked away', 'A few small things stayed with me this month.\n\nI do not need to see them every day, but I do not want to delete them either.\nPerhaps an archive is simply a quiet place for the past.'],
  };
  const text = (original) => locale === 'en' ? english[original] ?? original : original;

  // Capture only the original interface. User-created note nodes are never translated.
  const staticText = [];
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  while (walker.nextNode()) {
    const node = walker.currentNode;
    if (Object.hasOwn(english, node.nodeValue.trim())) staticText.push([node, node.nodeValue]);
  }
  const staticAttributes = [];
  for (const element of document.querySelectorAll('[placeholder], [aria-label], [title], [alt]')) {
    for (const attribute of ['placeholder', 'aria-label', 'title', 'alt']) {
      const value = element.getAttribute(attribute);
      if (Object.hasOwn(english, value)) staticAttributes.push([element, attribute, value]);
    }
  }
  const pageTitle = document.title;
  const description = document.querySelector('meta[name="description"]');
  const originalDescription = description.content;
  function apply() {
    document.documentElement.lang = locale === 'en' ? 'en' : 'zh-CN';
    for (const [node, original] of staticText) {
      node.nodeValue = original.replace(original.trim(), () => text(original.trim()));
    }
    for (const [element, attribute, original] of staticAttributes) element.setAttribute(attribute, text(original));
    document.title = text(pageTitle);
    description.content = text(originalDescription);
    document.getElementById('interface-language').value = locale;
    document.getElementById('preview-mode').textContent = locale === 'en' ? 'Read' : '阅读';
  }
  window.mojianLanguage = {
    text,
    get locale() { return locale === 'en' ? 'en-US' : 'zh-CN'; },
    seed(note) {
      const translated = locale === 'en' && sampleText[note.id];
      return translated ? { ...note, title: translated[0], body: translated[1] } : { ...note };
    },
    count(body) {
      const count = Array.from(body.replace(/\s/g, '')).length;
      return locale === 'en' ? `${count} character${count === 1 ? '' : 's'}` : `${count} 字`;
    },
    setLocale(value) {
      if (!supported(value)) return;
      locale = value;
      try { localStorage.setItem(preferenceKey, value); } catch (_) { /* Notes have their own save status. */ }
      const url = new URL(location.href);
      url.searchParams.set('lang', value);
      history.replaceState(null, '', url);
      apply();
    },
  };
  apply();
})();
