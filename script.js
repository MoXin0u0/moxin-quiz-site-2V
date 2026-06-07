/* 墨忻刷題網：純前端題庫刷題平台 */

const STORAGE_KEYS = {
  selectedBank: 'moxin.selectedBank',
  progress: 'moxin.progress',
  wrongBook: 'moxin.wrongBook',
  favorites: 'moxin.favorites',
  importedBanks: 'moxin.importedBanks',
  answerRecords: 'moxin.answerRecords',
  examRecords: 'moxin.examRecords',
  uiPrefs: 'moxin.uiPrefs'
};

const TYPE_LABELS = {
  single_choice: '單選題',
  multiple_choice: '複選題',
  true_false: '是非題',
  fill_blank: '填空題'
};

const ALLOWED_TYPES = Object.keys(TYPE_LABELS);
const ALLOWED_DIFFICULTY = ['easy', 'medium', 'hard'];
const ALLOWED_IMAGE_EXT = ['png', 'jpg', 'jpeg', 'webp', 'gif', 'svg'];

const AI_PROMPT = `你是一位題庫工程師、考試題庫整理專家與教育內容編輯。

請依照【墨忻刷題網】標準格式，根據我提供的資料建立題庫 JSON。

==================================================
一、任務目標
==================================================

請將我提供的題目、教材、PDF文字、Word文字、圖片辨識文字或考試資料，整理成符合墨忻刷題網格式的 JSON 題庫。

此題庫主要用於官方題庫反覆練習，因此請不要自行新增相似題、延伸題或猜題。

只能根據我提供的內容整理題目。

==================================================
二、輸出規則
==================================================

請只輸出合法 JSON。

不要輸出 Markdown。

不要輸出說明文字。

不要使用 \`\`\`json。

不要在 JSON 前後加入任何解釋。

輸出的 JSON 必須可以直接儲存成 .json 檔案，並放入 questions/ 資料夾使用。

==================================================
三、題庫主格式
==================================================

請使用以下格式：

{
  "bankId": "",
  "title": "",
  "description": "",
  "version": "1.0",
  "createdDate": "",
  "category": "",
  "questions": []
}

==================================================
四、欄位說明
==================================================

bankId：

題庫唯一代號。
請使用英文、數字、底線，不要使用空白。

例如：

ERP_2026
IPAS_AI_BASIC
HumanFactors
QualityManagement

title：

題庫名稱。

description：

題庫簡短說明。

version：

題庫版本，預設 1.0。

createdDate：

建立日期，格式為 YYYY-MM-DD。

category：

題庫分類。

questions：

題目陣列。

==================================================
五、題目格式
==================================================

每一題請使用以下格式：

{
  "id": "",
  "type": "",
  "question": "",
  "images": [],
  "options": {},
  "answer": "",
  "explanation": "",
  "explanationImages": [],
  "tags": [],
  "difficulty": "",
  "chapter": ""
}

若題目沒有圖片，可以省略 images。  
若詳解沒有圖片，可以省略 explanationImages。  
是非題可以省略 options。  
填空題可以省略 options。

==================================================
六、圖片題格式
==================================================

如果題目需要圖片，請加入 images 欄位。

格式：

"images": [
  {
    "src": "assets/images/檔名.png",
    "alt": "圖片替代文字",
    "caption": "圖片說明"
  }
]

如果詳解也需要圖片，請加入 explanationImages 欄位。

格式：

"explanationImages": [
  {
    "src": "assets/images/檔名.png",
    "alt": "詳解圖片替代文字",
    "caption": "詳解圖片說明"
  }
]

規則：

1. 題目原本有圖片時，不要忽略圖片。
2. 若圖片檔名已知，請填入正確路徑。
3. 若圖片檔名未知，請使用可辨識的暫定檔名，例如：
   assets/images/Q001.png
4. alt 要簡短描述圖片內容。
5. caption 要說明圖片用途。
6. 圖片路徑一律使用相對路徑。
7. 支援副檔名 png、jpg、jpeg、webp、gif、svg。

==================================================
七、支援題型
==================================================

只允許以下四種題型：

1. single_choice
2. multiple_choice
3. true_false
4. fill_blank

==================================================
八、單選題格式
==================================================

單選題 type：

single_choice

格式：

{
  "id": "Q001",
  "type": "single_choice",
  "question": "題目內容",
  "images": [
    {
      "src": "assets/images/Q001.png",
      "alt": "題目圖片",
      "caption": "圖1：題目圖片"
    }
  ],
  "options": {
    "A": "選項A",
    "B": "選項B",
    "C": "選項C",
    "D": "選項D"
  },
  "answer": "B",
  "explanation": "詳解內容",
  "explanationImages": [
    {
      "src": "assets/images/Q001_explanation.png",
      "alt": "詳解圖片",
      "caption": "圖2：詳解圖片"
    }
  ],
  "tags": ["標籤1", "標籤2"],
  "difficulty": "easy",
  "chapter": "章節名稱"
}

規則：

1. answer 必須是選項代號。
2. options 至少要有 A、B 兩個選項。
3. 若原始題目有 A、B、C、D，請完整保留。
4. 不要改寫原始題意。

==================================================
九、複選題格式
==================================================

複選題 type：

multiple_choice

格式：

{
  "id": "Q002",
  "type": "multiple_choice",
  "question": "題目內容",
  "images": [],
  "options": {
    "A": "選項A",
    "B": "選項B",
    "C": "選項C",
    "D": "選項D"
  },
  "answer": ["A", "C"],
  "explanation": "詳解內容",
  "explanationImages": [],
  "tags": ["標籤1", "標籤2"],
  "difficulty": "medium",
  "chapter": "章節名稱"
}

規則：

1. answer 必須是陣列。
2. 正確選項依英文字母排序。
3. 不要把複選題改成單選題。
4. 詳解需說明每個正確與錯誤選項。

==================================================
十、是非題格式
==================================================

是非題 type：

true_false

格式：

{
  "id": "Q003",
  "type": "true_false",
  "question": "題目內容",
  "images": [],
  "answer": true,
  "explanation": "詳解內容",
  "explanationImages": [],
  "tags": ["標籤1"],
  "difficulty": "easy",
  "chapter": "章節名稱"
}

規則：

1. 正確為 true。
2. 錯誤為 false。
3. 不需要 options 欄位。
4. 若原始資料使用 O / X，請轉換成 true / false。

==================================================
十一、填空題格式
==================================================

填空題 type：

fill_blank

格式：

{
  "id": "Q004",
  "type": "fill_blank",
  "question": "題目內容",
  "images": [],
  "answer": [
    "Enterprise Resource Planning",
    "enterprise resource planning"
  ],
  "caseSensitive": false,
  "explanation": "詳解內容",
  "explanationImages": [],
  "tags": ["標籤1"],
  "difficulty": "medium",
  "chapter": "章節名稱"
}

規則：

1. answer 必須是陣列。
2. 可以提供多個可接受答案。
3. caseSensitive 預設 false。
4. 題目文字中可使用 ____ 表示填空處。

==================================================
十二、詳解要求
==================================================

每一題都必須有 explanation。

詳解請包含：

1. 為什麼正確答案是這個。
2. 若是選擇題，請說明其他選項錯在哪裡。
3. 說明本題的核心知識點。
4. 文字要清楚、簡單、適合考前複習。
5. 如果原題有圖片，詳解要能呼應圖片內容。

詳解風格範例：

本題答案為 B。MRP 是 Material Requirements Planning，主要用來依據主生產排程與物料清單計算未來所需物料的數量與時間。因此 B 正確。A 只描述庫存查詢，範圍過窄；C 偏向財務管理；D 則與人事管理有關，皆不是 MRP 的主要目的。

==================================================
十三、標籤與章節
==================================================

請自動產生 tags 與 chapter。

tags 範例：

["ERP", "MRP", "物料需求規劃"]

chapter 範例：

MRP
BOM
ATP
庫存管理
生產管理
基本概念

規則：

1. tags 要簡潔。
2. 每題至少 1 個 tag。
3. chapter 盡量依題目主題歸類。
4. 如果無法判斷章節，填入「未分類」。
5. 圖片題請加入「圖片題」標籤。

==================================================
十四、難度
==================================================

difficulty 只能使用：

easy
medium
hard

判斷方式：

easy：
基本定義、名詞解釋、直接記憶題。

medium：
需要理解概念差異、流程或應用。

hard：
需要計算、情境判斷、跨章節整合。

==================================================
十五、題號規則
==================================================

如果原始資料有題號，請盡量保留。

如果原始資料沒有題號，請自動產生：

Q001
Q002
Q003

題號不得重複。

==================================================
十六、資料保真要求
==================================================

因為本網站用於官方題庫反覆練習，請遵守：

1. 不要任意改寫題目核心內容。
2. 不要自行新增官方資料沒有的題目。
3. 不要自行生成相似題。
4. 不要猜測答案。
5. 如果答案不明確，請在 explanation 中標記「原始資料未明確提供答案，需人工確認」。
6. 如果原始題目有錯字，可以在不改變題意下修正明顯錯字。
7. 若有疑似答案錯誤，不要擅自更改，請在 explanation 中提醒需人工確認。
8. 若原題包含圖片、表格、流程圖、架構圖，請保留圖片欄位，不要只用文字取代。

==================================================
十七、輸出檢查
==================================================

輸出前請自行確認：

1. JSON 格式合法。
2. 沒有多餘逗號。
3. 每題都有 id。
4. 每題都有 type。
5. 每題都有 question。
6. 每題都有 answer。
7. 每題都有 explanation。
8. 每題都有 tags。
9. 每題都有 difficulty。
10. 每題都有 chapter。
11. 題型只使用 single_choice、multiple_choice、true_false、fill_blank。
12. 單選題 answer 是字串。
13. 複選題 answer 是陣列。
14. 是非題 answer 是 true 或 false。
15. 填空題 answer 是陣列。
16. images 若存在，必須是陣列。
17. explanationImages 若存在，必須是陣列。
18. 圖片物件必須包含 src、alt、caption。

==================================================
十八、現在請開始
==================================================

請根據我接下來提供的資料，產生符合墨忻刷題網格式的 JSON 題庫。

請只輸出 JSON。`;

