document.addEventListener('DOMContentLoaded', () => {
    // Elements
    const uploadInput = document.getElementById('json-upload');
    const xlsxUploadInput = document.getElementById('xlsx-upload');
    const tabBooks = document.getElementById('tab-books');
    const tabChapters = document.getElementById('tab-chapters');
    const tabXlsx = document.getElementById('tab-xlsx');
    const sidebarSearch = document.getElementById('sidebar-search');
    const listContainer = document.getElementById('list-container');
    const menuBtn = document.getElementById('menu-btn');
    const sidebar = document.getElementById('sidebar');
    const themeToggle = document.getElementById('theme-toggle');

    // Theme logic
    if (localStorage.getItem('theme') === 'dark') {
        document.body.classList.add('dark-mode');
        themeToggle.innerHTML = '<i class="fa-solid fa-sun"></i>';
    }

    themeToggle.addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');
        if (document.body.classList.contains('dark-mode')) {
            localStorage.setItem('theme', 'dark');
            themeToggle.innerHTML = '<i class="fa-solid fa-sun"></i>';
        } else {
            localStorage.setItem('theme', 'light');
            themeToggle.innerHTML = '<i class="fa-solid fa-moon"></i>';
        }
    });

    const homeView = document.getElementById('home-view');
    const chapterView = document.getElementById('chapter-view');
    const mergeView = document.getElementById('merge-view');
    const xlsxView = document.getElementById('xlsx-view');

    // Chapter View Elements
    const bcBook = document.getElementById('bc-book');
    const bcTitle = document.getElementById('bc-title');
    const chapterInfo = document.getElementById('chapter-info');
    const hadithsContainer = document.getElementById('hadiths-container');

    // Home View Elements
    const homeSearch = document.getElementById('global-search');
    const bookPills = document.getElementById('book-pills');
    const homeEmptyState = document.getElementById('home-empty-state');

    // Merge View Elements
    const btnOpenMerge = document.getElementById('btn-open-merge');
    const mergeBookName = document.getElementById('merge-book-name');
    const mergeFileInput = document.getElementById('merge-file-input');
    const mergeFileList = document.getElementById('merge-file-list');
    const btnDoMerge = document.getElementById('btn-do-merge');
    const btnDoMergeXlsx = document.getElementById('btn-do-merge-xlsx');
    let stagedFiles = [];

    // XLSX View Elements
    const xlsxBookSummary = document.getElementById('xlsx-book-summary');
    const btnExportSelectedXlsx = document.getElementById('btn-export-selected-xlsx');
    const xlsxPreviewMeta = document.getElementById('xlsx-preview-meta');
    const xlsxSheetTabs = document.getElementById('xlsx-sheet-tabs');
    const xlsxSheetEmpty = document.getElementById('xlsx-sheet-empty');
    const xlsxSheetTable = document.getElementById('xlsx-sheet-table');

    // Go Home Buttons
    const goHomeBtns = document.querySelectorAll('.go-home-btn');

    // Application State
    let dbBooks = [];
    let globalChapterCounter = 0;

    let activeTab = 'books';
    let currentBookId = null;
    let currentChapterId = null;
    let activePreviewSheet = 'chapter';

    // Convert numbers to Bengali
    const numMap = { '0': '০', '1': '১', '2': '২', '3': '৩', '4': '৪', '5': '৫', '6': '৬', '7': '৭', '8': '৮', '9': '৯' };
    const toBnNum = (n) => String(n).replace(/[0-9]/g, w => numMap[w]);

    // Grade ID to Name mapping
    const gradeIdToName = {
        1: "নির্ণীত নয়",
        2: "সহিহ হাদিস",
        3: "হাসান হাদিস",
        4: "দুর্বল হাদিস",
        5: "জাল হাদিস",
        6: "অন্যান্য",
        7: "সহিহ লিগাইরিহি",
        8: "সহিহ মাকতু",
        9: "সহিহ মাওকুফ",
        10: "সহিহ মারফু",
        11: "সহিহ মুতওয়াতির",
        12: "হাসান সহিহ",
        13: "হাসান মাওকুফ",
        14: "হাসান মাকতু",
        15: "হাসান লিগাইরিহি",
        16: "খুবই দুর্বল",
        17: "দুর্বল মুনকার",
        18: "দুর্বল মাকতু",
        19: "দুর্বল মাওকুফ",
        20: "শায",
        21: "মুনকার",
        22: "সহিহ মওকুফ শায",
        23: "শায মাকতু",
        24: "মাকতু মারফুজ",
        25: "দুর্বল মুরসাল",
        26: "দুর্বল মারফু",
        27: "দুর্বল মুযতারিব",
        28: "দুর্বল মুদাল",
        29: "মিশ্র",
        30: "খুবই দুর্বল মাকতু",
        31: "দুর্বল মুনকাতি",
        32: "বাতিল",
        33: "দুর্বল শায",
        34: "মুরসাল",
        35: "মাক্বতু",
        36: "সহীহ লিযাতিহী",
        37: "হাসান লিযাতিহী",
        38: "মু'আল্লাক",
        39: "মুনকাতি",
        40: "মু'দাল",
        41: "মুদাল্লাস",
        42: "মা'রুফ",
        43: "মাতরূক",
        44: "মুবহাম",
        45: "মুদরাজ",
        46: "মুতাওয়াতির",
        47: "খবর ওয়াহিদ",
        48: "মওকুফ",
        49: "মুত্তাসিল",
        50: "মাহফু্য",
        51: "মাজহুল",
        52: "জাহালাত",
        53: "তাবে",
        54: "শাহিদ",
        55: "মুতাবা'আত",
        56: "মুসাহহাফ",
        57: "হাদীস",
        58: "সুন্নাহ",
        59: "খবর",
        60: "আসার",
        61: "ইলমে হাদীসের কতিপয় পরিভাষা",
        62: "তা'লীক",
        63: "মুতাবি ও শাহিদ"
    };

    function formatBookName(filename) {
        let name = filename.replace(/\.json$/i, '');
        name = name.replace(/[-_]/g, ' ');
        return name;
    }

    // Normal Upload (Single book from 1 or more isolated files)
    uploadInput.addEventListener('change', async (e) => {
        const files = Array.from(e.target.files);
        if (files.length === 0) return;

        for (const file of files) {
            try {
                const text = await readFileAsync(file);
                parseAndAddBook(text, formatBookName(file.name));
            } catch (err) {
                console.error("Error reading file", file.name, err);
                alert(`Error reading ${file.name}`);
            }
        }

        uploadInput.value = '';
        showHomeView();
    });

    // XLSX Upload Handler
    xlsxUploadInput.addEventListener('change', async (e) => {
        const files = Array.from(e.target.files);
        if (files.length === 0) return;

        for (const file of files) {
            try {
                const data = await readXlsxFileAsync(file);
                const collection = parseXlsxToCollection(data);
                if (collection) {
                    const bookName = formatBookName(file.name.replace(/\.xlsx?$/i, ''));
                    buildBookFromCollections([collection], bookName);
                }
            } catch (err) {
                console.error("Error reading XLSX file", file.name, err);
                alert(`XLSX ফাইল পড়তে সমস্যা হয়েছে: ${file.name}`);
            }
        }

        xlsxUploadInput.value = '';
        showHomeView();
    });

    function readXlsxFileAsync(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (e) => {
                try {
                    const data = new Uint8Array(e.target.result);
                    const workbook = XLSX.read(data, { type: 'array' });
                    resolve(workbook);
                } catch (err) {
                    reject(err);
                }
            };
            reader.onerror = (e) => reject(e);
            reader.readAsArrayBuffer(file);
        });
    }

    function parseXlsxToCollection(workbook) {
        let chapterSheet = null;
        let sectionSheet = null;
        let hadithSheet = null;
        const parsedRowsBySheetName = {};

        // Find sheets by name (case-insensitive)
        for (const name of workbook.SheetNames) {
            const lowerName = name.toLowerCase();
            const sheet = workbook.Sheets[name];
            const rows = sheet ? XLSX.utils.sheet_to_json(sheet, { defval: '' }) : [];
            parsedRowsBySheetName[name] = rows;

            if (lowerName.includes('chapter') && !chapterSheet) {
                chapterSheet = sheet;
            } else if (lowerName.includes('section') && !sectionSheet) {
                sectionSheet = sheet;
            } else if (lowerName.includes('hadith') && !hadithSheet) {
                hadithSheet = sheet;
            }
        }

        function getSheetHeaders(rows) {
            if (!Array.isArray(rows) || rows.length === 0 || !rows[0] || typeof rows[0] !== 'object') {
                return [];
            }
            return Object.keys(rows[0]).map(k => normalizeXlsxKey(k));
        }

        function scoreSheet(headers, kind) {
            const headerSet = new Set(headers);
            const hasAny = (...keys) => keys.some(k => headerSet.has(k));

            if (kind === 'chapter') {
                let score = 0;
                if (hasAny('chapter_id', 'chapterid', 'chapter', 'id')) score += 6;
                if (hasAny('title', 'name')) score += 4;
                if (hasAny('display_number', 'displaynumber', 'number')) score += 2;
                if (hasAny('hadith_id', 'content', 'ar')) score -= 2;
                return score;
            }

            if (kind === 'section') {
                let score = 0;
                if (hasAny('section_id', 'sectionid', 'section')) score += 6;
                if (hasAny('chapter_id', 'chapterid', 'chapter')) score += 3;
                if (hasAny('title', 'ar_title', 'preface')) score += 2;
                if (hasAny('hadith_id', 'content', 'ar')) score -= 2;
                return score;
            }

            if (kind === 'hadith') {
                let score = 0;
                if (hasAny('hadith_id', 'hadithid', 'hadith', 'id')) score += 6;
                if (hasAny('chapter_id', 'chapterid', 'chapter')) score += 3;
                if (hasAny('section_id', 'sectionid', 'section')) score += 2;
                if (hasAny('content', 'text', 'hadith_text', 'ar', 'narrator')) score += 4;
                return score;
            }

            return 0;
        }

        function pickBestSheet(kind, alreadyPicked = new Set()) {
            let bestName = null;
            let bestScore = -Infinity;

            workbook.SheetNames.forEach(name => {
                if (alreadyPicked.has(name)) return;
                const rows = parsedRowsBySheetName[name] || [];
                const headers = getSheetHeaders(rows);
                const score = scoreSheet(headers, kind);
                if (score > bestScore) {
                    bestScore = score;
                    bestName = name;
                }
            });

            if (!bestName || bestScore <= 0) return null;
            return workbook.Sheets[bestName] || null;
        }

        // Fallback: detect by headers if named sheets are missing or named unexpectedly.
        const usedNames = new Set();
        if (chapterSheet) usedNames.add(workbook.SheetNames.find(n => workbook.Sheets[n] === chapterSheet));
        if (sectionSheet) usedNames.add(workbook.SheetNames.find(n => workbook.Sheets[n] === sectionSheet));
        if (hadithSheet) usedNames.add(workbook.SheetNames.find(n => workbook.Sheets[n] === hadithSheet));

        if (!chapterSheet) {
            chapterSheet = pickBestSheet('chapter', usedNames);
            const picked = workbook.SheetNames.find(n => workbook.Sheets[n] === chapterSheet);
            if (picked) usedNames.add(picked);
        }
        if (!sectionSheet) {
            sectionSheet = pickBestSheet('section', usedNames);
            const picked = workbook.SheetNames.find(n => workbook.Sheets[n] === sectionSheet);
            if (picked) usedNames.add(picked);
        }
        if (!hadithSheet) {
            hadithSheet = pickBestSheet('hadith', usedNames);
            const picked = workbook.SheetNames.find(n => workbook.Sheets[n] === hadithSheet);
            if (picked) usedNames.add(picked);
        }

        // Final fallback: use first three sheets if still missing
        if (!chapterSheet && workbook.SheetNames[0]) {
            chapterSheet = workbook.Sheets[workbook.SheetNames[0]];
        }
        if (!sectionSheet && workbook.SheetNames[1]) {
            sectionSheet = workbook.Sheets[workbook.SheetNames[1]];
        }
        if (!hadithSheet && workbook.SheetNames[2]) {
            hadithSheet = workbook.Sheets[workbook.SheetNames[2]];
        }

        const chapters = chapterSheet ? XLSX.utils.sheet_to_json(chapterSheet, { defval: '' }) : [];
        const sections = sectionSheet ? XLSX.utils.sheet_to_json(sectionSheet, { defval: '' }) : [];
        const hadiths = hadithSheet ? XLSX.utils.sheet_to_json(hadithSheet, { defval: '' }) : [];

        // Normalize field names and data types
        const normalizedChapters = chapters.map(row => normalizeXlsxRow(row, 'chapter'));
        const normalizedSections = sections.map(row => normalizeXlsxRow(row, 'section'));
        const normalizedHadiths = hadiths.map(row => normalizeXlsxRow(row, 'hadith'));

        return {
            chapters: normalizedChapters,
            sections: normalizedSections,
            hadiths: normalizedHadiths
        };
    }

    function normalizeXlsxKey(key) {
        return String(key ?? '')
            .replace(/^\uFEFF/, '') // Remove UTF-8 BOM if present in first header
            .replace(/[\u200B-\u200D\u2060]/g, '') // Remove zero-width chars
            .trim()
            .toLowerCase()
            .replace(/[\s./\\-]+/g, '_')
            .replace(/_+/g, '_');
    }

    function normalizeIdForLookup(value) {
        if (value === null || value === undefined) return '';

        const banglaToAscii = { '০': '0', '১': '1', '২': '2', '৩': '3', '৪': '4', '৫': '5', '৬': '6', '৭': '7', '৮': '8', '৯': '9' };
        const raw = String(value).trim().replace(/[০-৯]/g, d => banglaToAscii[d] || d);
        if (!raw) return '';

        if (/^-?\d+(\.0+)?$/.test(raw)) {
            return String(parseInt(raw, 10));
        }
        return raw.toLowerCase();
    }

    function normalizeXlsxRow(row, type) {
        const normalized = {};

        for (const key in row) {
            const lowerKey = normalizeXlsxKey(key);
            const compactKey = lowerKey.replace(/_/g, '');
            let value = row[key];

            // Convert numeric strings to numbers for ID fields
            if (lowerKey.includes('id') || lowerKey === 'page') {
                if (typeof value === 'string' && /^\d+$/.test(value.trim())) {
                    value = parseInt(value.trim(), 10);
                } else if (typeof value === 'number') {
                    value = Math.floor(value);
                }
            }

            // Map common field names
            if (lowerKey === 'chapter_id' || compactKey === 'chapterid' || lowerKey === 'chapter') {
                normalized.chapter_id = value;
            } else if (lowerKey === 'section_id' || compactKey === 'sectionid' || lowerKey === 'section') {
                normalized.section_id = value;
            } else if (lowerKey === 'hadith_id' || compactKey === 'hadithid' || lowerKey === 'hadith' || lowerKey === 'id') {
                normalized.hadith_id = value;
            } else if (lowerKey === 'display_number' || compactKey === 'displaynumber' || lowerKey === 'number') {
                normalized.display_number = value;
            } else if (lowerKey === 'title' || lowerKey === 'name') {
                normalized.title = value;
            } else if (lowerKey === 'ar_title' || compactKey === 'artitle' || lowerKey === 'arabic_title') {
                normalized.ar_title = value;
            } else if (lowerKey === 'preface' || lowerKey === 'introduction' || lowerKey === 'intro') {
                normalized.preface = value;
            } else if (lowerKey === 'page') {
                normalized.page = value;
            } else if (lowerKey === 'narrator' || lowerKey === 'rawi' || lowerKey === 'narrated_by') {
                normalized.narrator = value;
            } else if (lowerKey === 'grade' || lowerKey === 'status') {
                normalized.grade = value;
            } else if (lowerKey === 'grade_id' || compactKey === 'gradeid') {
                // Convert grade_id to grade name
                const gradeId = typeof value === 'string' ? parseInt(value.trim(), 10) : (typeof value === 'number' ? Math.floor(value) : value);
                normalized.grade_id = gradeId;
                if (gradeIdToName[gradeId]) {
                    normalized.grade = gradeIdToName[gradeId];
                }
            } else if (lowerKey === 'ar' || lowerKey === 'arabic' || lowerKey === 'ar_text') {
                normalized.ar = value;
            } else if (lowerKey === 'content' || lowerKey === 'text' || lowerKey === 'hadith_text' || lowerKey === 'body' || lowerKey === 'translation') {
                normalized.content = value;
            } else if (lowerKey === 'note' || lowerKey === 'notes' || lowerKey === 'footnote' || lowerKey === 'reference') {
                normalized.note = value;
            } else if (lowerKey === 'label') {
                normalized.label = value;
            } else {
                // Keep original key for unrecognized fields
                normalized[key] = value;
            }
        }

        return normalized;
    }

    function readFileAsync(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = e => resolve(e.target.result);
            reader.onerror = e => reject(e);
            reader.readAsText(file);
        });
    }

    function parseRawDataRaw(rawData) {
        try {
            return JSON.parse(rawData);
        } catch (parseErr) {
            if (rawData.startsWith('{') && rawData.endsWith('}')) {
                let arrayString = '[' + rawData.replace(/\}\s*\{/g, '},{') + ']';
                return JSON.parse(arrayString);
            }
            throw parseErr;
        }
    }

    function parseAndAddBook(rawData, bookName) {
        const parsedData = parseRawDataRaw(rawData);
        const collections = Array.isArray(parsedData) ? parsedData : [parsedData];

        buildBookFromCollections(collections, bookName);
    }

    function buildBookFromCollections(collections, bookName) {
        let newBook = {
            id: 'book_' + Date.now() + '_' + Math.floor(Math.random() * 1000),
            name: bookName,
            chapters: [],
            sections: [],
            hadiths: [],
            totalHadiths: 0,
            exportData: {
                chapters: [],
                sections: [],
                hadiths: []
            }
        };

        collections.forEach(collection => {
            if (!collection) return;

            const chapterList = Array.isArray(collection.chapters) ? collection.chapters : [];
            const sectionList = Array.isArray(collection.sections) ? collection.sections : [];
            const hadithList = Array.isArray(collection.hadiths) ? collection.hadiths : [];

            // Keep raw structures for XLSX export
            newBook.exportData.chapters.push(...chapterList.map(c => ({ ...c })));
            newBook.exportData.sections.push(...sectionList.map(s => ({ ...s })));
            newBook.exportData.hadiths.push(...hadithList.map(h => ({ ...h })));

            if (chapterList.length === 0 || hadithList.length === 0) return;

            let chapterIdMapping = {};
            let firstInternalChapterId = null;

            chapterList.forEach(c => {
                globalChapterCounter++;
                // Use string key for consistent mapping
                const rawChapterId = c.chapter_id ?? c.id ?? globalChapterCounter;
                const chapterId = String(rawChapterId);
                chapterIdMapping[chapterId] = globalChapterCounter;
                const normalizedChapterId = normalizeIdForLookup(rawChapterId);
                if (normalizedChapterId) {
                    chapterIdMapping[normalizedChapterId] = globalChapterCounter;
                }
                if (firstInternalChapterId === null) {
                    firstInternalChapterId = globalChapterCounter;
                }

                newBook.chapters.push({
                    ...c,
                    chapter_id: c.chapter_id ?? c.id ?? globalChapterCounter,
                    internal_chapter_id: globalChapterCounter,
                    original_chapter_id: c.chapter_id ?? c.id ?? globalChapterCounter,
                    bookId: newBook.id
                });
            });

            sectionList.forEach(s => {
                newBook.sections.push({
                    ...s,
                    chapter_id: s.chapter_id ?? s.id,
                    section_id: s.section_id ?? s.id,
                    bookId: newBook.id
                });
            });

            hadithList.forEach(h => {
                // Use string key for consistent lookup
                const rawHadithChapterId = h.chapter_id;
                const hadithChapterId = String(rawHadithChapterId ?? '');
                const normalizedHadithChapterId = normalizeIdForLookup(rawHadithChapterId);
                const mappedId = chapterIdMapping[hadithChapterId] ?? chapterIdMapping[normalizedHadithChapterId];
                const fallbackChapterId = firstInternalChapterId ?? 1;

                newBook.hadiths.push({
                    ...h,
                    internal_chapter_id: mappedId !== undefined ? mappedId : fallbackChapterId,
                    bookId: newBook.id
                });
            });
        });

        // Calculate ranges based on internal ID inside the new book
        let ranges = {};
        newBook.hadiths.forEach(h => {
            const cid = h.internal_chapter_id;
            if (!ranges[cid]) {
                ranges[cid] = { min: h.hadith_id, max: h.hadith_id };
            } else {
                if (h.hadith_id < ranges[cid].min) ranges[cid].min = h.hadith_id;
                if (h.hadith_id > ranges[cid].max) ranges[cid].max = h.hadith_id;
            }
        });

        newBook.chapters = newBook.chapters.map(c => {
            const r = ranges[c.internal_chapter_id];
            const rangeText = r ? `হাদিস রেঞ্জ: ${toBnNum(r.min)} - ${toBnNum(r.max)}` : 'হাদিস নেই';
            return {
                ...c,
                rangeText,
                displayBn: toBnNum(c.display_number || c.original_chapter_id)
            };
        });

        newBook.totalHadiths = newBook.hadiths.length;
        dbBooks.push(newBook);
        return newBook;
    }

    function sanitizeFileName(name) {
        return String(name || 'book')
            .replace(/[<>:"/\\|?*\x00-\x1F]/g, '_')
            .replace(/\s+/g, ' ')
            .trim();
    }

    function normalizeSheetCellValue(value) {
        if (value === null || value === undefined) return '';
        if (typeof value === 'object') return JSON.stringify(value);
        return value;
    }

    function getOrderedHeaders(rows, defaultHeaders = []) {
        const keys = new Set();

        rows.forEach(row => {
            if (!row || typeof row !== 'object') return;
            Object.keys(row).forEach(k => keys.add(k));
        });

        if (keys.size === 0) {
            return [...defaultHeaders];
        }

        const ordered = [];
        defaultHeaders.forEach(h => {
            if (keys.has(h)) {
                ordered.push(h);
                keys.delete(h);
            }
        });

        keys.forEach(k => ordered.push(k));
        return ordered;
    }

    function buildSheetMatrix(rows, defaultHeaders = []) {
        const headers = getOrderedHeaders(rows, defaultHeaders);
        const matrix = [headers];

        rows.forEach(row => {
            const line = headers.map(h => normalizeSheetCellValue(row?.[h]));
            matrix.push(line);
        });

        return matrix;
    }

    function flattenCollections(collections) {
        const merged = { chapters: [], sections: [], hadiths: [] };

        collections.forEach(collection => {
            if (!collection) return;

            if (Array.isArray(collection.chapters)) {
                merged.chapters.push(...collection.chapters.map(c => ({ ...c })));
            }
            if (Array.isArray(collection.sections)) {
                merged.sections.push(...collection.sections.map(s => ({ ...s })));
            }
            if (Array.isArray(collection.hadiths)) {
                merged.hadiths.push(...collection.hadiths.map(h => ({ ...h })));
            }
        });

        return merged;
    }

    async function collectCollectionsFromFiles(files) {
        const allCollections = [];

        for (const file of files) {
            const text = await readFileAsync(file);
            const parsedData = parseRawDataRaw(text);
            if (Array.isArray(parsedData)) {
                allCollections.push(...parsedData);
            } else {
                allCollections.push(parsedData);
            }
        }

        return allCollections;
    }

    function parseSortableNumber(value) {
        if (typeof value === 'number' && Number.isFinite(value)) {
            return value;
        }

        if (value === null || value === undefined) {
            return Number.POSITIVE_INFINITY;
        }

        const bnToEn = {
            '০': '0', '১': '1', '২': '2', '৩': '3', '৪': '4',
            '৫': '5', '৬': '6', '৭': '7', '৮': '8', '৯': '9'
        };
        const normalized = String(value).replace(/[০-৯]/g, d => bnToEn[d] || d);
        const match = normalized.match(/-?\d+(?:\.\d+)?/);
        if (!match) {
            return Number.POSITIVE_INFINITY;
        }

        const num = Number(match[0]);
        return Number.isFinite(num) ? num : Number.POSITIVE_INFINITY;
    }

    function normalizeChapterRows(chapters) {
        const uniqueByChapter = new Map();

        function nonEmpty(v) {
            return v !== undefined && v !== null && String(v).trim() !== '';
        }

        function chapterRowScore(row) {
            let score = 0;
            if (nonEmpty(row.chapter_id)) score += 5;
            if (Number.isFinite(parseDisplayNumberForSort(row.display_number))) score += 5;
            if (nonEmpty(row.title)) score += 3;
            if (nonEmpty(row.preface)) score += 2;
            if (nonEmpty(row.ar_title)) score += 1;
            return score;
        }

        function chapterDedupKey(row) {
            const cid = nonEmpty(row.chapter_id) ? String(row.chapter_id).trim() : '';
            const displayRaw = nonEmpty(row.display_number) ? String(row.display_number).trim() : '';
            const displayParsed = parseDisplayNumberForSort(displayRaw);

            if (cid && Number.isFinite(displayParsed)) {
                return `cid:${cid}|disp:${displayParsed}`;
            }
            if (cid && displayRaw) {
                return `cid:${cid}|disp_raw:${displayRaw}`;
            }
            if (cid) {
                return `cid:${cid}`;
            }
            if (displayRaw) {
                return `disp:${displayRaw}`;
            }

            return `title:${String(row.title || '').trim().toLowerCase()}`;
        }

        chapters.forEach(ch => {
            if (!ch || typeof ch !== 'object') return;

            const row = { ...ch };
            delete row.page;

            const key = chapterDedupKey(row);

            if (!uniqueByChapter.has(key)) {
                uniqueByChapter.set(key, row);
                return;
            }

            const existing = { ...uniqueByChapter.get(key) };
            const existingScore = chapterRowScore(existing);
            const incomingScore = chapterRowScore(row);
            const primary = existingScore >= incomingScore ? { ...existing } : { ...row };
            const secondary = existingScore >= incomingScore ? row : existing;

            Object.keys(secondary).forEach(k => {
                if (!nonEmpty(primary[k]) && nonEmpty(secondary[k])) {
                    primary[k] = secondary[k];
                }
            });

            // Keep whichever row has a valid numeric display_number.
            const primaryDisplay = parseDisplayNumberForSort(primary.display_number);
            const secondaryDisplay = parseDisplayNumberForSort(secondary.display_number);
            if (!Number.isFinite(primaryDisplay) && Number.isFinite(secondaryDisplay)) {
                primary.display_number = secondary.display_number;
            }

            uniqueByChapter.set(key, primary);
        });

        const rows = Array.from(uniqueByChapter.values());
        rows.sort((a, b) => {
            const byDisplay = parseSortableNumber(a.display_number) - parseSortableNumber(b.display_number);
            if (byDisplay !== 0) return byDisplay;

            const byChapterId = parseSortableNumber(a.chapter_id) - parseSortableNumber(b.chapter_id);
            if (byChapterId !== 0) return byChapterId;

            return String(a.title || '').localeCompare(String(b.title || ''));
        });

        return rows;
    }

    function parseDisplayNumberForSort(value) {
        if (value === null || value === undefined) {
            return Number.POSITIVE_INFINITY;
        }

        const str = String(value).trim();
        if (str.includes('/')) {
            const tail = str.split('/').pop();
            return parseSortableNumber(tail);
        }

        return parseSortableNumber(str);
    }

    function buildChapterDisplayOrderMap(chapters) {
        const orderMap = new Map();

        chapters.forEach(ch => {
            if (!ch || ch.chapter_id === undefined || ch.chapter_id === null) return;

            const chapterKey = String(ch.chapter_id);
            const displayOrder = parseDisplayNumberForSort(ch.display_number);
            const existing = orderMap.get(chapterKey);

            if (existing === undefined || displayOrder < existing) {
                orderMap.set(chapterKey, displayOrder);
            }
        });

        return orderMap;
    }

    function getChapterOrderValue(row, chapterOrderMap) {
        const chapterId = row?.chapter_id;
        if (chapterId !== undefined && chapterId !== null) {
            const fromMap = chapterOrderMap.get(String(chapterId));
            if (fromMap !== undefined) return fromMap;
        }

        return parseSortableNumber(chapterId);
    }

    function sortSectionRows(rows, chapterOrderMap) {
        return [...rows].sort((a, b) => {
            const byChapter = getChapterOrderValue(a, chapterOrderMap) - getChapterOrderValue(b, chapterOrderMap);
            if (byChapter !== 0) return byChapter;

            const byDisplay = parseDisplayNumberForSort(a.display_number) - parseDisplayNumberForSort(b.display_number);
            if (byDisplay !== 0) return byDisplay;

            const bySectionId = parseSortableNumber(a.section_id) - parseSortableNumber(b.section_id);
            if (bySectionId !== 0) return bySectionId;

            return parseSortableNumber(a.page) - parseSortableNumber(b.page);
        });
    }

    function sortHadithRows(rows, chapterOrderMap) {
        return [...rows].sort((a, b) => {
            const byChapter = getChapterOrderValue(a, chapterOrderMap) - getChapterOrderValue(b, chapterOrderMap);
            if (byChapter !== 0) return byChapter;

            const byDisplay = parseDisplayNumberForSort(a.display_number) - parseDisplayNumberForSort(b.display_number);
            if (byDisplay !== 0) return byDisplay;

            const byHadithId = parseSortableNumber(a.hadith_id) - parseSortableNumber(b.hadith_id);
            if (byHadithId !== 0) return byHadithId;

            return parseSortableNumber(a.page) - parseSortableNumber(b.page);
        });
    }

    function exportCollectionsToXlsx(collections, outputName) {
        if (typeof XLSX === 'undefined') {
            alert('XLSX library is not loaded. Please reload the page and try again.');
            return false;
        }

        const { chapters, sections, hadiths } = flattenCollections(collections);
        const normalizedChapters = normalizeChapterRows(chapters);
        const chapterOrderMap = buildChapterDisplayOrderMap(normalizedChapters);
        const sortedSections = sortSectionRows(sections, chapterOrderMap);
        const sortedHadiths = sortHadithRows(hadiths, chapterOrderMap);

        const chapterHeaders = ['chapter_id', 'display_number', 'preface', 'title'];
        const sectionHeaders = ['section_id', 'chapter_id', 'display_number', 'page', 'preface', 'title', 'ar_title'];
        const hadithHeaders = ['hadith_id', 'display_number', 'page', 'chapter_id', 'section_id', 'narrator', 'grade', 'ar', 'content', 'note'];

        const wb = XLSX.utils.book_new();
        const chapterSheet = XLSX.utils.aoa_to_sheet(buildSheetMatrix(normalizedChapters, chapterHeaders));
        const sectionSheet = XLSX.utils.aoa_to_sheet(buildSheetMatrix(sortedSections, sectionHeaders));
        const hadithSheet = XLSX.utils.aoa_to_sheet(buildSheetMatrix(sortedHadiths, hadithHeaders));

        XLSX.utils.book_append_sheet(wb, chapterSheet, 'chapter');
        XLSX.utils.book_append_sheet(wb, sectionSheet, 'section');
        XLSX.utils.book_append_sheet(wb, hadithSheet, 'hadith');

        const safeName = sanitizeFileName(outputName || 'merged_book') || 'merged_book';
        XLSX.writeFile(wb, `${safeName}.xlsx`);
        return true;
    }

    function exportBookToXlsx(book) {
        if (!book) return;

        const exportCollection = book.exportData || {
            chapters: book.chapters || [],
            sections: book.sections || [],
            hadiths: book.hadiths || []
        };

        exportCollectionsToXlsx([exportCollection], book.name);
    }

    function escapeHtml(value) {
        return String(value ?? '')
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;');
    }

    function sameId(a, b) {
        return String(a ?? '') === String(b ?? '');
    }

    function getXlsxPreviewData(book) {
        if (!book) return null;

        const exportCollection = book.exportData || {
            chapters: book.chapters || [],
            sections: book.sections || [],
            hadiths: book.hadiths || []
        };
        const { chapters, sections, hadiths } = flattenCollections([exportCollection]);
        const normalizedChapters = normalizeChapterRows(chapters);
        const chapterOrderMap = buildChapterDisplayOrderMap(normalizedChapters);
        const sortedSections = sortSectionRows(sections, chapterOrderMap);
        const sortedHadiths = sortHadithRows(hadiths, chapterOrderMap);

        return {
            chapter: buildSheetMatrix(normalizedChapters, ['chapter_id', 'display_number', 'preface', 'title']),
            section: buildSheetMatrix(sortedSections, ['section_id', 'chapter_id', 'display_number', 'page', 'preface', 'title', 'ar_title']),
            hadith: buildSheetMatrix(sortedHadiths, ['hadith_id', 'display_number', 'page', 'chapter_id', 'section_id', 'narrator', 'grade', 'ar', 'content', 'note'])
        };
    }

    function renderXlsxSheetPreview(book) {
        if (!xlsxSheetTabs || !xlsxSheetTable || !xlsxSheetEmpty || !xlsxPreviewMeta) return;

        const tabs = Array.from(xlsxSheetTabs.querySelectorAll('.xlsx-sheet-tab'));
        const validSheets = ['chapter', 'section', 'hadith'];
        if (!validSheets.includes(activePreviewSheet)) {
            activePreviewSheet = 'chapter';
        }

        tabs.forEach(tab => {
            tab.classList.toggle('active', tab.dataset.sheet === activePreviewSheet);
        });

        const previewData = getXlsxPreviewData(book);
        if (!previewData) {
            xlsxSheetTable.innerHTML = '';
            xlsxSheetEmpty.style.display = 'block';
            xlsxSheetEmpty.textContent = 'No data available.';
            xlsxPreviewMeta.textContent = '';
            return;
        }

        const selectedMatrix = previewData[activePreviewSheet] || previewData.chapter || [];
        const headers = selectedMatrix[0] || [];
        const allRows = selectedMatrix.slice(1);
        const previewLimit = 20;
        const previewRows = allRows.slice(0, previewLimit);

        if (headers.length === 0 || allRows.length === 0) {
            xlsxSheetTable.innerHTML = '';
            xlsxSheetEmpty.style.display = 'block';
            xlsxSheetEmpty.textContent = `No data in ${activePreviewSheet} sheet.`;
            xlsxPreviewMeta.textContent = `${activePreviewSheet}: 0 rows`;
            return;
        }

        const headerHtml = headers.map(header => `<th>${escapeHtml(header)}</th>`).join('');
        const bodyHtml = previewRows.map(row => {
            const rowCells = headers.map((_, idx) => `<td>${escapeHtml(row[idx])}</td>`).join('');
            return `<tr>${rowCells}</tr>`;
        }).join('');

        xlsxSheetTable.innerHTML = `
            <thead><tr>${headerHtml}</tr></thead>
            <tbody>${bodyHtml}</tbody>
        `;
        xlsxSheetEmpty.style.display = 'none';
        xlsxPreviewMeta.textContent = `${activePreviewSheet}: showing ${toBnNum(previewRows.length)} / ${toBnNum(allRows.length)} rows`;
    }

    function renderXlsxView() {
        if (dbBooks.length === 0) {
            xlsxBookSummary.textContent = 'No book loaded yet.';
            btnExportSelectedXlsx.disabled = true;
            renderXlsxSheetPreview(null);
            return;
        }

        if (!currentBookId) {
            currentBookId = dbBooks[0].id;
        }

        const activeBook = dbBooks.find(b => b.id === currentBookId) || dbBooks[0];
        const chapterRows = activeBook?.exportData?.chapters || activeBook.chapters || [];
        const chapterCount = normalizeChapterRows(chapterRows).length;
        const sectionCount = activeBook?.exportData?.sections?.length ?? activeBook.sections.length;
        const hadithCount = activeBook?.exportData?.hadiths?.length ?? activeBook.hadiths.length;

        xlsxBookSummary.innerHTML = `
            <strong>${activeBook.name}</strong><br>
            chapter: ${toBnNum(chapterCount)}<br>
            section: ${toBnNum(sectionCount)}<br>
            hadith: ${toBnNum(hadithCount)}
        `;
        btnExportSelectedXlsx.disabled = false;
        renderXlsxSheetPreview(activeBook);
    }

    btnExportSelectedXlsx.addEventListener('click', () => {
        const activeBook = dbBooks.find(b => b.id === currentBookId) || dbBooks[0];
        if (!activeBook) return;
        exportBookToXlsx(activeBook);
    });

    if (xlsxSheetTabs) {
        xlsxSheetTabs.addEventListener('click', (e) => {
            const tab = e.target.closest('.xlsx-sheet-tab');
            if (!tab) return;

            const targetSheet = tab.dataset.sheet;
            if (!targetSheet || targetSheet === activePreviewSheet) return;

            activePreviewSheet = targetSheet;
            const activeBook = dbBooks.find(b => b.id === currentBookId) || dbBooks[0] || null;
            renderXlsxSheetPreview(activeBook);
        });
    }

    // ==== MERGE LOGIC ====
    btnOpenMerge.addEventListener('click', () => {
        showMergeView();
    });

    mergeFileInput.addEventListener('change', (e) => {
        const files = Array.from(e.target.files);
        if (files.length === 0) return;

        stagedFiles = [...stagedFiles, ...files];

        if (!mergeBookName.value && stagedFiles.length > 0) {
            mergeBookName.value = "মার্জড বই - " + formatBookName(stagedFiles[0].name);
        }

        renderStagedFiles();
        checkMergeValidity();
        mergeFileInput.value = ''; // reset
    });

    mergeBookName.addEventListener('input', checkMergeValidity);

    function renderStagedFiles() {
        mergeFileList.innerHTML = '';
        stagedFiles.forEach((f, idx) => {
            const div = document.createElement('div');
            div.className = 'file-item';
            div.innerHTML = `
                <div><i class="fa-solid fa-file-code" style="color:var(--text-muted); margin-right:8px;"></i> ${f.name}</div>
                <i class="fa-solid fa-xmark" style="cursor:pointer;color:#ef4444;" title="মুছে ফেলুন"></i>
            `;
            div.querySelector('.fa-xmark').addEventListener('click', () => {
                stagedFiles.splice(idx, 1);
                renderStagedFiles();
                checkMergeValidity();
            });
            mergeFileList.appendChild(div);
        });
    }

    function checkMergeValidity() {
        const isValid = stagedFiles.length > 0 && mergeBookName.value.trim() !== '';
        btnDoMerge.disabled = !isValid;
        btnDoMergeXlsx.disabled = !isValid;
    }

    btnDoMerge.addEventListener('click', async () => {
        const bookNameStr = mergeBookName.value.trim();
        if (!bookNameStr || stagedFiles.length === 0) return;

        btnDoMerge.disabled = true;
        btnDoMergeXlsx.disabled = true;
        btnDoMerge.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> মার্জ হচ্ছে...';

        try {
            const allCollections = await collectCollectionsFromFiles(stagedFiles);

            const mergedBook = buildBookFromCollections(allCollections, bookNameStr);
            currentBookId = mergedBook?.id || currentBookId;

            // Success
            stagedFiles = [];
            mergeBookName.value = '';
            renderStagedFiles();
            showHomeView();
        } catch (err) {
            console.error("Merge error:", err);
            alert("ফাইল মার্জ করার সময় ত্রুটি হয়েছে। ফাইলের ফরম্যাট সঠিক কিনা যাচাই করুন।");
        } finally {
            btnDoMerge.innerHTML = 'মার্জ করুন এবং সেভ করুন';
            checkMergeValidity();
        }
    });

    btnDoMergeXlsx.addEventListener('click', async () => {
        const bookNameStr = mergeBookName.value.trim();
        if (!bookNameStr || stagedFiles.length === 0) return;

        btnDoMerge.disabled = true;
        btnDoMergeXlsx.disabled = true;
        btnDoMergeXlsx.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> XLSX preparing...';

        try {
            const allCollections = await collectCollectionsFromFiles(stagedFiles);
            const success = exportCollectionsToXlsx(allCollections, bookNameStr);
            if (!success) return;

            const mergedBook = buildBookFromCollections(allCollections, bookNameStr);
            currentBookId = mergedBook?.id || currentBookId;

            stagedFiles = [];
            mergeBookName.value = '';
            renderStagedFiles();
            showXlsxView(currentBookId);
        } catch (err) {
            console.error("Merge + XLSX error:", err);
            alert("XLSX তৈরি করার সময় সমস্যা হয়েছে। JSON ফাইলগুলো সঠিক আছে কিনা দেখুন।");
        } finally {
            btnDoMergeXlsx.innerHTML = '<i class="fa-solid fa-file-excel"></i> Merge + Download XLSX';
            checkMergeValidity();
        }
    });


    // ==== VIEWS MANAGEMENT ====
    function showHomeView() {
        homeView.classList.add('active');
        chapterView.classList.remove('active');
        mergeView.classList.remove('active');
        xlsxView.classList.remove('active');
        renderHomeView();

        switchTab('books');

        if (window.innerWidth <= 768) {
            sidebar.classList.remove('open');
        }
    }

    function showChapterView(bookId, chapterInternalId) {
        homeView.classList.remove('active');
        chapterView.classList.add('active');
        mergeView.classList.remove('active');
        xlsxView.classList.remove('active');

        currentBookId = bookId;
        currentChapterId = chapterInternalId;

        switchTab('chapters');
        renderChapterContent();

        if (window.innerWidth <= 768) {
            sidebar.classList.remove('open');
        }
    }

    function showMergeView() {
        homeView.classList.remove('active');
        chapterView.classList.remove('active');
        mergeView.classList.add('active');
        xlsxView.classList.remove('active');

        if (window.innerWidth <= 768) {
            sidebar.classList.remove('open');
        }
    }

    function showXlsxView(bookId = null) {
        homeView.classList.remove('active');
        chapterView.classList.remove('active');
        mergeView.classList.remove('active');
        xlsxView.classList.add('active');

        if (bookId) {
            currentBookId = bookId;
        } else if (!currentBookId && dbBooks.length > 0) {
            currentBookId = dbBooks[0].id;
        }

        switchTab('xlsx');
        renderXlsxView();

        if (window.innerWidth <= 768) {
            sidebar.classList.remove('open');
        }
    }

    goHomeBtns.forEach(btn => btn.addEventListener('click', showHomeView));

    // ==== Dynamic UI Updates ====
    function renderHomeView() {
        if (dbBooks.length === 0) {
            homeEmptyState.style.display = 'block';
            bookPills.innerHTML = '';
            return;
        }

        homeEmptyState.style.display = 'none';
        bookPills.innerHTML = '';

        dbBooks.forEach(book => {
            const btn = document.createElement('button');
            btn.className = 'pill-btn';
            btn.innerHTML = `<i class="fa-solid fa-book"></i> ${book.name}`;
            btn.addEventListener('click', () => {
                if (book.chapters.length > 0) {
                    showChapterView(book.id, book.chapters[0].internal_chapter_id);
                }
            });
            bookPills.appendChild(btn);
        });
    }

    // ==== Tabs ====
    tabBooks.addEventListener('click', () => switchTab('books'));
    tabChapters.addEventListener('click', () => {
        if (!currentBookId && dbBooks.length > 0) {
            currentBookId = dbBooks[0].id;
        }
        if (currentBookId) switchTab('chapters');
    });
    tabXlsx.addEventListener('click', () => {
        if (!currentBookId && dbBooks.length > 0) {
            currentBookId = dbBooks[0].id;
        }
        showXlsxView(currentBookId);
    });

    function switchTab(tabId) {
        activeTab = tabId;
        if (tabId === 'books') {
            tabBooks.classList.add('active');
            tabChapters.classList.remove('active');
            tabXlsx.classList.remove('active');
            sidebarSearch.placeholder = "হাদিস গ্রন্থসমূহ সার্চ করুন";
        } else if (tabId === 'chapters') {
            tabChapters.classList.add('active');
            tabBooks.classList.remove('active');
            tabXlsx.classList.remove('active');
            sidebarSearch.placeholder = "অধ্যায় সার্চ করুন";
        } else {
            tabXlsx.classList.add('active');
            tabBooks.classList.remove('active');
            tabChapters.classList.remove('active');
            sidebarSearch.placeholder = "XLSX বই সার্চ করুন";
        }
        sidebarSearch.value = "";
        renderSidebarList();
    }

    function renderSidebarList(query = "") {
        listContainer.innerHTML = '';
        const q = query.toLowerCase();

        if (activeTab === 'books') {
            if (dbBooks.length === 0) {
                listContainer.innerHTML = `<div class="list-empty-msg">কোনো বই যোগ করা হয়নি</div>`;
                return;
            }
            dbBooks.filter(b => b.name.toLowerCase().includes(q))
                .forEach(book => {
                    const item = document.createElement('div');
                    item.className = 'chapter-item';
                    if (currentBookId === book.id && chapterView.classList.contains('active')) item.classList.add('active');

                    let iconLetter = book.name.charAt(0);
                    if (book.name.includes("সহিহ")) iconLetter = "B";
                    else if (book.name.includes("সুনানে")) iconLetter = "S";
                    else if (book.name.includes("জামে")) iconLetter = "T";
                    else iconLetter = iconLetter.toUpperCase();

                    item.innerHTML = `
                        <div class="hex" style="background:#4a7c59;color:white;font-size:1.2rem;">${iconLetter}</div>
                        <div class="chapter-info">
                            <h3 style="font-size: 1.05rem; font-weight:600">${book.name}</h3>
                            <p>মোট হাদিস ${toBnNum(book.totalHadiths)}</p>
                        </div>
                    `;

                    item.addEventListener('click', () => {
                        if (book.chapters.length > 0) {
                            showChapterView(book.id, book.chapters[0].internal_chapter_id);
                        }
                    });
                    listContainer.appendChild(item);
                });
        }
        else if (activeTab === 'chapters') {
            if (!currentBookId) {
                listContainer.innerHTML = `<div class="list-empty-msg">প্রথমে একটি বই নির্বাচন করুন</div>`;
                return;
            }

            const activeBook = dbBooks.find(b => b.id === currentBookId);
            if (!activeBook || activeBook.chapters.length === 0) {
                listContainer.innerHTML = `<div class="list-empty-msg">অধ্যায় নেই</div>`;
                return;
            }

            activeBook.chapters.filter(c => c.title.toLowerCase().includes(q) || String(c.original_chapter_id).includes(q))
                .forEach(chapter => {
                    const item = document.createElement('div');
                    item.className = 'chapter-item';
                    if (sameId(chapter.internal_chapter_id, currentChapterId)) item.classList.add('active');

                    item.innerHTML = `
                        <div class="hex">${chapter.displayBn}</div>
                        <div class="chapter-info">
                            <h3>${chapter.title}</h3>
                            <p>${chapter.rangeText}</p>
                        </div>
                    `;

                    item.addEventListener('click', () => {
                        showChapterView(activeBook.id, chapter.internal_chapter_id);
                    });
                    listContainer.appendChild(item);
                });
        } else if (activeTab === 'xlsx') {
            if (dbBooks.length === 0) {
                listContainer.innerHTML = `<div class="list-empty-msg">কোনো বই যোগ করা হয়নি</div>`;
                return;
            }

            dbBooks.filter(b => b.name.toLowerCase().includes(q))
                .forEach(book => {
                    const item = document.createElement('div');
                    item.className = 'chapter-item';
                    if (book.id === currentBookId && xlsxView.classList.contains('active')) {
                        item.classList.add('active');
                    }

                    const chapterCount = normalizeChapterRows(book.exportData?.chapters || book.chapters || []).length;
                    const hadithCount = (book.exportData?.hadiths?.length || book.hadiths.length);

                    item.innerHTML = `
                        <div class="hex"><i class="fa-solid fa-file-excel"></i></div>
                        <div class="chapter-info">
                            <h3>${book.name}</h3>
                            <p>chapter ${toBnNum(chapterCount)} | hadith ${toBnNum(hadithCount)}</p>
                        </div>
                    `;

                    item.addEventListener('click', () => {
                        showXlsxView(book.id);
                    });

                    listContainer.appendChild(item);
                });
        }
    }

    function renderChapterContent() {
        const book = dbBooks.find(b => b.id === currentBookId);
        if (!book) return;
        const chapter = book.chapters.find(c => sameId(c.internal_chapter_id, currentChapterId));
        if (!chapter) return;

        // Try exact match first, then fallback to original chapter_id match
        let hadiths = book.hadiths.filter(h => sameId(h.internal_chapter_id, currentChapterId));

        // If no hadiths found, try matching by original chapter_id
        if (hadiths.length === 0) {
            const originalChapterId = chapter.original_chapter_id ?? chapter.chapter_id;
            hadiths = book.hadiths.filter(h => {
                const hChapterId = h.chapter_id;
                return hChapterId == originalChapterId || String(hChapterId) === String(originalChapterId);
            });
        }

        const chapterSourceId = String(chapter.original_chapter_id ?? chapter.chapter_id ?? '');

        const sectionMap = new Map();
        (book.sections || []).forEach(section => {
            if (!section) return;
            const sectionId = section.section_id ?? '';
            const chapterId = section.chapter_id ?? '';
            sectionMap.set(`${String(chapterId)}::${String(sectionId)}`, section);
            if (!sectionMap.has(String(sectionId))) {
                sectionMap.set(String(sectionId), section);
            }
        });

        function getSectionForHadith(hadithRow) {
            const sectionId = hadithRow?.section_id ?? '';
            const chapterId = hadithRow?.chapter_id ?? chapterSourceId;
            return sectionMap.get(`${String(chapterId)}::${String(sectionId)}`) || sectionMap.get(String(sectionId)) || null;
        }

        bcBook.textContent = book.name;
        bcTitle.textContent = chapter.title;

        // Header Render
        chapterInfo.innerHTML = `
            <h2><i class="fa-solid fa-layer-group" style="color: var(--primary)"></i> ${chapter.displayBn} অধ্যায়: ${chapter.title}</h2>
            ${chapter.preface ? `<p>${chapter.preface}</p>` : ''}
        `;

        // Hadiths Render
        hadithsContainer.innerHTML = '';
        let lastSectionKey = null;
        hadiths.forEach(h => {
            const section = getSectionForHadith(h);
            const sectionId = section?.section_id ?? h.section_id;
            const sectionChapterId = section?.chapter_id ?? h.chapter_id ?? chapterSourceId;
            const sectionKey = `${String(sectionChapterId ?? '')}::${String(sectionId ?? '')}`;
            const sectionTitle = section?.title || section?.ar_title || `Section ${sectionId ?? ''}`;
            const sectionDisplay = section?.display_number != null ? toBnNum(String(section.display_number)) : (sectionId != null ? toBnNum(String(sectionId)) : '');

            if (sectionKey !== lastSectionKey) {
                const sectionCard = document.createElement('div');
                sectionCard.className = 'hadith-section-card';

                const sectionPrefaceRaw = section?.preface ? String(section.preface) : '';
                const sectionPreface = sectionPrefaceRaw ? sectionPrefaceRaw.replace(/\\n|\n/g, '<br>') : '';
                const sectionLabel = section?.label ? String(section.label) : '';

                sectionCard.innerHTML = `
                    ${sectionLabel ? `<div class="hadith-section-label">${sectionLabel}</div>` : ''}
                    <div class="hadith-section-title">
                        <i class="fa-solid fa-bookmark"></i>
                        ${sectionTitle}
                    </div>
                    ${sectionPreface ? `<div class="hadith-section-preface">${sectionPreface}</div>` : ''}
                `;
                hadithsContainer.appendChild(sectionCard);
                lastSectionKey = sectionKey;
            }

            const card = document.createElement('div');
            card.className = 'hadith-card';

            const badge = h.grade ? `<div class="grade-badge">${escapeHtml(h.grade)}</div>` : '<div class="grade-badge grade-empty">গ্রেড নেই</div>';
            const text = h.content ? String(h.content).replace(/\\n|\n/g, '<br>') : '';
            const note = h.note ? `<div class="hadith-note">${String(h.note).replace(/\\n|\n/g, '<br>')}</div>` : '';

            const arabicText = h.ar ? `<div class="hadith-arabic" dir="rtl">${String(h.ar).replace(/\\n|\n/g, '<br>')}</div>` : '';
            const narratorText = h.narrator ? `<div class="hadith-narrator">${escapeHtml(h.narrator)} থেকে বর্ণিত :</div>` : '';

            // Convert display_number to string before split, handle both "1/2" format and plain numbers
            let hadithNumDisplay;
            if (h.display_number != null) {
                const displayStr = String(h.display_number);
                if (displayStr.includes('/')) {
                    hadithNumDisplay = toBnNum(displayStr.split('/')[1] || h.hadith_id);
                } else {
                    hadithNumDisplay = toBnNum(displayStr);
                }
            } else {
                hadithNumDisplay = toBnNum(h.hadith_id);
            }

            // Store hadith index for editing
            const hadithIndex = book.hadiths.indexOf(h);
            const exportHadithIndex = book.exportData.hadiths.findIndex(eh =>
                eh.hadith_id === h.hadith_id && eh.chapter_id === h.chapter_id
            );

            card.innerHTML = `
                <div class="hadith-header">
                    <div class="hadith-meta">
                        <i class="fa-solid fa-book-open"></i>
                        হাদিস নং - ${hadithNumDisplay}
                    </div>
                    <div class="hadith-actions">
                        ${badge}
                        <button class="edit-btn" title="সম্পাদনা করুন"><i class="fa-solid fa-pen-to-square"></i></button>
                        <button class="save-btn" title="সংরক্ষণ করুন" style="display:none;"><i class="fa-solid fa-floppy-disk"></i></button>
                    </div>
                </div>
                ${arabicText}
                ${narratorText}
                <div class="hadith-text">${text}</div>
                ${note}
            `;
            hadithsContainer.appendChild(card);

            // Edit functionality
            const editBtn = card.querySelector('.edit-btn');
            const saveBtn = card.querySelector('.save-btn');
            const gradeBadge = card.querySelector('.grade-badge');
            const arabicDiv = card.querySelector('.hadith-arabic');
            const narratorDiv = card.querySelector('.hadith-narrator');
            const textDiv = card.querySelector('.hadith-text');
            const noteDiv = card.querySelector('.hadith-note');

            editBtn.addEventListener('click', function() {
                card.classList.add('editing');
                editBtn.style.display = 'none';
                saveBtn.style.display = 'inline-flex';

                // Make grade editable
                if (gradeBadge) {
                    const currentGrade = h.grade || '';
                    gradeBadge.innerHTML = `<input type="text" class="edit-input edit-grade" value="${escapeHtml(currentGrade)}" placeholder="গ্রেড">`;
                }

                // Make Arabic text editable
                if (arabicDiv) {
                    const currentAr = h.ar || '';
                    arabicDiv.innerHTML = `<textarea class="edit-textarea edit-ar" dir="rtl" placeholder="আরবি টেক্সট">${escapeHtml(currentAr)}</textarea>`;
                } else {
                    const newArDiv = document.createElement('div');
                    newArDiv.className = 'hadith-arabic';
                    newArDiv.dir = 'rtl';
                    newArDiv.innerHTML = `<textarea class="edit-textarea edit-ar" dir="rtl" placeholder="আরবি টেক্সট"></textarea>`;
                    card.querySelector('.hadith-header').after(newArDiv);
                }

                // Make narrator editable
                if (narratorDiv) {
                    const currentNarrator = h.narrator || '';
                    narratorDiv.innerHTML = `<input type="text" class="edit-input edit-narrator" value="${escapeHtml(currentNarrator)}" placeholder="বর্ণনাকারী"> থেকে বর্ণিত :`;
                } else {
                    const arDiv = card.querySelector('.hadith-arabic');
                    const newNarratorDiv = document.createElement('div');
                    newNarratorDiv.className = 'hadith-narrator';
                    newNarratorDiv.innerHTML = `<input type="text" class="edit-input edit-narrator" value="" placeholder="বর্ণনাকারী"> থেকে বর্ণিত :`;
                    if (arDiv) {
                        arDiv.after(newNarratorDiv);
                    } else {
                        card.querySelector('.hadith-header').after(newNarratorDiv);
                    }
                }

                // Make content editable
                if (textDiv) {
                    const currentContent = h.content || '';
                    textDiv.innerHTML = `<textarea class="edit-textarea edit-content" placeholder="হাদিসের বিষয়বস্তু">${escapeHtml(currentContent)}</textarea>`;
                }

                // Make note editable
                if (noteDiv) {
                    const currentNote = h.note || '';
                    noteDiv.innerHTML = `<textarea class="edit-textarea edit-note" placeholder="টীকা">${escapeHtml(currentNote)}</textarea>`;
                } else {
                    const newNoteDiv = document.createElement('div');
                    newNoteDiv.className = 'hadith-note';
                    newNoteDiv.innerHTML = `<textarea class="edit-textarea edit-note" placeholder="টীকা"></textarea>`;
                    textDiv.after(newNoteDiv);
                }
            });

            saveBtn.addEventListener('click', function() {
                // Get edited values
                const newGrade = card.querySelector('.edit-grade')?.value || '';
                const newAr = card.querySelector('.edit-ar')?.value || '';
                const newNarrator = card.querySelector('.edit-narrator')?.value || '';
                const newContent = card.querySelector('.edit-content')?.value || '';
                const newNote = card.querySelector('.edit-note')?.value || '';

                // Update hadith data in memory
                if (hadithIndex !== -1) {
                    book.hadiths[hadithIndex].grade = newGrade;
                    book.hadiths[hadithIndex].ar = newAr;
                    book.hadiths[hadithIndex].narrator = newNarrator;
                    book.hadiths[hadithIndex].content = newContent;
                    book.hadiths[hadithIndex].note = newNote;
                }

                // Update export data
                if (exportHadithIndex !== -1) {
                    book.exportData.hadiths[exportHadithIndex].grade = newGrade;
                    book.exportData.hadiths[exportHadithIndex].ar = newAr;
                    book.exportData.hadiths[exportHadithIndex].narrator = newNarrator;
                    book.exportData.hadiths[exportHadithIndex].content = newContent;
                    book.exportData.hadiths[exportHadithIndex].note = newNote;
                }

                // Update original hadith object
                h.grade = newGrade;
                h.ar = newAr;
                h.narrator = newNarrator;
                h.content = newContent;
                h.note = newNote;

                // Re-render card with updated data
                card.classList.remove('editing');
                editBtn.style.display = 'inline-flex';
                saveBtn.style.display = 'none';

                // Update grade badge
                const gradeBadgeEl = card.querySelector('.grade-badge');
                if (gradeBadgeEl) {
                    gradeBadgeEl.innerHTML = newGrade || 'গ্রেড নেই';
                    gradeBadgeEl.classList.toggle('grade-empty', !newGrade);
                }

                // Update Arabic text
                const arDiv = card.querySelector('.hadith-arabic');
                if (arDiv) {
                    if (newAr) {
                        arDiv.innerHTML = newAr.replace(/\\n|\n/g, '<br>');
                    } else {
                        arDiv.remove();
                    }
                }

                // Update narrator
                const narrDiv = card.querySelector('.hadith-narrator');
                if (narrDiv) {
                    if (newNarrator) {
                        narrDiv.innerHTML = `${escapeHtml(newNarrator)} থেকে বর্ণিত :`;
                    } else {
                        narrDiv.remove();
                    }
                }

                // Update content
                const contentDiv = card.querySelector('.hadith-text');
                if (contentDiv) {
                    contentDiv.innerHTML = newContent.replace(/\\n|\n/g, '<br>');
                }

                // Update note
                const noteElement = card.querySelector('.hadith-note');
                if (noteElement) {
                    if (newNote) {
                        noteElement.innerHTML = newNote.replace(/\\n|\n/g, '<br>');
                    } else {
                        noteElement.remove();
                    }
                }

                // Show success feedback
                saveBtn.innerHTML = '<i class="fa-solid fa-check"></i>';
                saveBtn.style.display = 'inline-flex';
                saveBtn.style.background = 'var(--primary)';
                setTimeout(() => {
                    saveBtn.innerHTML = '<i class="fa-solid fa-floppy-disk"></i>';
                    saveBtn.style.display = 'none';
                    saveBtn.style.background = '';
                }, 1500);
            });
        });

        document.querySelector('.main-content').scrollTop = 0;
    }

    sidebarSearch.addEventListener('input', (e) => renderSidebarList(e.target.value));

    menuBtn.addEventListener('click', () => {
        sidebar.classList.toggle('open');
    });

    // Global search shortcut
    document.addEventListener('keydown', e => {
        if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
            e.preventDefault();
            showHomeView();
            homeSearch.focus();
        }
    });

    // Initialize list empty state
    renderSidebarList();

    // Footer Dropdown Toggle
    const footerDropdownToggle = document.getElementById('footer-dropdown-toggle');
    const footerDropdownContent = document.getElementById('footer-dropdown-content');

    if (footerDropdownToggle && footerDropdownContent) {
        // Check localStorage for saved state
        const isCollapsed = localStorage.getItem('footerDropdownCollapsed') === 'true';
        if (isCollapsed) {
            footerDropdownToggle.classList.add('collapsed');
            footerDropdownContent.classList.add('collapsed');
        }

        footerDropdownToggle.addEventListener('click', () => {
            footerDropdownToggle.classList.toggle('collapsed');
            footerDropdownContent.classList.toggle('collapsed');

            // Save state to localStorage
            const collapsed = footerDropdownToggle.classList.contains('collapsed');
            localStorage.setItem('footerDropdownCollapsed', collapsed);
        });
    }
});

