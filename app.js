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
    const langToggle = document.getElementById('lang-toggle');

    // Translation System
    const translations = {
        bn: {
            pageTitle: 'হাদিস সংকলন',
            tabBooks: 'বই',
            tabChapters: 'অধ্যায়',
            tabXlsx: 'XLSX',
            searchBooks: 'হাদিস গ্রন্থসমূহ সার্চ করুন',
            searchChapters: 'অধ্যায় সার্চ করুন',
            searchXlsx: 'XLSX বই সার্চ করুন',
            searchPlaceholder: 'বই সার্চ করুন',
            addBook: 'বই যোগ করুন',
            addBookJson: 'একটি বই যোগ করুন (JSON)',
            addBookXlsx: 'একটি বই যোগ করুন (XLSX)',
            mergeFiles: 'একাধিক ফাইল মার্জ করুন',
            home: 'হোম',
            book: 'বই',
            chapter: 'অধ্যায়',
            homeTitle: 'আল হাদিস',
            searchHadith: 'হাদিস সার্চ করুন',
            emptyState: 'কোনো হাদিস গ্রন্থ আপলোড করা নেই।<br>বাম পাশের প্যানেল থেকে \'একটি বই যোগ করুন\' অথবা \'একাধিক ফাইল মার্জ করুন\' বাটনে ক্লিক করে JSON ফাইল আপলোড করুন।',
            mergeTitle: 'একাধিক JSON ফাইল একটি বইয়ে মার্জ করুন',
            mergeDesc: 'আপনার বইয়ের বিভিন্ন খণ্ড বা অংশের ফাইলগুলো একসাথে নির্বাচন করে একটি পূর্ণাঙ্গ বই তৈরি করুন।',
            bookNameLabel: 'বইয়ের নাম লিখুন:',
            bookNamePlaceholder: 'যেমন: সহিহ বুখারী',
            selectFiles: 'JSON ফাইলগুলো নির্বাচন করুন:',
            selectFilesClick: 'ফাইলগুলো বেছে নিতে এখানে ক্লিক করুন',
            mergeAndSave: 'মার্জ করুন এবং সেভ করুন',
            merging: 'মার্জ হচ্ছে...',
            xlsxTitle: 'JSON ডাটা XLSX হিসাবে ডাউনলোড',
            xlsxDesc: 'প্রতিটি বই 3 টি sheet-এ এক্সপোর্ট হবে: <strong>chapter</strong>, <strong>section</strong>, <strong>hadith</strong>।',
            noBookLoaded: 'এখনও কোনো বই লোড করা হয়নি।',
            sheetPreview: 'Sheet Preview',
            noData: 'কোনও ডাটা নেই।',
            exportXlsx: 'Selected Book Export to XLSX',
            totalHadith: 'মোট হাদিস',
            hadithRange: 'হাদিস রেঞ্জ:',
            noHadith: 'হাদিস নেই',
            noBooksAdded: 'কোনো বই যোগ করা হয়নি',
            selectBookFirst: 'প্রথমে একটি বই নির্বাচন করুন',
            noChapters: 'অধ্যায় নেই',
            hadithNo: 'হাদিস নং -',
            narratedFrom: 'থেকে বর্ণিত :',
            noGrade: 'গ্রেড নেই',
            edit: 'সম্পাদনা করুন',
            save: 'সংরক্ষণ করুন',
            gradePlaceholder: 'গ্রেড',
            arabicPlaceholder: 'আরবি টেক্সট',
            narratorPlaceholder: 'বর্ণনাকারী',
            contentPlaceholder: 'হাদিসের বিষয়বস্তু',
            notePlaceholder: 'টীকা',
            deleteFile: 'মুছে ফেলুন',
            mergeError: 'ফাইল মার্জ করার সময় ত্রুটি হয়েছে। ফাইলের ফরম্যাট সঠিক কিনা যাচাই করুন।',
            xlsxError: 'XLSX তৈরি করার সময় সমস্যা হয়েছে। JSON ফাইলগুলো সঠিক আছে কিনা দেখুন।',
            xlsxReadError: 'XLSX ফাইল পড়তে সমস্যা হয়েছে:',
            mergedBook: 'মার্জড বই -',
            fileMerge: 'ফাইল মার্জ করুন',
            xlsxExport: 'XLSX Export',
            chapterText: 'অধ্যায়:',
            showing: 'দেখাচ্ছে',
            of: '/',
            rows: 'টি সারি',
            searchNoResults: 'কোনো হাদিস পাওয়া যায়নি',
            foundHadiths: 'টি হাদিস পাওয়া গেছে',
            moreResults: 'আরও ফলাফল আছে। আরও নির্দিষ্ট করে সার্চ করুন।',
            clear: 'মুছুন'
        },
        en: {
            pageTitle: 'Hadith Collection',
            tabBooks: 'Books',
            tabChapters: 'Chapters',
            tabXlsx: 'XLSX',
            searchBooks: 'Search Hadith Books',
            searchChapters: 'Search Chapters',
            searchXlsx: 'Search XLSX Books',
            searchPlaceholder: 'Search books',
            addBook: 'Add Book',
            addBookJson: 'Add a Book (JSON)',
            addBookXlsx: 'Add a Book (XLSX)',
            mergeFiles: 'Merge Multiple Files',
            home: 'Home',
            book: 'Book',
            chapter: 'Chapter',
            homeTitle: 'Al Hadith',
            searchHadith: 'Search Hadith',
            emptyState: 'No hadith books uploaded.<br>Click \'Add a Book\' or \'Merge Multiple Files\' button from the left panel to upload JSON files.',
            mergeTitle: 'Merge Multiple JSON Files into One Book',
            mergeDesc: 'Select files from different parts or volumes of your book to create a complete book.',
            bookNameLabel: 'Enter Book Name:',
            bookNamePlaceholder: 'e.g., Sahih Bukhari',
            selectFiles: 'Select JSON Files:',
            selectFilesClick: 'Click here to select files',
            mergeAndSave: 'Merge and Save',
            merging: 'Merging...',
            xlsxTitle: 'Download JSON Data as XLSX',
            xlsxDesc: 'Each book will be exported to 3 sheets: <strong>chapter</strong>, <strong>section</strong>, <strong>hadith</strong>.',
            noBookLoaded: 'No book loaded yet.',
            sheetPreview: 'Sheet Preview',
            noData: 'No data available.',
            exportXlsx: 'Export Selected Book to XLSX',
            totalHadith: 'Total Hadith',
            hadithRange: 'Hadith Range:',
            noHadith: 'No Hadith',
            noBooksAdded: 'No books added',
            selectBookFirst: 'Please select a book first',
            noChapters: 'No chapters',
            hadithNo: 'Hadith No -',
            narratedFrom: 'narrated:',
            noGrade: 'No Grade',
            edit: 'Edit',
            save: 'Save',
            gradePlaceholder: 'Grade',
            arabicPlaceholder: 'Arabic Text',
            narratorPlaceholder: 'Narrator',
            contentPlaceholder: 'Hadith Content',
            notePlaceholder: 'Note',
            deleteFile: 'Delete',
            mergeError: 'Error merging files. Please check the file format.',
            xlsxError: 'Error creating XLSX. Please check if JSON files are correct.',
            xlsxReadError: 'Error reading XLSX file:',
            mergedBook: 'Merged Book -',
            fileMerge: 'Merge Files',
            xlsxExport: 'XLSX Export',
            chapterText: 'Chapter:',
            showing: 'showing',
            of: '/',
            rows: 'rows',
            searchNoResults: 'No hadith found',
            foundHadiths: 'hadith(s) found',
            moreResults: 'more results. Try a more specific search.',
            clear: 'Clear'
        }
    };

    // Current language
    let currentLang = localStorage.getItem('lang') || 'bn';

    // Get translation helper
    function t(key) {
        return translations[currentLang][key] || translations['bn'][key] || key;
    }

    // Apply translations to UI
    function applyTranslations() {
        // Page title
        document.getElementById('page-title').textContent = t('pageTitle');
        document.getElementById('html-root').lang = currentLang;

        // Tabs
        tabBooks.textContent = t('tabBooks');
        tabChapters.textContent = t('tabChapters');

        // Sidebar search placeholder
        if (activeTab === 'books') {
            sidebarSearch.placeholder = t('searchBooks');
        } else if (activeTab === 'chapters') {
            sidebarSearch.placeholder = t('searchChapters');
        } else {
            sidebarSearch.placeholder = t('searchXlsx');
        }

        // Footer dropdown
        const footerToggle = document.getElementById('footer-dropdown-toggle');
        if (footerToggle) {
            footerToggle.querySelector('span').innerHTML = `<i class="fa-solid fa-plus-circle"></i> ${t('addBook')}`;
        }

        // Upload buttons
        const jsonLabel = document.querySelector('label[for="json-upload"]');
        if (jsonLabel) {
            jsonLabel.innerHTML = `<i class="fa-solid fa-cloud-arrow-up"></i> ${t('addBookJson')}`;
        }

        const xlsxLabel = document.querySelector('label[for="xlsx-upload"]');
        if (xlsxLabel) {
            xlsxLabel.innerHTML = `<i class="fa-solid fa-file-excel"></i> ${t('addBookXlsx')}`;
        }

        const btnOpenMerge = document.getElementById('btn-open-merge');
        if (btnOpenMerge) {
            btnOpenMerge.innerHTML = `<i class="fa-solid fa-object-group"></i> ${t('mergeFiles')}`;
        }

        // Home view
        const homeTitle = document.querySelector('.home-title');
        if (homeTitle) homeTitle.textContent = t('homeTitle');

        const globalSearch = document.getElementById('global-search');
        if (globalSearch) globalSearch.placeholder = t('searchHadith');

        const emptyState = document.getElementById('home-empty-state');
        if (emptyState) {
            emptyState.innerHTML = `
                <i class="fa-solid fa-book-quran empty-icon"></i>
                <p>${t('emptyState')}</p>
            `;
        }

        // Breadcrumb home buttons
        document.querySelectorAll('.go-home-btn').forEach(btn => {
            btn.innerHTML = `<i class="fa-solid fa-house"></i> ${t('home')}`;
        });

        // Merge view
        const mergeContainer = document.querySelector('#merge-view .merge-container');
        if (mergeContainer) {
            const h2 = mergeContainer.querySelector('h2');
            if (h2) h2.textContent = t('mergeTitle');

            const desc = mergeContainer.querySelector('p.text-muted');
            if (desc) desc.textContent = t('mergeDesc');

            const labels = mergeContainer.querySelectorAll('.form-group label');
            if (labels[0]) labels[0].textContent = t('bookNameLabel');
            if (labels[1]) labels[1].textContent = t('selectFiles');

            const bookNameInput = document.getElementById('merge-book-name');
            if (bookNameInput) bookNameInput.placeholder = t('bookNamePlaceholder');

            const mergeUploadBox = mergeContainer.querySelector('.merge-upload-box span');
            if (mergeUploadBox) mergeUploadBox.textContent = t('selectFilesClick');

            const btnDoMerge = document.getElementById('btn-do-merge');
            if (btnDoMerge && !btnDoMerge.disabled) {
                btnDoMerge.textContent = t('mergeAndSave');
            }
        }

        // Merge view breadcrumb
        const mergeBreadcrumb = document.querySelector('#merge-view .breadcrumb .text-muted');
        if (mergeBreadcrumb) mergeBreadcrumb.textContent = t('fileMerge');

        // XLSX view
        const xlsxContainer = document.querySelector('#xlsx-view .merge-container');
        if (xlsxContainer) {
            const h2 = xlsxContainer.querySelector('h2');
            if (h2) h2.textContent = t('xlsxTitle');

            const desc = xlsxContainer.querySelector('p.text-muted');
            if (desc) desc.innerHTML = t('xlsxDesc');

            const previewHeader = xlsxContainer.querySelector('.xlsx-preview-header h3');
            if (previewHeader) previewHeader.textContent = t('sheetPreview');

            const btnExport = document.getElementById('btn-export-selected-xlsx');
            if (btnExport) {
                btnExport.innerHTML = `<i class="fa-solid fa-file-excel"></i> ${t('exportXlsx')}`;
            }
        }

        // XLSX view breadcrumb
        const xlsxBreadcrumb = document.querySelector('#xlsx-view .breadcrumb .text-muted');
        if (xlsxBreadcrumb) xlsxBreadcrumb.textContent = t('xlsxExport');

        // Chapter view breadcrumb labels
        const bcBook = document.getElementById('bc-book');
        const bcTitle = document.getElementById('bc-title');
        if (bcBook && !bcBook.dataset.book) bcBook.textContent = t('book');
        if (bcTitle && !bcTitle.dataset.chapter) bcTitle.textContent = t('chapter');

        // Update language toggle button text
        langToggle.querySelector('.lang-text').textContent = currentLang === 'bn' ? 'EN' : 'বাং';

        // Re-render current view
        renderSidebarList();
    }

    // Language toggle logic
    langToggle.addEventListener('click', () => {
        currentLang = currentLang === 'bn' ? 'en' : 'bn';
        localStorage.setItem('lang', currentLang);
        applyTranslations();

        // Re-render views if needed
        if (homeView.classList.contains('active')) {
            renderHomeView();
        } else if (chapterView.classList.contains('active')) {
            renderChapterContent();
        } else if (xlsxView.classList.contains('active')) {
            renderXlsxView();
        }
    });

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
    const searchResults = document.getElementById('search-results');
    const searchResultsList = document.getElementById('search-results-list');
    const searchResultsCount = document.getElementById('search-results-count');
    const clearSearchBtn = document.getElementById('clear-search');

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

    // Grade ID to Name mapping (Bangla and English)
    const gradeIdToNameBn = {
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

    const gradeIdToNameEn = {
        1: "Not Determined",
        2: "Sahih Hadith",
        3: "Hasan Hadith",
        4: "Da'if (Weak) Hadith",
        5: "Mawdu' (Fabricated) Hadith",
        6: "Others",
        7: "Sahih li Ghayrihi",
        8: "Sahih Maqtu'",
        9: "Sahih Mawquf",
        10: "Sahih Marfu'",
        11: "Sahih Mutawatir",
        12: "Hasan Sahih",
        13: "Hasan Mawquf",
        14: "Hasan Maqtu'",
        15: "Hasan li Ghayrihi",
        16: "Very Weak",
        17: "Da'if Munkar",
        18: "Da'if Maqtu'",
        19: "Da'if Mawquf",
        20: "Shadh",
        21: "Munkar",
        22: "Sahih Mawquf Shadh",
        23: "Shadh Maqtu'",
        24: "Maqtu' Marfuj",
        25: "Da'if Mursal",
        26: "Da'if Marfu'",
        27: "Da'if Mudtarib",
        28: "Da'if Mu'dal",
        29: "Mixed",
        30: "Very Weak Maqtu'",
        31: "Da'if Munqati'",
        32: "Batil (Invalid)",
        33: "Da'if Shadh",
        34: "Mursal",
        35: "Maqtu'",
        36: "Sahih li Dhatihi",
        37: "Hasan li Dhatihi",
        38: "Mu'allaq",
        39: "Munqati'",
        40: "Mu'dal",
        41: "Mudallas",
        42: "Ma'ruf",
        43: "Matruk",
        44: "Mubham",
        45: "Mudraj",
        46: "Mutawatir",
        47: "Khabar Wahid",
        48: "Mawquf",
        49: "Muttasil",
        50: "Mahfuz",
        51: "Majhul",
        52: "Jahalat",
        53: "Tabi'",
        54: "Shahid",
        55: "Mutaba'at",
        56: "Musahhaf",
        57: "Hadith",
        58: "Sunnah",
        59: "Khabar",
        60: "Athar",
        61: "Terms of Hadith Science",
        62: "Ta'liq",
        63: "Mutabi' wa Shahid"
    };

    // Get grade name based on current language
    function getGradeName(gradeId) {
        if (currentLang === 'en') {
            return gradeIdToNameEn[gradeId] || gradeIdToNameBn[gradeId];
        }
        return gradeIdToNameBn[gradeId];
    }

    // Legacy reference for existing code
    const gradeIdToName = gradeIdToNameBn;

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
                alert(`${t('xlsxReadError')} ${file.name}`);
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
            const rangeTextEn = r ? `Hadith Range: ${r.min} - ${r.max}` : 'No Hadith';
            return {
                ...c,
                rangeText,
                rangeTextEn,
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
        const normalizedA = normalizeIdForLookup(a);
        const normalizedB = normalizeIdForLookup(b);
        if (normalizedA || normalizedB) {
            return normalizedA === normalizedB;
        }
        return String(a ?? '').trim() === String(b ?? '').trim();
    }

    function syncActiveChapterSidebarItem(chapterInternalId) {
        const selectedId = normalizeIdForLookup(chapterInternalId);
        const chapterItems = listContainer.querySelectorAll('.chapter-item[data-chapter-id]');
        chapterItems.forEach(item => {
            item.classList.toggle('active', (item.dataset.chapterId || '') === selectedId);
        });
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
            xlsxSheetEmpty.textContent = t('noData');
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
            const noDataMsg = currentLang === 'bn' ? `${activePreviewSheet} শীটে কোনো ডাটা নেই।` : `No data in ${activePreviewSheet} sheet.`;
            xlsxSheetEmpty.textContent = noDataMsg;
            const rowsText = currentLang === 'bn' ? '০ টি সারি' : '0 rows';
            xlsxPreviewMeta.textContent = `${activePreviewSheet}: ${rowsText}`;
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
        const previewNum = currentLang === 'bn' ? toBnNum(previewRows.length) : previewRows.length;
        const totalNum = currentLang === 'bn' ? toBnNum(allRows.length) : allRows.length;
        const metaText = currentLang === 'bn'
            ? `${activePreviewSheet}: ${t('showing')} ${previewNum} ${t('of')} ${totalNum} ${t('rows')}`
            : `${activePreviewSheet}: ${t('showing')} ${previewNum} ${t('of')} ${totalNum} ${t('rows')}`;
        xlsxPreviewMeta.textContent = metaText;
    }

    function renderXlsxView() {
        if (dbBooks.length === 0) {
            xlsxBookSummary.textContent = t('noBookLoaded');
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

        const chapterNum = currentLang === 'bn' ? toBnNum(chapterCount) : chapterCount;
        const sectionNum = currentLang === 'bn' ? toBnNum(sectionCount) : sectionCount;
        const hadithNum = currentLang === 'bn' ? toBnNum(hadithCount) : hadithCount;

        xlsxBookSummary.innerHTML = `
            <strong>${activeBook.name}</strong><br>
            chapter: ${chapterNum}<br>
            section: ${sectionNum}<br>
            hadith: ${hadithNum}
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
            mergeBookName.value = t('mergedBook') + " " + formatBookName(stagedFiles[0].name);
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
                <i class="fa-solid fa-xmark" style="cursor:pointer;color:#ef4444;" title="${t('deleteFile')}"></i>
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
        btnDoMerge.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> ${t('merging')}`;

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
            alert(t('mergeError'));
        } finally {
            btnDoMerge.innerHTML = t('mergeAndSave');
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
            alert(t('xlsxError'));
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

        // Check if there's a search query
        if (homeSearch.value.trim()) {
            performGlobalSearch(homeSearch.value);
        } else {
            hideSearchResults();
            renderHomeView();
        }

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
        syncActiveChapterSidebarItem(currentChapterId);
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
        // Hide search results when rendering home view
        searchResults.style.display = 'none';

        if (dbBooks.length === 0) {
            homeEmptyState.style.display = 'block';
            bookPills.style.display = 'none';
            bookPills.innerHTML = '';
            return;
        }

        homeEmptyState.style.display = 'none';
        bookPills.style.display = 'flex';
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
            sidebarSearch.placeholder = t('searchBooks');
        } else if (tabId === 'chapters') {
            tabChapters.classList.add('active');
            tabBooks.classList.remove('active');
            tabXlsx.classList.remove('active');
            sidebarSearch.placeholder = t('searchChapters');
        } else {
            tabXlsx.classList.add('active');
            tabBooks.classList.remove('active');
            tabChapters.classList.remove('active');
            sidebarSearch.placeholder = t('searchXlsx');
        }
        sidebarSearch.value = "";
        renderSidebarList();
    }

    function renderSidebarList(query = "") {
        listContainer.innerHTML = '';
        const q = query.toLowerCase();

        if (activeTab === 'books') {
            if (dbBooks.length === 0) {
                listContainer.innerHTML = `<div class="list-empty-msg">${t('noBooksAdded')}</div>`;
                return;
            }
            dbBooks.filter(b => b.name.toLowerCase().includes(q))
                .forEach(book => {
                    const item = document.createElement('div');
                    item.className = 'chapter-item';
                    if (currentBookId === book.id && chapterView.classList.contains('active')) item.classList.add('active');

                    let iconLetter = book.name.charAt(0);
                    if (book.name.includes("সহিহ") || book.name.toLowerCase().includes("sahih")) iconLetter = "B";
                    else if (book.name.includes("সুনানে") || book.name.toLowerCase().includes("sunan")) iconLetter = "S";
                    else if (book.name.includes("জামে") || book.name.toLowerCase().includes("jami")) iconLetter = "T";
                    else iconLetter = iconLetter.toUpperCase();

                    const totalHadithText = currentLang === 'bn'
                        ? `${t('totalHadith')} ${toBnNum(book.totalHadiths)}`
                        : `${t('totalHadith')} ${book.totalHadiths}`;

                    item.innerHTML = `
                        <div class="hex" style="background:#4a7c59;color:white;font-size:1.2rem;"><i class="fa-solid fa-book"></i></div>
                        <div class="chapter-info">
                            <h3 style="font-size: 1.05rem; font-weight:600">${book.name}</h3>
                            <p>${totalHadithText}</p>
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
                listContainer.innerHTML = `<div class="list-empty-msg">${t('selectBookFirst')}</div>`;
                return;
            }

            const activeBook = dbBooks.find(b => b.id === currentBookId);
            if (!activeBook || activeBook.chapters.length === 0) {
                listContainer.innerHTML = `<div class="list-empty-msg">${t('noChapters')}</div>`;
                return;
            }

            activeBook.chapters.filter(c => c.title.toLowerCase().includes(q) || String(c.original_chapter_id).includes(q))
                .forEach(chapter => {
                    const item = document.createElement('div');
                    item.className = 'chapter-item';
                    item.dataset.chapterId = normalizeIdForLookup(chapter.internal_chapter_id);
                    if (sameId(chapter.internal_chapter_id, currentChapterId)) item.classList.add('active');

                    const displayNum = currentLang === 'bn' ? chapter.displayBn : (chapter.display_number || chapter.original_chapter_id);
                    const rangeText = currentLang === 'bn' ? chapter.rangeText : chapter.rangeTextEn;

                    item.innerHTML = `
                        <div class="hex">${displayNum}</div>
                        <div class="chapter-info">
                            <h3>${chapter.title}</h3>
                            <p>${rangeText}</p>
                        </div>
                    `;

                    item.addEventListener('click', () => {
                        syncActiveChapterSidebarItem(chapter.internal_chapter_id);
                        showChapterView(activeBook.id, chapter.internal_chapter_id);
                    });
                    listContainer.appendChild(item);
                });
        } else if (activeTab === 'xlsx') {
            if (dbBooks.length === 0) {
                listContainer.innerHTML = `<div class="list-empty-msg">${t('noBooksAdded')}</div>`;
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
                    const countText = currentLang === 'bn'
                        ? `chapter ${toBnNum(chapterCount)} | hadith ${toBnNum(hadithCount)}`
                        : `chapter ${chapterCount} | hadith ${hadithCount}`;

                    item.innerHTML = `
                        <div class="hex"><i class="fa-solid fa-file-excel"></i></div>
                        <div class="chapter-info">
                            <h3>${book.name}</h3>
                            <p>${countText}</p>
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
        bcBook.dataset.book = book.name;
        bcTitle.textContent = chapter.title;
        bcTitle.dataset.chapter = chapter.title;

        // Header Render
        const displayNum = currentLang === 'bn' ? chapter.displayBn : (chapter.display_number || chapter.original_chapter_id);
        chapterInfo.innerHTML = `
            <h2><i class="fa-solid fa-layer-group" style="color: var(--primary)"></i> ${displayNum} ${t('chapterText')} ${chapter.title}</h2>
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

            // Get grade with translation support
            let gradeDisplay = h.grade;
            if (h.grade_id && currentLang === 'en') {
                gradeDisplay = getGradeName(h.grade_id) || h.grade;
            }
            const badge = gradeDisplay ? `<div class="grade-badge">${escapeHtml(gradeDisplay)}</div>` : `<div class="grade-badge grade-empty">${t('noGrade')}</div>`;
            const text = h.content ? String(h.content).replace(/\\n|\n/g, '<br>') : '';
            const note = h.note ? `<div class="hadith-note">${String(h.note).replace(/\\n|\n/g, '<br>')}</div>` : '';

            const arabicText = h.ar ? `<div class="hadith-arabic" dir="rtl">${String(h.ar).replace(/\\n|\n/g, '<br>')}</div>` : '';
            const narratorText = h.narrator ? `<div class="hadith-narrator">${escapeHtml(h.narrator)} ${t('narratedFrom')}</div>` : '';

            // Convert display_number to string before split, handle both "1/2" format and plain numbers
            let hadithNumDisplay;
            if (h.display_number != null) {
                const displayStr = String(h.display_number);
                if (displayStr.includes('/')) {
                    const numPart = displayStr.split('/')[1] || h.hadith_id;
                    hadithNumDisplay = currentLang === 'bn' ? toBnNum(numPart) : numPart;
                } else {
                    hadithNumDisplay = currentLang === 'bn' ? toBnNum(displayStr) : displayStr;
                }
            } else {
                hadithNumDisplay = currentLang === 'bn' ? toBnNum(h.hadith_id) : h.hadith_id;
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
                        ${t('hadithNo')} ${hadithNumDisplay}
                    </div>
                    <div class="hadith-actions">
                        ${badge}
                        <button class="edit-btn" title="${t('edit')}"><i class="fa-solid fa-pen-to-square"></i></button>
                        <button class="save-btn" title="${t('save')}" style="display:none;"><i class="fa-solid fa-floppy-disk"></i></button>
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
                    gradeBadge.innerHTML = `<input type="text" class="edit-input edit-grade" value="${escapeHtml(currentGrade)}" placeholder="${t('gradePlaceholder')}">`;
                }

                // Make Arabic text editable
                if (arabicDiv) {
                    const currentAr = h.ar || '';
                    arabicDiv.innerHTML = `<textarea class="edit-textarea edit-ar" dir="rtl" placeholder="${t('arabicPlaceholder')}">${escapeHtml(currentAr)}</textarea>`;
                } else {
                    const newArDiv = document.createElement('div');
                    newArDiv.className = 'hadith-arabic';
                    newArDiv.dir = 'rtl';
                    newArDiv.innerHTML = `<textarea class="edit-textarea edit-ar" dir="rtl" placeholder="${t('arabicPlaceholder')}"></textarea>`;
                    card.querySelector('.hadith-header').after(newArDiv);
                }

                // Make narrator editable
                if (narratorDiv) {
                    const currentNarrator = h.narrator || '';
                    narratorDiv.innerHTML = `<input type="text" class="edit-input edit-narrator" value="${escapeHtml(currentNarrator)}" placeholder="${t('narratorPlaceholder')}"> ${t('narratedFrom')}`;
                } else {
                    const arDiv = card.querySelector('.hadith-arabic');
                    const newNarratorDiv = document.createElement('div');
                    newNarratorDiv.className = 'hadith-narrator';
                    newNarratorDiv.innerHTML = `<input type="text" class="edit-input edit-narrator" value="" placeholder="${t('narratorPlaceholder')}"> ${t('narratedFrom')}`;
                    if (arDiv) {
                        arDiv.after(newNarratorDiv);
                    } else {
                        card.querySelector('.hadith-header').after(newNarratorDiv);
                    }
                }

                // Make content editable
                if (textDiv) {
                    const currentContent = h.content || '';
                    textDiv.innerHTML = `<textarea class="edit-textarea edit-content" placeholder="${t('contentPlaceholder')}">${escapeHtml(currentContent)}</textarea>`;
                }

                // Make note editable
                if (noteDiv) {
                    const currentNote = h.note || '';
                    noteDiv.innerHTML = `<textarea class="edit-textarea edit-note" placeholder="${t('notePlaceholder')}">${escapeHtml(currentNote)}</textarea>`;
                } else {
                    const newNoteDiv = document.createElement('div');
                    newNoteDiv.className = 'hadith-note';
                    newNoteDiv.innerHTML = `<textarea class="edit-textarea edit-note" placeholder="${t('notePlaceholder')}"></textarea>`;
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
                    gradeBadgeEl.innerHTML = newGrade || t('noGrade');
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
                        narrDiv.innerHTML = `${escapeHtml(newNarrator)} ${t('narratedFrom')}`;
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

    // Global Search Functionality
    let searchTimeout = null;

    function performGlobalSearch(query) {
        const q = query.trim().toLowerCase();

        if (!q) {
            hideSearchResults();
            return;
        }

        const results = [];

        dbBooks.forEach(book => {
            book.hadiths.forEach(hadith => {
                let matched = false;
                let matchedField = '';

                // Search by hadith_id
                const hadithIdStr = String(hadith.hadith_id || '');
                if (hadithIdStr === q || hadithIdStr.includes(q)) {
                    matched = true;
                    matchedField = 'id';
                }

                // Search in content
                if (!matched && hadith.content && String(hadith.content).toLowerCase().includes(q)) {
                    matched = true;
                    matchedField = 'content';
                }

                // Search in Arabic
                if (!matched && hadith.ar && String(hadith.ar).toLowerCase().includes(q)) {
                    matched = true;
                    matchedField = 'ar';
                }

                // Search in narrator
                if (!matched && hadith.narrator && String(hadith.narrator).toLowerCase().includes(q)) {
                    matched = true;
                    matchedField = 'narrator';
                }

                // Search in grade
                if (!matched && hadith.grade && String(hadith.grade).toLowerCase().includes(q)) {
                    matched = true;
                    matchedField = 'grade';
                }

                // Search in note
                if (!matched && hadith.note && String(hadith.note).toLowerCase().includes(q)) {
                    matched = true;
                    matchedField = 'note';
                }

                if (matched) {
                    // Find the chapter for this hadith
                    const chapter = book.chapters.find(c =>
                        sameId(c.internal_chapter_id, hadith.internal_chapter_id)
                    );

                    results.push({
                        book: book,
                        chapter: chapter,
                        hadith: hadith,
                        matchedField: matchedField
                    });
                }
            });
        });

        displaySearchResults(results, query);
    }

    function highlightText(text, query) {
        if (!text || !query) return escapeHtml(text || '');

        const escaped = escapeHtml(String(text));
        const q = query.trim();
        if (!q) return escaped;

        // Create a regex for case-insensitive matching
        const regex = new RegExp(`(${q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
        return escaped.replace(regex, '<mark>$1</mark>');
    }

    function displaySearchResults(results, query) {
        if (results.length === 0) {
            searchResults.style.display = 'block';
            bookPills.style.display = 'none';
            homeEmptyState.style.display = 'none';

            const noResultsText = currentLang === 'bn'
                ? `"${query}" এর জন্য কোনো হাদিস পাওয়া যায়নি`
                : `No hadith found for "${query}"`;

            searchResultsCount.textContent = '';
            searchResultsList.innerHTML = `
                <div class="search-no-results">
                    <i class="fa-solid fa-search"></i>
                    <p>${noResultsText}</p>
                </div>
            `;
            return;
        }

        searchResults.style.display = 'block';
        bookPills.style.display = 'none';
        homeEmptyState.style.display = 'none';

        const countText = currentLang === 'bn'
            ? `${toBnNum(results.length)} টি হাদিস পাওয়া গেছে`
            : `Found ${results.length} hadith${results.length > 1 ? 's' : ''}`;

        searchResultsCount.textContent = countText;
        searchResultsList.innerHTML = '';

        // Limit results to first 50 for performance
        const displayResults = results.slice(0, 50);

        displayResults.forEach(result => {
            const card = document.createElement('div');
            card.className = 'search-result-card';

            const hadithIdDisplay = currentLang === 'bn'
                ? toBnNum(result.hadith.hadith_id)
                : result.hadith.hadith_id;

            const chapterTitle = result.chapter?.title || '';

            // Get content preview with highlighting
            let contentPreview = '';
            if (result.hadith.content) {
                contentPreview = highlightText(
                    String(result.hadith.content).substring(0, 300),
                    query
                );
                if (String(result.hadith.content).length > 300) {
                    contentPreview += '...';
                }
            } else if (result.hadith.ar) {
                contentPreview = highlightText(
                    String(result.hadith.ar).substring(0, 200),
                    query
                );
                if (String(result.hadith.ar).length > 200) {
                    contentPreview += '...';
                }
            }

            const hadithLabel = currentLang === 'bn' ? 'হাদিস' : 'Hadith';

            card.innerHTML = `
                <div class="search-result-header">
                    <div class="search-result-meta">
                        <span class="search-result-book">${escapeHtml(result.book.name)}</span>
                        <span class="search-result-chapter">${escapeHtml(chapterTitle)}</span>
                    </div>
                    <span class="search-result-hadith-id">${hadithLabel} ${hadithIdDisplay}</span>
                </div>
                <div class="search-result-content">${contentPreview}</div>
            `;

            card.addEventListener('click', () => {
                // Navigate to the chapter containing this hadith
                if (result.chapter) {
                    showChapterView(result.book.id, result.chapter.internal_chapter_id);

                    // After rendering, try to scroll to the specific hadith
                    setTimeout(() => {
                        const hadithCards = hadithsContainer.querySelectorAll('.hadith-card');
                        for (const hCard of hadithCards) {
                            const metaText = hCard.querySelector('.hadith-meta')?.textContent || '';
                            if (metaText.includes(String(result.hadith.hadith_id)) ||
                                metaText.includes(toBnNum(result.hadith.hadith_id))) {
                                hCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
                                hCard.style.animation = 'highlightPulse 1.5s ease-out';
                                break;
                            }
                        }
                    }, 100);
                }
            });

            searchResultsList.appendChild(card);
        });

        // Show message if results were truncated
        if (results.length > 50) {
            const moreText = currentLang === 'bn'
                ? `আরও ${toBnNum(results.length - 50)} টি ফলাফল আছে। আরও নির্দিষ্ট করে সার্চ করুন।`
                : `${results.length - 50} more results. Try a more specific search.`;

            const moreDiv = document.createElement('div');
            moreDiv.className = 'search-no-results';
            moreDiv.innerHTML = `<p style="font-size: 0.9rem;">${moreText}</p>`;
            searchResultsList.appendChild(moreDiv);
        }
    }

    function hideSearchResults() {
        searchResults.style.display = 'none';
        bookPills.style.display = 'flex';
        if (dbBooks.length === 0) {
            homeEmptyState.style.display = 'block';
        }
    }

    // Search input event listener
    homeSearch.addEventListener('input', (e) => {
        const query = e.target.value;

        // Debounce search
        if (searchTimeout) {
            clearTimeout(searchTimeout);
        }

        searchTimeout = setTimeout(() => {
            performGlobalSearch(query);
        }, 300);
    });

    // Clear search button
    clearSearchBtn.addEventListener('click', () => {
        homeSearch.value = '';
        hideSearchResults();
        homeSearch.focus();
    });

    // Clear search on Escape key
    homeSearch.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            homeSearch.value = '';
            hideSearchResults();
        }
    });

    // Initialize list empty state and apply translations
    applyTranslations();
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