const state = {
  banks: [],
  importedBanks: {},
  currentBankMeta: null,
  currentBankData: null,
  filteredQuestions: [],
  practice: null,
  exam: null,
  examTimerId: null
};

function $(id) {
  return document.getElementById(id);
}

function initApp() {
  bindGlobalEvents();
  $('aiPromptText').textContent = AI_PROMPT;
  state.importedBanks = loadFromLocalStorage(STORAGE_KEYS.importedBanks, {});
  loadQuestionBanks();
  renderLocalDataSummary();
}

async function loadQuestionBanks() {
  try {
    const response = await fetch('question-banks.json', { cache: 'no-store' });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const banks = await response.json();
    if (!Array.isArray(banks)) throw new Error('question-banks.json 必須是陣列');
    state.banks = banks.filter(bank => bank.enabled !== false);
  } catch (error) {
    showMessage(`question-banks.json 無法讀取，已嘗試使用 sample.json。錯誤：${error.message}`, 'warning');
    state.banks = [{
      id: 'sample',
      title: '範例題庫',
      description: '備援範例題庫',
      file: 'questions/sample.json',
      category: '範例',
      version: '1.0',
      questionCount: 0,
      createdDate: '2026-06-06',
      enabled: true
    }];
  }
  renderQuestionBankList();
  populateExamBankSelect();
  const lastBankId = loadFromLocalStorage(STORAGE_KEYS.selectedBank, null);
  if (lastBankId && findBankMeta(lastBankId)) {
    // 保留選擇紀錄，但不自動跳頁，避免重新整理後打斷首頁。
  }
}

function renderQuestionBankList() {
  const list = $('bankList');
  const keyword = normalizeText($('bankSearchInput').value || '');
  const allBanks = getAllBankMetas();
  const filtered = allBanks.filter(bank => {
    const haystack = normalizeText(`${bank.title} ${bank.description} ${bank.category}`);
    return !keyword || haystack.includes(keyword);
  });

  list.innerHTML = '';
  if (filtered.length === 0) {
    list.innerHTML = `<div class="panel"><p>找不到符合條件的題庫。</p></div>`;
    return;
  }

  filtered.forEach(bank => {
    const card = document.createElement('article');
    card.className = 'bank-card';
    card.innerHTML = `
      <h3>${escapeHtml(bank.title)}</h3>
      <p>${escapeHtml(bank.description || '')}</p>
      <div class="meta-row">
        <span class="badge">ID：${escapeHtml(bank.id)}</span>
        <span class="badge">分類：${escapeHtml(bank.category || '未分類')}</span>
        <span class="badge">題數：${bank.questionCount ?? '未知'}</span>
        <span class="badge">版本：${escapeHtml(bank.version || '')}</span>
        ${bank.imported ? '<span class="badge warning">本機匯入</span>' : ''}
      </div>
      <div class="toolbar">
        <button type="button" data-bank-action="detail" data-bank-id="${escapeAttr(bank.id)}">進入題庫</button>
        <button type="button" class="secondary" data-bank-action="wrong" data-bank-id="${escapeAttr(bank.id)}">只練錯題</button>
        <button type="button" class="secondary" data-bank-action="favorite" data-bank-id="${escapeAttr(bank.id)}">收藏練習</button>
        ${bank.imported ? `<button type="button" class="danger" data-bank-action="deleteImported" data-bank-id="${escapeAttr(bank.id)}">刪除匯入題庫</button>` : ''}
      </div>
    `;
    list.appendChild(card);
  });
}

async function loadQuestionBank(bankId) {
  const meta = findBankMeta(bankId);
  if (!meta) {
    showMessage('找不到指定題庫。', 'error');
    return null;
  }

  try {
    let bankData;
    if (meta.imported) {
      bankData = state.importedBanks[bankId];
    } else {
      const response = await fetch(meta.file, { cache: 'no-store' });
      if (!response.ok) throw new Error(`題庫 JSON 檔案不存在或無法讀取：${meta.file}`);
      bankData = await response.json();
    }

    const errors = validateQuestionBank(bankData);
    if (errors.length > 0) throw new Error(errors.join('；'));

    state.currentBankMeta = meta;
    state.currentBankData = bankData;
    saveToLocalStorage(STORAGE_KEYS.selectedBank, bankId);
    renderBankDetail();
    showPage('bankDetailPage');
    return bankData;
  } catch (error) {
    showMessage(`題庫載入失敗：${error.message}`, 'error');
    return null;
  }
}

function validateQuestionBank(bank) {
  const errors = [];
  if (!bank || typeof bank !== 'object') return ['題庫格式錯誤，根節點必須是物件'];
  ['bankId', 'title', 'description', 'version', 'createdDate', 'category'].forEach(field => {
    if (!bank[field] || typeof bank[field] !== 'string') errors.push(`題庫缺少 ${field}`);
  });
  if (!Array.isArray(bank.questions)) errors.push('questions 必須是陣列');
  if (Array.isArray(bank.questions) && bank.questions.length === 0) errors.push('題庫沒有任何題目');

  const ids = new Set();
  if (Array.isArray(bank.questions)) {
    bank.questions.forEach((question, index) => {
      validateQuestion(question, index).forEach(error => errors.push(error));
      if (question && question.id) {
        if (ids.has(question.id)) errors.push(`題目 id 重複：${question.id}`);
        ids.add(question.id);
      }
    });
  }
  return errors;
}

function validateQuestion(question, index = 0) {
  const label = `第 ${index + 1} 題`;
  const errors = [];
  if (!question || typeof question !== 'object') return [`${label} 格式錯誤`];
  if (!question.id) errors.push(`${label} 沒有 id`);
  if (!question.type) errors.push(`${label} 沒有 type`);
  if (!ALLOWED_TYPES.includes(question.type)) errors.push(`${label} type 不支援：${question.type}`);
  if (!question.question || typeof question.question !== 'string') errors.push(`${label} 沒有 question`);
  if (!Object.prototype.hasOwnProperty.call(question, 'answer')) errors.push(`${label} 沒有 answer`);
  if (!question.explanation || typeof question.explanation !== 'string') errors.push(`${label} 沒有 explanation`);

  if (question.type === 'single_choice') {
    if (!isPlainObject(question.options) || Object.keys(question.options).length < 2) errors.push(`${label} 單選題沒有有效 options`);
    if (typeof question.answer !== 'string') errors.push(`${label} 單選題 answer 必須是字串`);
  }
  if (question.type === 'multiple_choice') {
    if (!isPlainObject(question.options) || Object.keys(question.options).length < 2) errors.push(`${label} 複選題沒有有效 options`);
    if (!Array.isArray(question.answer)) errors.push(`${label} 複選題 answer 必須是陣列`);
  }
  if (question.type === 'true_false') {
    if (typeof question.answer !== 'boolean') errors.push(`${label} 是非題 answer 必須是 true 或 false`);
  }
  if (question.type === 'fill_blank') {
    if (!Array.isArray(question.answer) || question.answer.length === 0) errors.push(`${label} 填空題 answer 必須是非空陣列`);
  }

  validateImageFields(question.images, `${label} images`).forEach(error => errors.push(error));
  validateImageFields(question.explanationImages, `${label} explanationImages`).forEach(error => errors.push(error));

  if (question.tags && !Array.isArray(question.tags)) errors.push(`${label} tags 必須是陣列`);
  if (question.difficulty && !ALLOWED_DIFFICULTY.includes(question.difficulty)) errors.push(`${label} difficulty 只能是 easy、medium、hard`);
  return errors;
}

function validateImageFields(images, fieldName = 'images') {
  const errors = [];
  if (images === undefined) return errors;
  if (!Array.isArray(images)) return [`${fieldName} 欄位格式錯誤，必須是陣列`];
  images.forEach((image, index) => {
    if (!image || typeof image !== 'object') {
      errors.push(`${fieldName}[${index}] 必須是物件`);
      return;
    }
    ['src', 'alt', 'caption'].forEach(field => {
      if (!image[field] || typeof image[field] !== 'string') errors.push(`${fieldName}[${index}] 缺少 ${field}`);
    });
    if (image.src && !isAllowedImagePath(image.src)) errors.push(`${fieldName}[${index}] 圖片副檔名不支援：${image.src}`);
  });
  return errors;
}

function renderBankDetail() {
  const bank = state.currentBankData;
  $('bankDetailTitle').textContent = bank.title;
  $('bankDetailDescription').textContent = bank.description;
  $('bankDetailMeta').innerHTML = `
    <span class="badge">ID：${escapeHtml(bank.bankId)}</span>
    <span class="badge">分類：${escapeHtml(bank.category)}</span>
    <span class="badge">版本：${escapeHtml(bank.version)}</span>
    <span class="badge">建立日期：${escapeHtml(bank.createdDate)}</span>
    <span class="badge">題數：${bank.questions.length}</span>
  `;
  populateQuestionFilters(bank.questions);
  applyQuestionFilters();
}

function populateQuestionFilters(questions) {
  const tagSet = new Set();
  const chapterSet = new Set();
  questions.forEach(q => {
    (q.tags || []).forEach(tag => tagSet.add(tag));
    if (q.chapter) chapterSet.add(q.chapter);
  });
  setSelectOptions($('tagFilter'), ['all', ...Array.from(tagSet).sort()], '全部');
  setSelectOptions($('chapterFilter'), ['all', ...Array.from(chapterSet).sort()], '全部');
}

function applyQuestionFilters() {
  if (!state.currentBankData) return;
  const keyword = normalizeText($('questionSearchInput').value || '');
  const type = $('typeFilter').value;
  const difficulty = $('difficultyFilter').value;
  const tag = $('tagFilter').value;
  const chapter = $('chapterFilter').value;
  const imageFilter = $('imageFilter').value;

  state.filteredQuestions = state.currentBankData.questions.filter(q => {
    const hasImages = (q.images && q.images.length > 0) || (q.explanationImages && q.explanationImages.length > 0);
    const imgText = [...(q.images || []), ...(q.explanationImages || [])].map(img => `${img.src} ${img.alt} ${img.caption}`).join(' ');
    const optionsText = isPlainObject(q.options) ? Object.values(q.options).join(' ') : '';
    const haystack = normalizeText(`${q.id} ${q.question} ${optionsText} ${q.explanation} ${imgText}`);
    return (!keyword || haystack.includes(keyword)) &&
      (type === 'all' || q.type === type) &&
      (difficulty === 'all' || q.difficulty === difficulty) &&
      (tag === 'all' || (q.tags || []).includes(tag)) &&
      (chapter === 'all' || q.chapter === chapter) &&
      (imageFilter === 'all' || (imageFilter === 'with' ? hasImages : !hasImages));
  });

  $('filteredCountText').textContent = `目前篩選結果：${state.filteredQuestions.length} / ${state.currentBankData.questions.length} 題`;
}

function startPractice(questions = null, mode = 'all') {
  const sourceQuestions = questions || state.filteredQuestions;
  if (!state.currentBankData) {
    showMessage('請先選擇題庫。', 'warning');
    return;
  }
  if (!sourceQuestions || sourceQuestions.length === 0) {
    showMessage('篩選後沒有題目，無法開始練習。', 'warning');
    return;
  }

  state.practice = {
    mode,
    bankId: state.currentBankData.bankId,
    bankTitle: state.currentBankData.title,
    sourceQuestionIds: sourceQuestions.map(q => q.id),
    queue: createQuestionQueue(sourceQuestions),
    completedIds: [],
    roundErrors: {},
    totalAttempts: 0,
    totalWrong: 0,
    records: [],
    currentQuestion: null,
    answered: false,
    startTime: new Date().toISOString(),
    finishTime: null
  };
  saveProgress();
  showPage('practicePage');
  renderQuestion();
}

async function startWrongBookPractice(bankId = null) {
  const targetBankId = bankId || state.currentBankData?.bankId;
  if (!targetBankId) {
    showMessage('請先選擇題庫。', 'warning');
    return;
  }
  const bank = state.currentBankData?.bankId === targetBankId ? state.currentBankData : await loadQuestionBank(targetBankId);
  if (!bank) return;
  const wrongBook = loadFromLocalStorage(STORAGE_KEYS.wrongBook, {});
  const ids = Object.keys(wrongBook[targetBankId] || {});
  const questions = bank.questions.filter(q => ids.includes(q.id));
  if (questions.length === 0) {
    showMessage('這個題庫目前沒有錯題。', 'warning');
    return;
  }
  startPractice(questions, 'wrongBook');
}

async function startFavoritePractice(bankId = null) {
  const targetBankId = bankId || state.currentBankData?.bankId;
  if (!targetBankId) {
    showMessage('請先選擇題庫。', 'warning');
    return;
  }
  const bank = state.currentBankData?.bankId === targetBankId ? state.currentBankData : await loadQuestionBank(targetBankId);
  if (!bank) return;
  const favorites = loadFromLocalStorage(STORAGE_KEYS.favorites, {});
  const ids = Object.keys(favorites[targetBankId] || {});
  const questions = bank.questions.filter(q => ids.includes(q.id));
  if (questions.length === 0) {
    showMessage('這個題庫目前沒有收藏題目。', 'warning');
    return;
  }
  startPractice(questions, 'favorites');
}

function startExamMode() {
  const bankId = $('examBankSelect').value;
  const count = Math.max(1, Number($('examCountInput').value || 1));
  const minutes = Math.max(1, Number($('examMinutesInput').value || 1));
  loadQuestionBankForExam(bankId).then(bank => {
    if (!bank) return;
    const selected = shuffleArray([...bank.questions]).slice(0, Math.min(count, bank.questions.length));
    state.exam = {
      bankId: bank.bankId,
      bankTitle: bank.title,
      questions: selected,
      startTime: Date.now(),
      endTime: Date.now() + minutes * 60 * 1000,
      submitted: false
    };
    renderExamActive();
    if (state.examTimerId) clearInterval(state.examTimerId);
    state.examTimerId = setInterval(updateExamTimer, 1000);
    showMessage('模擬考已開始。', 'success');
  });
}

function createQuestionQueue(questions) {
  return shuffleArray(questions.map(q => q.id));
}

function shuffleArray(array) {
  const result = [...array];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

function renderQuestion(useCurrent = false) {
  const practice = state.practice;
  if (!practice) return;
  let question = null;

  if (useCurrent && practice.currentQuestion && !practice.answered) {
    question = findQuestionById(practice.currentQuestion.id) || practice.currentQuestion;
  } else {
    if (practice.queue.length === 0) {
      finishRound();
      return;
    }
    const questionId = practice.queue.shift();
    question = findQuestionById(questionId);
    if (!question) {
      showMessage(`題目不存在：${questionId}`, 'error');
      renderQuestion();
      return;
    }
    practice.currentQuestion = question;
    practice.answered = false;
  }
  $('submitAnswerButton').disabled = false;
  $('submitAnswerButton').textContent = '提交答案';
  $('submitAnswerButton').classList.remove('secondary');
  $('nextQuestionButton').disabled = true;
  $('nextQuestionButton').classList.add('hidden');
  $('explanationArea').className = 'explanation-area hidden';
  $('explanationArea').innerHTML = '';

  const errorCount = practice.roundErrors[question.id] || 0;
  $('questionMeta').innerHTML = `
    <span class="badge">題庫：${escapeHtml(practice.bankTitle)}</span>
    <span class="badge">題號：${escapeHtml(question.id)}</span>
    <span class="badge">題型：${TYPE_LABELS[question.type]}</span>
    <span class="badge">章節：${escapeHtml(question.chapter || '未分類')}</span>
    <span class="badge">難度：${escapeHtml(question.difficulty || '未設定')}</span>
    ${(question.tags || []).map(tag => `<span class="badge">#${escapeHtml(tag)}</span>`).join('')}
    ${errorCount > 0 ? `<span class="badge danger">本題本輪已答錯 ${errorCount} 次</span>` : ''}
  `;
  $('questionTitle').textContent = question.question;
  renderQuestionImages(question);
  renderAnswerForm(question);
  updateProgress();
  saveProgress();
  updateFavoriteButton();
}

function renderQuestionImages(question) {
  const container = $('questionImages');
  container.innerHTML = '';
  renderImages(question.images || [], container);
}

function renderExplanationImages(question) {
  const wrapper = document.createElement('div');
  wrapper.className = 'image-list';
  renderImages(question.explanationImages || [], wrapper);
  return wrapper;
}

function renderImages(images, container) {
  if (!Array.isArray(images) || images.length === 0) return;
  images.forEach(image => {
    const template = $('imageFigureTemplate').content.cloneNode(true);
    const figure = template.querySelector('figure');
    const img = template.querySelector('img');
    const caption = template.querySelector('figcaption');
    img.src = image.src;
    img.alt = image.alt;
    img.onerror = () => handleImageError(img, image.src);
    caption.textContent = image.caption;
    figure.dataset.src = image.src;
    container.appendChild(template);
  });
}

function handleImageError(img, src) {
  const figure = img.closest('figure');
  if (!figure) return;
  figure.innerHTML = `<div class="image-error">圖片無法載入：${escapeHtml(src)}</div>`;
}

function renderAnswerForm(question, prefix = 'answer') {
  const form = $('answerForm');
  form.innerHTML = buildAnswerInputs(question, prefix);
}

function buildAnswerInputs(question, prefix) {
  if (question.type === 'single_choice') {
    return Object.entries(question.options || {}).map(([key, text]) => `
      <label class="option-row" data-option="${escapeAttr(key)}">
        <input type="radio" name="${prefix}" value="${escapeAttr(key)}" />
        <span class="answer-text"><strong>${escapeHtml(key)}.</strong> ${escapeHtml(text)}</span>
      </label>
    `).join('');
  }
  if (question.type === 'multiple_choice') {
    return Object.entries(question.options || {}).map(([key, text]) => `
      <label class="option-row" data-option="${escapeAttr(key)}">
        <input type="checkbox" name="${prefix}" value="${escapeAttr(key)}" />
        <span class="answer-text"><strong>${escapeHtml(key)}.</strong> ${escapeHtml(text)}</span>
      </label>
    `).join('');
  }
  if (question.type === 'true_false') {
    return `
      <label class="option-row" data-option="true"><input type="radio" name="${prefix}" value="true" /> <span>O / 是 / 正確</span></label>
      <label class="option-row" data-option="false"><input type="radio" name="${prefix}" value="false" /> <span>X / 否 / 錯誤</span></label>
    `;
  }
  if (question.type === 'fill_blank') {
    return `<label>請輸入答案<input type="text" name="${prefix}" autocomplete="off" placeholder="請輸入填空答案" /></label>`;
  }
  return '<p>不支援的題型。</p>';
}

function handlePracticeActionButton() {
  const practice = state.practice;
  if (!practice || !practice.currentQuestion) return;
  if (practice.answered) {
    nextQuestion();
  } else {
    submitAnswer();
  }
}

function submitAnswer() {
  const practice = state.practice;
  if (!practice || !practice.currentQuestion) return;
  if (practice.answered) {
    nextQuestion();
    return;
  }
  const question = practice.currentQuestion;
  const userAnswer = getUserAnswer(question);
  if (isEmptyAnswer(userAnswer, question.type)) {
    showMessage('請先作答再提交。', 'warning');
    return;
  }

  const isCorrect = checkAnswer(question, userAnswer);
  practice.answered = true;
  practice.totalAttempts += 1;
  if (!isCorrect) {
    practice.totalWrong += 1;
    practice.roundErrors[question.id] = (practice.roundErrors[question.id] || 0) + 1;
    updateWrongBook(question, userAnswer);
    addWrongQuestionBackToQueue(question);
  } else if (!practice.completedIds.includes(question.id)) {
    practice.completedIds.push(question.id);
  }

  const record = createAnswerRecord(question, userAnswer, isCorrect);
  practice.records.push(record);
  appendAnswerRecord(record);
  showExplanation(question, userAnswer, isCorrect);
  markCorrectAnswer(question);
  if (!isCorrect) markWrongAnswer(question, userAnswer);
  $('submitAnswerButton').disabled = false;
  $('submitAnswerButton').textContent = practice.queue.length === 0 ? '查看本輪結果' : '下一題';
  $('submitAnswerButton').classList.add('secondary');
  $('nextQuestionButton').disabled = true;
  $('nextQuestionButton').classList.add('hidden');
  updateProgress();
  saveProgress();
}

function getUserAnswer(question, root = document) {
  if (question.type === 'single_choice') {
    const selected = root.querySelector('input[name="answer"]:checked');
    return selected ? selected.value : '';
  }
  if (question.type === 'multiple_choice') {
    return Array.from(root.querySelectorAll('input[name="answer"]:checked')).map(input => input.value).sort();
  }
  if (question.type === 'true_false') {
    const selected = root.querySelector('input[name="answer"]:checked');
    return selected ? selected.value === 'true' : null;
  }
  if (question.type === 'fill_blank') {
    const input = root.querySelector('input[name="answer"]');
    return input ? input.value : '';
  }
  return null;
}

function checkAnswer(question, userAnswer) {
  if (question.type === 'single_choice') return normalizeAnswer(userAnswer) === normalizeAnswer(question.answer);
  if (question.type === 'multiple_choice') {
    const a = normalizeAnswer(userAnswer);
    const b = normalizeAnswer(question.answer);
    return Array.isArray(a) && Array.isArray(b) && a.length === b.length && a.every((item, index) => item === b[index]);
  }
  if (question.type === 'true_false') return userAnswer === question.answer;
  if (question.type === 'fill_blank') {
    const answer = String(userAnswer || '').trim();
    return (question.answer || []).some(item => {
      const accepted = String(item).trim();
      return question.caseSensitive === true ? answer === accepted : answer.toLowerCase() === accepted.toLowerCase();
    });
  }
  return false;
}

function normalizeAnswer(answer) {
  if (Array.isArray(answer)) return answer.map(item => String(item).trim()).sort();
  if (typeof answer === 'string') return answer.trim();
  return answer;
}

function showExplanation(question, userAnswer, isCorrect) {
  const area = $('explanationArea');
  const user = formatAnswer(question, userAnswer);
  const correct = formatAnswer(question, question.answer);
  const errorCount = state.practice.roundErrors[question.id] || 0;
  area.className = `explanation-area ${isCorrect ? 'correct' : 'wrong'}`;
  area.innerHTML = `
    <h3>${isCorrect ? '答對了' : '答錯了'}</h3>
    <p>使用者答案：<span class="${isCorrect ? 'correct-text' : 'wrong-text'}">${escapeHtml(user)}</span></p>
    <p>正確答案：<span class="correct-text">${escapeHtml(correct)}</span></p>
    ${!isCorrect ? `<p>本題本輪錯誤次數：<span class="wrong-text">${errorCount}</span></p>` : ''}
    <h4>詳解</h4>
    <p>${escapeHtml(question.explanation)}</p>
  `;
  const explanationImages = renderExplanationImages(question);
  if (explanationImages.children.length > 0) area.appendChild(explanationImages);
}

function markCorrectAnswer(question) {
  if (question.type === 'single_choice' || question.type === 'multiple_choice') {
    const answers = Array.isArray(question.answer) ? question.answer : [question.answer];
    answers.forEach(ans => {
      const row = document.querySelector(`.option-row[data-option="${cssEscape(ans)}"]`);
      if (row) row.classList.add('correct');
    });
  }
  if (question.type === 'true_false') {
    const row = document.querySelector(`.option-row[data-option="${question.answer}"]`);
    if (row) row.classList.add('correct');
  }
}

function markWrongAnswer(question, userAnswer) {
  if (question.type === 'single_choice') {
    const row = document.querySelector(`.option-row[data-option="${cssEscape(userAnswer)}"]`);
    if (row) row.classList.add('wrong');
  }
  if (question.type === 'multiple_choice') {
    (userAnswer || []).forEach(ans => {
      if (!(question.answer || []).includes(ans)) {
        const row = document.querySelector(`.option-row[data-option="${cssEscape(ans)}"]`);
        if (row) row.classList.add('wrong');
      }
    });
  }
  if (question.type === 'true_false') {
    const row = document.querySelector(`.option-row[data-option="${userAnswer}"]`);
    if (row) row.classList.add('wrong');
  }
}

function addWrongQuestionBackToQueue(question) {
  if (!state.practice.queue.includes(question.id)) state.practice.queue.push(question.id);
}

function updateWrongBook(question, userAnswer = null) {
  const bankId = state.currentBankData.bankId;
  const wrongBook = loadFromLocalStorage(STORAGE_KEYS.wrongBook, {});
  if (!wrongBook[bankId]) wrongBook[bankId] = {};
  const existing = wrongBook[bankId][question.id] || { count: 0 };
  wrongBook[bankId][question.id] = {
    bankId,
    bankTitle: state.currentBankData.title,
    questionId: question.id,
    count: existing.count + 1,
    lastWrongAt: new Date().toISOString(),
    lastUserAnswer: userAnswer,
    snapshot: question
  };
  saveToLocalStorage(STORAGE_KEYS.wrongBook, wrongBook);
}

function removeFromWrongBook(bankId, questionId) {
  const wrongBook = loadFromLocalStorage(STORAGE_KEYS.wrongBook, {});
  if (wrongBook[bankId]) {
    delete wrongBook[bankId][questionId];
    if (Object.keys(wrongBook[bankId]).length === 0) delete wrongBook[bankId];
  }
  saveToLocalStorage(STORAGE_KEYS.wrongBook, wrongBook);
  renderWrongBookPage();
  renderLocalDataSummary();
}

function toggleFavoriteQuestion() {
  if (!state.practice?.currentQuestion || !state.currentBankData) return;
  const question = state.practice.currentQuestion;
  const bankId = state.currentBankData.bankId;
  const favorites = loadFromLocalStorage(STORAGE_KEYS.favorites, {});
  if (!favorites[bankId]) favorites[bankId] = {};
  if (favorites[bankId][question.id]) {
    delete favorites[bankId][question.id];
    showMessage('已從收藏移除。', 'success');
  } else {
    favorites[bankId][question.id] = {
      bankId,
      bankTitle: state.currentBankData.title,
      questionId: question.id,
      addedAt: new Date().toISOString(),
      snapshot: question
    };
    showMessage('已加入收藏。', 'success');
  }
  if (Object.keys(favorites[bankId]).length === 0) delete favorites[bankId];
  saveToLocalStorage(STORAGE_KEYS.favorites, favorites);
  updateFavoriteButton();
}

function removeFromFavorite(bankId, questionId) {
  const favorites = loadFromLocalStorage(STORAGE_KEYS.favorites, {});
  if (favorites[bankId]) {
    delete favorites[bankId][questionId];
    if (Object.keys(favorites[bankId]).length === 0) delete favorites[bankId];
  }
  saveToLocalStorage(STORAGE_KEYS.favorites, favorites);
  renderFavoritesPage();
  renderLocalDataSummary();
}

function nextQuestion() {
  if (!state.practice?.answered) {
    showMessage('請先提交答案。', 'warning');
    return;
  }
  renderQuestion();
}

function updateProgress() {
  const p = state.practice;
  if (!p) return;
  const total = p.sourceQuestionIds.length;
  const completed = p.completedIds.length;
  const remaining = total - completed;
  const accuracy = p.totalAttempts === 0 ? 0 : Math.round(((p.totalAttempts - p.totalWrong) / p.totalAttempts) * 100);
  const currentError = p.currentQuestion ? (p.roundErrors[p.currentQuestion.id] || 0) : 0;
  $('progressStats').innerHTML = `
    ${statItem('目前題庫名稱', p.bankTitle)}
    ${statItem('本輪總題數', total)}
    ${statItem('已完成題數', completed)}
    ${statItem('剩餘題數', remaining)}
    ${statItem('本輪總答題次數', p.totalAttempts)}
    ${statItem('本輪總答錯次數', p.totalWrong)}
    ${statItem('目前正確率', `${accuracy}%`)}
    ${statItem('目前題目的本輪錯誤次數', currentError)}
  `;
}

function finishRound() {
  const p = state.practice;
  if (!p) return;
  p.finishTime = new Date().toISOString();
  clearProgress();
  const accuracy = p.totalAttempts === 0 ? 0 : Math.round(((p.totalAttempts - p.totalWrong) / p.totalAttempts) * 100);
  $('finishStats').innerHTML = `
    ${statItem('題庫名稱', p.bankTitle)}
    ${statItem('本輪完成時間', formatDateTime(p.finishTime))}
    ${statItem('總題數', p.sourceQuestionIds.length)}
    ${statItem('總答題次數', p.totalAttempts)}
    ${statItem('總答錯次數', p.totalWrong)}
    ${statItem('正確率', `${accuracy}%`)}
  `;

  const list = $('finishWrongList');
  list.innerHTML = '';
  const wrongIds = Object.keys(p.roundErrors).filter(id => p.roundErrors[id] > 0);
  if (wrongIds.length === 0) {
    list.innerHTML = '<div class="panel"><p>本輪沒有錯題。</p></div>';
  } else {
    wrongIds.forEach(id => {
      const q = findQuestionById(id);
      if (q) list.appendChild(buildQuestionRecordCard({
        bankId: p.bankId,
        bankTitle: p.bankTitle,
        questionId: q.id,
        count: p.roundErrors[id],
        lastWrongAt: p.finishTime,
        snapshot: q
      }, { showRemoveWrong: false }));
    });
  }
  showPage('finishPage');
}

function saveProgress() {
  if (!state.practice) return;
  saveToLocalStorage(STORAGE_KEYS.progress, state.practice);
}

function loadProgress() {
  const progress = loadFromLocalStorage(STORAGE_KEYS.progress, null);
  if (!progress || !progress.bankId) {
    showMessage('沒有可載入的練習進度。', 'warning');
    return;
  }
  loadQuestionBank(progress.bankId).then(bank => {
    if (!bank) return;
    state.practice = progress;
    showPage('practicePage');
    renderQuestion(true);
  });
}

function clearProgress() {
  localStorage.removeItem(STORAGE_KEYS.progress);
}

function saveToLocalStorage(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    showMessage(`localStorage 儲存失敗：${error.message}`, 'error');
  }
}

function loadFromLocalStorage(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    if (raw === null) return fallback;
    return JSON.parse(raw);
  } catch (error) {
    console.warn(`localStorage 資料損壞：${key}`, error);
    localStorage.removeItem(key);
    showMessage(`偵測到 ${key} 資料損壞，已清除該項資料。`, 'warning');
    return fallback;
  }
}

function importQuestionBank(file) {
  if (!file) return;
  const reader = new FileReader();
  reader.onload = () => {
    try {
      const bank = JSON.parse(reader.result);
      const errors = validateQuestionBank(bank);
      if (errors.length > 0) throw new Error(errors.join('；'));
      if (state.importedBanks[bank.bankId] && !confirm(`bankId「${bank.bankId}」已存在，是否覆蓋？`)) return;
      state.importedBanks[bank.bankId] = bank;
      saveToLocalStorage(STORAGE_KEYS.importedBanks, state.importedBanks);
      showMessage('題庫匯入完成。', 'success');
      renderQuestionBankList();
      populateExamBankSelect();
      renderImportedBankList();
    } catch (error) {
      showMessage(`匯入錯誤格式 JSON：${error.message}`, 'error');
    }
  };
  reader.readAsText(file, 'utf-8');
}

function deleteImportedQuestionBank(bankId) {
  if (!state.importedBanks[bankId]) return;
  if (!confirm(`確定刪除匯入題庫「${bankId}」？`)) return;
  delete state.importedBanks[bankId];
  saveToLocalStorage(STORAGE_KEYS.importedBanks, state.importedBanks);
  renderQuestionBankList();
  populateExamBankSelect();
  renderImportedBankList();
  showMessage('匯入題庫已刪除。', 'success');
}

function exportWrongBookToJSON() {
  exportData('moxin-wrong-book.json', collectWrongBookRecords(), 'json');
}

function exportWrongBookToCSV() {
  exportData('moxin-wrong-book.csv', recordsToCsv(collectWrongBookRecords()), 'csv');
}

function exportFavoritesToJSON() {
  exportData('moxin-favorites.json', collectFavoriteRecords(), 'json');
}

function exportRoundRecordToJSON() {
  exportData('moxin-round-record.json', state.practice?.records || loadFromLocalStorage(STORAGE_KEYS.answerRecords, []), 'json');
}

function exportRoundRecordToCSV() {
  const records = state.practice?.records || loadFromLocalStorage(STORAGE_KEYS.answerRecords, []);
  exportData('moxin-round-record.csv', recordsToCsv(records), 'csv');
}

function exportAllLocalData() {
  const data = {
    selectedBank: loadFromLocalStorage(STORAGE_KEYS.selectedBank, null),
    progress: loadFromLocalStorage(STORAGE_KEYS.progress, null),
    wrongBook: loadFromLocalStorage(STORAGE_KEYS.wrongBook, {}),
    favorites: loadFromLocalStorage(STORAGE_KEYS.favorites, {}),
    importedBanks: loadFromLocalStorage(STORAGE_KEYS.importedBanks, {}),
    answerRecords: loadFromLocalStorage(STORAGE_KEYS.answerRecords, []),
    examRecords: loadFromLocalStorage(STORAGE_KEYS.examRecords, []),
    uiPrefs: loadFromLocalStorage(STORAGE_KEYS.uiPrefs, {})
  };
  exportData('moxin-local-data-backup.json', data, 'json');
}

function importAllLocalData(file) {
  if (!file) return;
  const reader = new FileReader();
  reader.onload = () => {
    try {
      const data = JSON.parse(reader.result);
      if (!data || typeof data !== 'object') throw new Error('備份檔根節點必須是物件');
      Object.entries(STORAGE_KEYS).forEach(([name, key]) => {
        if (Object.prototype.hasOwnProperty.call(data, name)) saveToLocalStorage(key, data[name]);
      });
      state.importedBanks = loadFromLocalStorage(STORAGE_KEYS.importedBanks, {});
      renderQuestionBankList();
      populateExamBankSelect();
      renderLocalDataSummary();
      showMessage('本機資料已還原。', 'success');
    } catch (error) {
      showMessage(`匯入本機資料備份失敗：${error.message}`, 'error');
    }
  };
  reader.readAsText(file, 'utf-8');
}

function renderWrongBookPage() {
  const list = $('wrongBookList');
  const records = collectWrongBookRecords();
  list.innerHTML = '';
  if (records.length === 0) {
    list.innerHTML = '<div class="panel"><p>目前沒有錯題。</p></div>';
  } else {
    records.forEach(record => list.appendChild(buildQuestionRecordCard(record, { showRemoveWrong: true, showPractice: true })));
  }
  showPage('wrongBookPage');
}

function renderFavoritesPage() {
  const list = $('favoriteList');
  const records = collectFavoriteRecords();
  list.innerHTML = '';
  if (records.length === 0) {
    list.innerHTML = '<div class="panel"><p>目前沒有收藏題目。</p></div>';
  } else {
    records.forEach(record => list.appendChild(buildQuestionRecordCard(record, { showRemoveFavorite: true, showPracticeFavorite: true })));
  }
  showPage('favoritesPage');
}

function renderLocalDataSummary() {
  const wrongCount = collectWrongBookRecords().length;
  const favoriteCount = collectFavoriteRecords().length;
  const importedCount = Object.keys(loadFromLocalStorage(STORAGE_KEYS.importedBanks, {})).length;
  const answerCount = loadFromLocalStorage(STORAGE_KEYS.answerRecords, []).length;
  const examCount = loadFromLocalStorage(STORAGE_KEYS.examRecords, []).length;
  const box = $('localDataSummary');
  if (!box) return;
  box.innerHTML = `
    ${statItem('錯題本題數', wrongCount)}
    ${statItem('收藏題數', favoriteCount)}
    ${statItem('匯入題庫數', importedCount)}
    ${statItem('答題紀錄數', answerCount)}
    ${statItem('模擬考紀錄數', examCount)}
  `;
  renderImportedBankList();
}

function renderImportedBankList() {
  const list = $('importedBankList');
  if (!list) return;
  const imported = loadFromLocalStorage(STORAGE_KEYS.importedBanks, {});
  const banks = Object.values(imported);
  list.innerHTML = '';
  if (banks.length === 0) {
    list.innerHTML = '<p class="muted">目前沒有匯入題庫。</p>';
    return;
  }
  banks.forEach(bank => {
    const div = document.createElement('div');
    div.className = 'record-card';
    div.innerHTML = `
      <h3>${escapeHtml(bank.title)}</h3>
      <p>${escapeHtml(bank.description || '')}</p>
      <div class="meta-row"><span class="badge">${escapeHtml(bank.bankId)}</span><span class="badge">${bank.questions.length} 題</span></div>
      <button type="button" class="danger" data-delete-imported="${escapeAttr(bank.bankId)}">刪除</button>
    `;
    list.appendChild(div);
  });
}

function buildQuestionRecordCard(record, options = {}) {
  const q = record.snapshot;
  const card = document.createElement('article');
  card.className = 'record-card';
  const imageWrapperId = `img-${record.bankId}-${record.questionId}-${Math.random().toString(36).slice(2)}`;
  const expImageWrapperId = `exp-img-${record.bankId}-${record.questionId}-${Math.random().toString(36).slice(2)}`;
  card.innerHTML = `
    <h3>${escapeHtml(record.questionId)}｜${escapeHtml(q.question)}</h3>
    <div class="meta-row">
      <span class="badge">題庫：${escapeHtml(record.bankTitle || record.bankId)}</span>
      <span class="badge">題型：${TYPE_LABELS[q.type] || q.type}</span>
      <span class="badge">章節：${escapeHtml(q.chapter || '未分類')}</span>
      <span class="badge">難度：${escapeHtml(q.difficulty || '未設定')}</span>
      ${record.count !== undefined ? `<span class="badge danger">答錯次數：${record.count}</span>` : ''}
      ${record.lastWrongAt ? `<span class="badge">最近錯誤：${formatDateTime(record.lastWrongAt)}</span>` : ''}
    </div>
    <div id="${imageWrapperId}" class="image-list"></div>
    <p>正確答案：<span class="correct-text">${escapeHtml(formatAnswer(q, q.answer))}</span></p>
    <p>詳解：${escapeHtml(q.explanation)}</p>
    <div id="${expImageWrapperId}" class="image-list"></div>
    <div class="toolbar">
      ${options.showRemoveWrong ? `<button type="button" class="danger" data-remove-wrong="${escapeAttr(record.bankId)}|${escapeAttr(record.questionId)}">從錯題本移除</button>` : ''}
      ${options.showRemoveFavorite ? `<button type="button" class="danger" data-remove-favorite="${escapeAttr(record.bankId)}|${escapeAttr(record.questionId)}">從收藏移除</button>` : ''}
      ${options.showPractice ? `<button type="button" class="secondary" data-practice-wrong-bank="${escapeAttr(record.bankId)}">只練習此題庫錯題</button>` : ''}
      ${options.showPracticeFavorite ? `<button type="button" class="secondary" data-practice-favorite-bank="${escapeAttr(record.bankId)}">只練習此題庫收藏</button>` : ''}
    </div>
  `;
  setTimeout(() => {
    const imgBox = document.getElementById(imageWrapperId);
    const expBox = document.getElementById(expImageWrapperId);
    if (imgBox) renderImages(q.images || [], imgBox);
    if (expBox) renderImages(q.explanationImages || [], expBox);
  }, 0);
  return card;
}

function renderExamActive() {
  const area = $('examActiveArea');
  $('examResultArea').innerHTML = '';
  area.className = '';
  area.innerHTML = `
    <div class="exam-timer" id="examTimerText"></div>
    <div class="panel"><h3>${escapeHtml(state.exam.bankTitle)}</h3><p>請完成所有題目後交卷。未作答題目會以錯誤計算。</p></div>
    <form id="examForm"></form>
    <div class="panel"><button type="button" id="submitExamButton">交卷並批改</button></div>
  `;
  const form = $('examForm');
  state.exam.questions.forEach((q, index) => {
    const div = document.createElement('section');
    div.className = 'exam-question';
    const imgId = `exam-img-${q.id}-${index}`;
    div.innerHTML = `
      <div class="meta-row"><span class="badge">${index + 1}</span><span class="badge">${escapeHtml(q.id)}</span><span class="badge">${TYPE_LABELS[q.type]}</span></div>
      <h3>${escapeHtml(q.question)}</h3>
      <div id="${imgId}" class="image-list"></div>
      ${buildExamAnswerInputs(q, index)}
    `;
    form.appendChild(div);
    renderImages(q.images || [], div.querySelector(`#${CSS.escape(imgId)}`));
  });
  $('submitExamButton').addEventListener('click', submitExam);
  updateExamTimer();
}

function buildExamAnswerInputs(question, index) {
  const name = `exam_${index}`;
  if (question.type === 'single_choice') {
    return Object.entries(question.options || {}).map(([key, text]) => `<label class="option-row"><input type="radio" name="${name}" value="${escapeAttr(key)}" /> <span><strong>${escapeHtml(key)}.</strong> ${escapeHtml(text)}</span></label>`).join('');
  }
  if (question.type === 'multiple_choice') {
    return Object.entries(question.options || {}).map(([key, text]) => `<label class="option-row"><input type="checkbox" name="${name}" value="${escapeAttr(key)}" /> <span><strong>${escapeHtml(key)}.</strong> ${escapeHtml(text)}</span></label>`).join('');
  }
  if (question.type === 'true_false') {
    return `<label class="option-row"><input type="radio" name="${name}" value="true" /> O / 是</label><label class="option-row"><input type="radio" name="${name}" value="false" /> X / 否</label>`;
  }
  if (question.type === 'fill_blank') {
    return `<label>請輸入答案<input type="text" name="${name}" autocomplete="off" /></label>`;
  }
  return '';
}

function getExamAnswer(question, index) {
  const name = `exam_${index}`;
  if (question.type === 'single_choice') {
    const selected = document.querySelector(`input[name="${name}"]:checked`);
    return selected ? selected.value : '';
  }
  if (question.type === 'multiple_choice') {
    return Array.from(document.querySelectorAll(`input[name="${name}"]:checked`)).map(input => input.value).sort();
  }
  if (question.type === 'true_false') {
    const selected = document.querySelector(`input[name="${name}"]:checked`);
    return selected ? selected.value === 'true' : null;
  }
  if (question.type === 'fill_blank') {
    const input = document.querySelector(`input[name="${name}"]`);
    return input ? input.value : '';
  }
  return null;
}

function updateExamTimer() {
  if (!state.exam || state.exam.submitted) return;
  const remain = Math.max(0, state.exam.endTime - Date.now());
  const min = Math.floor(remain / 60000);
  const sec = Math.floor((remain % 60000) / 1000);
  const text = $('examTimerText');
  if (text) text.textContent = `剩餘時間：${String(min).padStart(2, '0')}:${String(sec).padStart(2, '0')}`;
  if (remain <= 0) submitExam();
}

function submitExam() {
  if (!state.exam || state.exam.submitted) return;
  state.exam.submitted = true;
  if (state.examTimerId) clearInterval(state.examTimerId);
  const records = state.exam.questions.map((q, index) => {
    const userAnswer = getExamAnswer(q, index);
    const isCorrect = checkAnswer(q, userAnswer);
    if (!isCorrect) updateWrongBookForBank(state.exam.bankId, state.exam.bankTitle, q, userAnswer);
    return {
      bankId: state.exam.bankId,
      bankTitle: state.exam.bankTitle,
      questionId: q.id,
      type: q.type,
      question: q.question,
      imagePaths: (q.images || []).map(img => img.src).join('; '),
      userAnswer,
      correctAnswer: q.answer,
      isCorrect,
      answeredAt: new Date().toISOString(),
      wrongCount: isCorrect ? 0 : 1,
      explanation: q.explanation,
      explanationImagePaths: (q.explanationImages || []).map(img => img.src).join('; '),
      snapshot: q
    };
  });
  const correct = records.filter(r => r.isCorrect).length;
  const total = records.length;
  const accuracy = total === 0 ? 0 : Math.round((correct / total) * 100);
  const examRecord = {
    bankId: state.exam.bankId,
    bankTitle: state.exam.bankTitle,
    submittedAt: new Date().toISOString(),
    total,
    correct,
    wrong: total - correct,
    score: accuracy,
    records
  };
  const all = loadFromLocalStorage(STORAGE_KEYS.examRecords, []);
  all.push(examRecord);
  saveToLocalStorage(STORAGE_KEYS.examRecords, all);
  renderExamResult(examRecord);
}

function renderExamResult(result, filter = 'all', shouldScrollTop = true) {
  $('examActiveArea').className = 'hidden';
  const area = $('examResultArea');
  const visibleRecords = filter === 'wrong' ? result.records.filter(record => !record.isCorrect) : result.records;
  area.innerHTML = `
    <div class="panel exam-result-summary">
      <h2>模擬考結果</h2>
      <div class="stats-list">
        ${statItem('得分', result.score)}
        ${statItem('正確率', `${result.score}%`)}
        ${statItem('答對題數', result.correct)}
        ${statItem('答錯題數', result.wrong)}
      </div>
      <div class="toolbar exam-result-filter" aria-label="模擬考結果顯示篩選">
        <button type="button" id="examResultShowAllButton" class="${filter === 'all' ? '' : 'secondary'}">查看全部題目</button>
        <button type="button" id="examResultShowWrongButton" class="${filter === 'wrong' ? '' : 'secondary'}">只看錯題</button>
      </div>
      <p class="muted">目前顯示：${filter === 'wrong' ? `錯題 ${visibleRecords.length} 題` : `全部 ${visibleRecords.length} 題`}</p>
    </div>
  `;

  $('examResultShowAllButton').addEventListener('click', () => renderExamResult(result, 'all', false));
  $('examResultShowWrongButton').addEventListener('click', () => renderExamResult(result, 'wrong', false));

  if (visibleRecords.length === 0) {
    const empty = document.createElement('div');
    empty.className = 'panel notice';
    empty.textContent = filter === 'wrong' ? '本次模擬考沒有錯題。' : '本次模擬考沒有可顯示的題目。';
    area.appendChild(empty);
  } else {
    visibleRecords.forEach(record => {
      area.appendChild(buildExamResultCard(record));
    });
  }

  renderLocalDataSummary();
  if (shouldScrollTop) {
    requestAnimationFrame(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      const resultPanel = area.querySelector('.exam-result-summary');
      if (resultPanel) resultPanel.focus?.({ preventScroll: true });
    });
  }
}

function buildExamResultCard(record) {
  const q = record.snapshot;
  const card = document.createElement('article');
  card.className = `record-card ${record.isCorrect ? 'exam-result-correct' : 'exam-result-wrong'}`;
  const imgId = `exam-result-img-${q.id}-${Math.random().toString(36).slice(2)}`;
  const expImgId = `exam-result-exp-${q.id}-${Math.random().toString(36).slice(2)}`;
  card.innerHTML = `
    <h3>${escapeHtml(q.id)}｜${escapeHtml(q.question)}</h3>
    <div class="meta-row"><span class="badge ${record.isCorrect ? 'success' : 'danger'}">${record.isCorrect ? '答對' : '答錯'}</span><span class="badge">${TYPE_LABELS[q.type]}</span></div>
    <div id="${imgId}" class="image-list"></div>
    <p>使用者答案：<span class="${record.isCorrect ? 'correct-text' : 'wrong-text'}">${escapeHtml(formatAnswerWithOptionText(q, record.userAnswer))}</span></p>
    <p>正確答案：<span class="correct-text">${escapeHtml(formatAnswerWithOptionText(q, q.answer))}</span></p>
    ${buildExamResultOptionReview(q, record.userAnswer)}
    <p>詳解：${escapeHtml(q.explanation)}</p>
    <div id="${expImgId}" class="image-list"></div>
  `;
  setTimeout(() => {
    renderImages(q.images || [], document.getElementById(imgId));
    renderImages(q.explanationImages || [], document.getElementById(expImgId));
  }, 0);
  return card;
}

function formatAnswerWithOptionText(question, answer) {
  if (question.type === 'single_choice') {
    return formatOptionAnswer(question, answer);
  }
  if (question.type === 'multiple_choice') {
    if (!Array.isArray(answer) || answer.length === 0) return '未作答';
    return answer.map(item => formatOptionAnswer(question, item)).join('；');
  }
  return formatAnswer(question, answer);
}

function formatOptionAnswer(question, answerKey) {
  if (answerKey === null || answerKey === undefined || answerKey === '') return '未作答';
  const key = String(answerKey);
  const optionText = question.options?.[key];
  return optionText ? `${key}. ${optionText}` : key;
}

function buildExamResultOptionReview(question, userAnswer) {
  if (question.type === 'single_choice' || question.type === 'multiple_choice') {
    const correctSet = new Set((Array.isArray(question.answer) ? question.answer : [question.answer]).map(item => String(item)));
    const userSet = new Set((Array.isArray(userAnswer) ? userAnswer : (userAnswer ? [userAnswer] : [])).map(item => String(item)));
    const rows = Object.entries(question.options || {}).map(([key, text]) => {
      const isCorrectOption = correctSet.has(String(key));
      const isSelectedOption = userSet.has(String(key));
      const classes = ['answer-option-item'];
      if (isCorrectOption) classes.push('correct');
      if (isSelectedOption && !isCorrectOption) classes.push('wrong');
      if (isSelectedOption) classes.push('selected');
      const flags = [
        isSelectedOption ? '<span class="mini-badge selected">你的答案</span>' : '',
        isCorrectOption ? '<span class="mini-badge correct">正確答案</span>' : ''
      ].join('');
      return `
        <div class="${classes.join(' ')}">
          <span class="option-code">${escapeHtml(key)}</span>
          <span class="option-text">${escapeHtml(text)}</span>
          <span class="option-flags">${flags}</span>
        </div>
      `;
    }).join('');
    return `<div class="answer-option-review"><h4>選項內容</h4>${rows}</div>`;
  }

  if (question.type === 'true_false') {
    const choices = [
      { value: true, label: 'O / 是 / 正確' },
      { value: false, label: 'X / 否 / 錯誤' }
    ];
    const rows = choices.map(choice => {
      const isCorrectOption = question.answer === choice.value;
      const isSelectedOption = userAnswer === choice.value;
      const classes = ['answer-option-item'];
      if (isCorrectOption) classes.push('correct');
      if (isSelectedOption && !isCorrectOption) classes.push('wrong');
      if (isSelectedOption) classes.push('selected');
      const flags = [
        isSelectedOption ? '<span class="mini-badge selected">你的答案</span>' : '',
        isCorrectOption ? '<span class="mini-badge correct">正確答案</span>' : ''
      ].join('');
      return `
        <div class="${classes.join(' ')}">
          <span class="option-code">${choice.value ? 'O' : 'X'}</span>
          <span class="option-text">${escapeHtml(choice.label)}</span>
          <span class="option-flags">${flags}</span>
        </div>
      `;
    }).join('');
    return `<div class="answer-option-review"><h4>選項內容</h4>${rows}</div>`;
  }

  if (question.type === 'fill_blank' && Array.isArray(question.answer)) {
    return `<div class="answer-option-review"><h4>可接受答案</h4><p>${escapeHtml(question.answer.join('；'))}</p></div>`;
  }

  return '';
}

function updateWrongBookForBank(bankId, bankTitle, question, userAnswer) {
  const wrongBook = loadFromLocalStorage(STORAGE_KEYS.wrongBook, {});
  if (!wrongBook[bankId]) wrongBook[bankId] = {};
  const existing = wrongBook[bankId][question.id] || { count: 0 };
  wrongBook[bankId][question.id] = {
    bankId,
    bankTitle,
    questionId: question.id,
    count: existing.count + 1,
    lastWrongAt: new Date().toISOString(),
    lastUserAnswer: userAnswer,
    snapshot: question
  };
  saveToLocalStorage(STORAGE_KEYS.wrongBook, wrongBook);
}

function updateFavoriteButton() {
  const q = state.practice?.currentQuestion;
  const bankId = state.currentBankData?.bankId;
  if (!q || !bankId) return;
  const favorites = loadFromLocalStorage(STORAGE_KEYS.favorites, {});
  $('favoriteButton').textContent = favorites[bankId]?.[q.id] ? '取消收藏' : '加入收藏';
}

function appendAnswerRecord(record) {
  const all = loadFromLocalStorage(STORAGE_KEYS.answerRecords, []);
  all.push(record);
  saveToLocalStorage(STORAGE_KEYS.answerRecords, all.slice(-1000));
}

function createAnswerRecord(question, userAnswer, isCorrect) {
  return {
    bankTitle: state.currentBankData.title,
    bankId: state.currentBankData.bankId,
    questionId: question.id,
    type: question.type,
    question: question.question,
    imagePaths: (question.images || []).map(img => img.src).join('; '),
    userAnswer,
    correctAnswer: question.answer,
    isCorrect,
    answeredAt: new Date().toISOString(),
    wrongCount: state.practice.roundErrors[question.id] || 0,
    explanation: question.explanation,
    explanationImagePaths: (question.explanationImages || []).map(img => img.src).join('; '),
    snapshot: question
  };
}

function collectWrongBookRecords() {
  const wrongBook = loadFromLocalStorage(STORAGE_KEYS.wrongBook, {});
  return Object.values(wrongBook).flatMap(bank => Object.values(bank));
}

function collectFavoriteRecords() {
  const favorites = loadFromLocalStorage(STORAGE_KEYS.favorites, {});
  return Object.values(favorites).flatMap(bank => Object.values(bank));
}

function exportData(filename, data, type) {
  const content = type === 'json' ? JSON.stringify(data, null, 2) : data;
  const mime = type === 'json' ? 'application/json;charset=utf-8' : 'text/csv;charset=utf-8';
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

function recordsToCsv(records) {
  const header = ['題庫名稱', '題庫 ID', '題目 ID', '題型', '題目內容', '圖片路徑', '使用者答案', '正確答案', '是否答對', '答題時間', '錯誤次數', '詳解', '詳解圖片路徑'];
  const rows = records.map(r => [
    r.bankTitle || r.snapshot?.bankTitle || '',
    r.bankId || '',
    r.questionId || r.snapshot?.id || '',
    TYPE_LABELS[r.type || r.snapshot?.type] || r.type || r.snapshot?.type || '',
    r.question || r.snapshot?.question || '',
    r.imagePaths || (r.snapshot?.images || []).map(img => img.src).join('; '),
    formatRawAnswer(r.userAnswer || r.lastUserAnswer || ''),
    formatRawAnswer(r.correctAnswer || r.snapshot?.answer || ''),
    typeof r.isCorrect === 'boolean' ? (r.isCorrect ? '是' : '否') : '',
    r.answeredAt || r.lastWrongAt || '',
    r.wrongCount ?? r.count ?? '',
    r.explanation || r.snapshot?.explanation || '',
    r.explanationImagePaths || (r.snapshot?.explanationImages || []).map(img => img.src).join('; ')
  ]);
  return [header, ...rows].map(row => row.map(csvEscape).join(',')).join('\n');
}

async function loadQuestionBankForExam(bankId) {
  const meta = findBankMeta(bankId);
  if (!meta) {
    showMessage('請先選擇題庫。', 'warning');
    return null;
  }
  if (meta.imported) return state.importedBanks[bankId];
  try {
    const response = await fetch(meta.file, { cache: 'no-store' });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const bank = await response.json();
    const errors = validateQuestionBank(bank);
    if (errors.length) throw new Error(errors.join('；'));
    return bank;
  } catch (error) {
    showMessage(`模擬考題庫載入失敗：${error.message}`, 'error');
    return null;
  }
}

function getAllBankMetas() {
  const imported = Object.values(state.importedBanks || {}).map(bank => ({
    id: bank.bankId,
    title: bank.title,
    description: bank.description,
    file: null,
    category: bank.category,
    version: bank.version,
    questionCount: Array.isArray(bank.questions) ? bank.questions.length : 0,
    createdDate: bank.createdDate,
    enabled: true,
    imported: true
  }));
  const staticBanks = (state.banks || []).map(bank => ({ ...bank, imported: false }));
  const importedIds = new Set(imported.map(bank => bank.id));
  return [...imported, ...staticBanks.filter(bank => !importedIds.has(bank.id))];
}

function findBankMeta(bankId) {
  return getAllBankMetas().find(bank => bank.id === bankId) || null;
}

function findQuestionById(id) {
  return state.currentBankData?.questions.find(q => q.id === id) || null;
}

function formatAnswer(question, answer) {
  if (question.type === 'true_false') return answer === true ? 'O / 是 / 正確' : answer === false ? 'X / 否 / 錯誤' : '未作答';
  if (Array.isArray(answer)) return answer.join(', ');
  if (answer === null || answer === undefined || answer === '') return '未作答';
  return String(answer);
}

function formatRawAnswer(answer) {
  if (Array.isArray(answer)) return answer.join('; ');
  if (typeof answer === 'object' && answer !== null) return JSON.stringify(answer);
  return String(answer ?? '');
}

function isEmptyAnswer(answer, type) {
  if (type === 'multiple_choice') return !Array.isArray(answer) || answer.length === 0;
  if (type === 'true_false') return answer === null;
  return answer === '' || answer === null || answer === undefined;
}

function showPage(pageId) {
  document.querySelectorAll('.page').forEach(page => page.classList.remove('active-page'));
  $(pageId).classList.add('active-page');
  renderLocalDataSummary();
  if (pageId === 'examPage') populateExamBankSelect();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function showMessage(text, type = 'success') {
  const area = $('messageArea');
  area.innerHTML = `<div class="message ${type}">${escapeHtml(text)}</div>`;
  setTimeout(() => {
    if (area.textContent === text) area.innerHTML = '';
  }, 5000);
}

function populateExamBankSelect() {
  const select = $('examBankSelect');
  if (!select) return;
  select.innerHTML = getAllBankMetas().map(bank => `<option value="${escapeAttr(bank.id)}">${escapeHtml(bank.title)}（${escapeHtml(bank.category || '未分類')}）</option>`).join('');
}

function setSelectOptions(select, values, allLabel) {
  select.innerHTML = values.map(value => {
    const label = value === 'all' ? allLabel : value;
    return `<option value="${escapeAttr(value)}">${escapeHtml(label)}</option>`;
  }).join('');
}

function statItem(label, value) {
  return `<div class="stat-item"><span>${escapeHtml(label)}</span><strong>${escapeHtml(String(value))}</strong></div>`;
}

function clearAllLocalData() {
  if (!confirm('確定清除所有本機資料？此動作無法復原。')) return;
  Object.values(STORAGE_KEYS).forEach(key => localStorage.removeItem(key));
  state.importedBanks = {};
  state.practice = null;
  renderQuestionBankList();
  populateExamBankSelect();
  renderLocalDataSummary();
  showMessage('所有本機資料已清除。', 'success');
}

function bindGlobalEvents() {
  document.addEventListener('click', event => {
    const nav = event.target.closest('[data-nav]');
    if (nav) {
      const target = nav.dataset.nav;
      if (target === 'home') showPage('homePage');
      if (target === 'wrongBook') renderWrongBookPage();
      if (target === 'favorites') renderFavoritesPage();
      if (target === 'exam') showPage('examPage');
      if (target === 'aiPrompt') showPage('aiPromptPage');
      if (target === 'settings') showPage('settingsPage');
    }

    const bankAction = event.target.closest('[data-bank-action]');
    if (bankAction) {
      const action = bankAction.dataset.bankAction;
      const bankId = bankAction.dataset.bankId;
      if (action === 'detail') loadQuestionBank(bankId);
      if (action === 'wrong') startWrongBookPractice(bankId);
      if (action === 'favorite') startFavoritePractice(bankId);
      if (action === 'deleteImported') deleteImportedQuestionBank(bankId);
    }

    const removeWrong = event.target.closest('[data-remove-wrong]');
    if (removeWrong) {
      const [bankId, questionId] = removeWrong.dataset.removeWrong.split('|');
      removeFromWrongBook(bankId, questionId);
    }

    const removeFavorite = event.target.closest('[data-remove-favorite]');
    if (removeFavorite) {
      const [bankId, questionId] = removeFavorite.dataset.removeFavorite.split('|');
      removeFromFavorite(bankId, questionId);
    }

    const practiceWrong = event.target.closest('[data-practice-wrong-bank]');
    if (practiceWrong) startWrongBookPractice(practiceWrong.dataset.practiceWrongBank);

    const practiceFavorite = event.target.closest('[data-practice-favorite-bank]');
    if (practiceFavorite) startFavoritePractice(practiceFavorite.dataset.practiceFavoriteBank);

    const deleteImported = event.target.closest('[data-delete-imported]');
    if (deleteImported) deleteImportedQuestionBank(deleteImported.dataset.deleteImported);
  });

  $('bankSearchInput').addEventListener('input', renderQuestionBankList);
  $('importBankInput').addEventListener('change', event => importQuestionBank(event.target.files[0]));
  ['questionSearchInput', 'typeFilter', 'difficultyFilter', 'tagFilter', 'chapterFilter', 'imageFilter'].forEach(id => {
    $(id).addEventListener('input', applyQuestionFilters);
    $(id).addEventListener('change', applyQuestionFilters);
  });
  $('startPracticeButton').addEventListener('click', () => startPractice());
  $('startWrongPracticeButton').addEventListener('click', () => startWrongBookPractice());
  $('startFavoritePracticeButton').addEventListener('click', () => startFavoritePractice());
  $('resumePracticeButton').addEventListener('click', loadProgress);
  $('clearCurrentProgressButton').addEventListener('click', () => { clearProgress(); showMessage('目前題庫進度已清除。', 'success'); });
  $('submitAnswerButton').addEventListener('click', handlePracticeActionButton);
  $('nextQuestionButton').addEventListener('click', nextQuestion);
  $('favoriteButton').addEventListener('click', toggleFavoriteQuestion);
  $('backToBankButton').addEventListener('click', () => showPage('bankDetailPage'));
  $('restartPracticeButton').addEventListener('click', () => startPractice(state.filteredQuestions.length ? state.filteredQuestions : state.currentBankData.questions));
  $('finishWrongPracticeButton').addEventListener('click', () => startWrongBookPractice(state.currentBankData?.bankId));
  $('exportRoundJsonButton').addEventListener('click', exportRoundRecordToJSON);
  $('exportRoundCsvButton').addEventListener('click', exportRoundRecordToCSV);
  $('exportWrongJsonButton').addEventListener('click', exportWrongBookToJSON);
  $('exportWrongCsvButton').addEventListener('click', exportWrongBookToCSV);
  $('clearWrongBookButton').addEventListener('click', () => { if (confirm('確定清除錯題本？')) { saveToLocalStorage(STORAGE_KEYS.wrongBook, {}); renderWrongBookPage(); } });
  $('exportFavoritesJsonButton').addEventListener('click', exportFavoritesToJSON);
  $('clearFavoritesButton').addEventListener('click', () => { if (confirm('確定清除收藏題目？')) { saveToLocalStorage(STORAGE_KEYS.favorites, {}); renderFavoritesPage(); } });
  $('startExamButton').addEventListener('click', startExamMode);
  $('copyAiPromptButton').addEventListener('click', copyAiPrompt);
  $('downloadAiPromptButton').addEventListener('click', () => exportData('moxin-ai-question-bank-prompt.txt', AI_PROMPT, 'txt'));
  $('exportAllDataButton').addEventListener('click', exportAllLocalData);
  $('importAllDataInput').addEventListener('change', event => importAllLocalData(event.target.files[0]));
  $('clearAllLocalDataButton').addEventListener('click', clearAllLocalData);
}

function copyAiPrompt() {
  navigator.clipboard.writeText(AI_PROMPT).then(() => {
    showMessage('提示詞已複製。', 'success');
  }).catch(() => {
    showMessage('複製失敗，請手動選取提示詞內容。', 'error');
  });
}

function csvEscape(value) {
  const text = String(value ?? '');
  return `"${text.replace(/"/g, '""')}"`;
}

function escapeHtml(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function escapeAttr(value) {
  return escapeHtml(value).replace(/`/g, '&#096;');
}

function normalizeText(value) {
  return String(value ?? '').trim().toLowerCase();
}

function isPlainObject(value) {
  return Object.prototype.toString.call(value) === '[object Object]';
}

function isAllowedImagePath(src) {
  const clean = src.split('?')[0].split('#')[0];
  const ext = clean.includes('.') ? clean.split('.').pop().toLowerCase() : '';
  return ALLOWED_IMAGE_EXT.includes(ext);
}

function cssEscape(value) {
  return window.CSS && CSS.escape ? CSS.escape(String(value)) : String(value).replace(/[^a-zA-Z0-9_-]/g, '\\$&');
}

function formatDateTime(value) {
  if (!value) return '';
  try {
    return new Date(value).toLocaleString('zh-TW', { hour12: false });
  } catch {
    return value;
  }
}

// ==================================================
// 未來 AI 擴充預留區
// ==================================================
// function generateQuestionBankWithAI(sourceFile) {}
// function generateExplanationWithAI(question) {}
// function analyzeWrongQuestionsWithAI(records) {}
// function summarizeExamPointsWithAI(bankData) {}
// 注意：目前版本不串接 AI API，不放置 API Key，不提供 AI 猜題或自由出題。

window.addEventListener('DOMContentLoaded', initApp);
