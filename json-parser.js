document.addEventListener('DOMContentLoaded', () => {
    // Elements
    const html = document.documentElement;
    const btnLight = document.getElementById('btn-light');
    const btnDark = document.getElementById('btn-dark');
    const uploadSection = document.getElementById('upload-section');
    const fileInput = document.getElementById('json-file');
    const fileInfo = document.getElementById('file-info');
    const fileName = document.getElementById('file-name');
    const fileMeta = document.getElementById('file-meta');
    const btnDownload = document.getElementById('btn-download');
    const btnClear = document.getElementById('btn-clear');
    const sheetTabs = document.getElementById('sheet-tabs');
    const tableContainer = document.getElementById('table-container');
    const tableInfoText = document.getElementById('table-info-text');
    const tableHead = document.getElementById('table-head');
    const tableBody = document.getElementById('table-body');

    // Multi-file elements
    const filesList = document.getElementById('files-list');
    const filesItems = document.getElementById('files-items');
    const btnAddMore = document.getElementById('btn-add-more');
    const btnMerge = document.getElementById('btn-merge');
    const btnClearAll = document.getElementById('btn-clear-all');

    // State
    let currentData = null;
    let currentFileName = '';
    let sheetStructure = {};
    let activeSheet = '';
    let sourceDocumentCount = 0;

    // Multi-file state
    let pendingFiles = []; // Array of { file, data, status, rowCount }

    // Theme Toggle
    function setTheme(theme) {
        const normalizedTheme = theme === 'light' ? 'light' : 'dark';

        if (normalizedTheme === 'light') {
            html.setAttribute('data-theme', 'light');
            btnLight?.classList.add('active');
            btnDark?.classList.remove('active');
        } else {
            html.removeAttribute('data-theme');
            btnDark?.classList.add('active');
            btnLight?.classList.remove('active');
        }

        localStorage.setItem('json-parser-theme', normalizedTheme);
    }

    // Restore saved theme preference (defaults to dark)
    const savedTheme = localStorage.getItem('json-parser-theme') || 'dark';
    setTheme(savedTheme);

    btnLight?.addEventListener('click', () => setTheme('light'));
    btnDark?.addEventListener('click', () => setTheme('dark'));

    // Flatten nested objects (e.g., chapter_info.arabic_title -> chapter_info_arabic_title)
    function flattenObject(obj, prefix = '') {
        const result = {};
        for (const key in obj) {
            if (!obj.hasOwnProperty(key)) continue;
            const newKey = prefix ? `${prefix}_${key}` : key;
            const value = obj[key];

            if (value !== null && typeof value === 'object' && !Array.isArray(value)) {
                Object.assign(result, flattenObject(value, newKey));
            } else if (Array.isArray(value)) {
                // Convert arrays to JSON string for display
                result[newKey] = JSON.stringify(value);
            } else {
                result[newKey] = value;
            }
        }
        return result;
    }

    function isWhitespace(char) {
        return char === ' ' || char === '\n' || char === '\r' || char === '\t';
    }

    function skipWhitespace(text, index) {
        let i = index;
        while (i < text.length && isWhitespace(text[i])) {
            i++;
        }
        return i;
    }

    function skipInterDocumentDelimiters(text, index) {
        let i = skipWhitespace(text, index);
        while (i < text.length && (text[i] === ',' || text[i] === ';')) {
            i++;
            i = skipWhitespace(text, i);
        }
        return i;
    }

    function findJsonValueEnd(text, startIndex) {
        const firstChar = text[startIndex];

        // Object / Array JSON value
        if (firstChar === '{' || firstChar === '[') {
            const stack = [firstChar];
            let inString = false;
            let isEscaped = false;

            for (let i = startIndex + 1; i < text.length; i++) {
                const ch = text[i];

                if (inString) {
                    if (isEscaped) {
                        isEscaped = false;
                        continue;
                    }
                    if (ch === '\\') {
                        isEscaped = true;
                        continue;
                    }
                    if (ch === '"') {
                        inString = false;
                    }
                    continue;
                }

                if (ch === '"') {
                    inString = true;
                    continue;
                }

                if (ch === '{' || ch === '[') {
                    stack.push(ch);
                    continue;
                }

                if (ch === '}' || ch === ']') {
                    const open = stack.pop();
                    const matches = (open === '{' && ch === '}') || (open === '[' && ch === ']');
                    if (!open || !matches) {
                        throw new Error('Invalid JSON structure: mismatched brackets');
                    }
                    if (stack.length === 0) {
                        return i + 1;
                    }
                }
            }

            throw new Error('Invalid JSON structure: unterminated object/array');
        }

        // String JSON value
        if (firstChar === '"') {
            let isEscaped = false;
            for (let i = startIndex + 1; i < text.length; i++) {
                const ch = text[i];
                if (isEscaped) {
                    isEscaped = false;
                    continue;
                }
                if (ch === '\\') {
                    isEscaped = true;
                    continue;
                }
                if (ch === '"') {
                    return i + 1;
                }
            }
            throw new Error('Invalid JSON structure: unterminated string');
        }

        // Primitive JSON value (number/true/false/null)
        let end = startIndex;
        while (end < text.length && !isWhitespace(text[end]) && text[end] !== ',' && text[end] !== ';') {
            end++;
        }
        return end;
    }

    function parsePossiblyMergedJson(text) {
        const trimmed = text.trim();
        if (!trimmed) {
            throw new Error('File is empty');
        }

        try {
            return [JSON.parse(trimmed)];
        } catch (singleParseError) {
            const values = [];
            let index = 0;

            while (index < trimmed.length) {
                index = skipInterDocumentDelimiters(trimmed, index);
                if (index >= trimmed.length) {
                    break;
                }

                const endIndex = findJsonValueEnd(trimmed, index);
                const segment = trimmed.slice(index, endIndex).trim();
                if (!segment) {
                    index = endIndex + 1;
                    continue;
                }

                try {
                    values.push(JSON.parse(segment));
                } catch (segmentError) {
                    throw singleParseError;
                }

                index = endIndex;
            }

            if (values.length === 0) {
                throw singleParseError;
            }

            return values;
        }
    }

    // Parse JSON and create sheet structure
    function parseJsonToSheets(data) {
        const sheets = {};

        if (Array.isArray(data)) {
            // If root is array, flatten each item
            const flattenedData = data.map(item => {
                if (item && typeof item === 'object') {
                    return flattenObject(item);
                }
                return { value: item };
            });
            sheets['data'] = flattenedData;
        } else if (typeof data === 'object' && data !== null) {
            // Check for nested arrays (each becomes a sheet)
            let hasArrays = false;
            for (const key in data) {
                if (Array.isArray(data[key]) && data[key].length > 0) {
                    hasArrays = true;
                    sheets[key] = data[key].map(item => {
                        if (item && typeof item === 'object') {
                            return flattenObject(item);
                        }
                        return { value: item };
                    });
                }
            }

            // If no arrays found, create single sheet from object
            if (!hasArrays) {
                sheets['data'] = [flattenObject(data)];
            }
        } else {
            // Primitive root JSON values
            sheets['data'] = [{ value: data }];
        }

        return sheets;
    }

    function getDocumentSheetGroups(documents) {
        return documents.map(doc => parseJsonToSheets(doc));
    }

    function areSingleDataSheetsCompatible(sheetGroups) {
        const headerSets = sheetGroups.map(group => {
            const rows = group.data || [];
            const headers = getHeaders(rows);
            return new Set(headers);
        });

        if (headerSets.length <= 1) {
            return true;
        }

        const nonEmptySets = headerSets.filter(set => set.size > 0);
        if (nonEmptySets.length <= 1) {
            return true;
        }

        // Consider compatible if every document shares at least one column name
        // with another document. This keeps similar exports in one sheet.
        for (let i = 1; i < nonEmptySets.length; i++) {
            let hasOverlap = false;
            for (const key of nonEmptySets[i]) {
                if (nonEmptySets[0].has(key)) {
                    hasOverlap = true;
                    break;
                }
            }
            if (!hasOverlap) {
                return false;
            }
        }

        return true;
    }

    function mergeDocumentsToSheets(documents) {
        const sheetGroups = getDocumentSheetGroups(documents);
        const allSingleData = sheetGroups.every(group => {
            const keys = Object.keys(group);
            return keys.length === 1 && keys[0] === 'data';
        });

        if (allSingleData && areSingleDataSheetsCompatible(sheetGroups)) {
            return {
                sheets: {
                    data: sheetGroups.flatMap(group => group.data || [])
                },
                mergedToSingleSheet: true
            };
        }

        const mergedSheets = {};

        for (let docIndex = 0; docIndex < sheetGroups.length; docIndex++) {
            const group = sheetGroups[docIndex];
            const keys = Object.keys(group);

            if (keys.length === 0) {
                continue;
            }

            for (const key of keys) {
                const rows = group[key] || [];
                let targetSheetName = key;

                // Keep incompatible single-document groups isolated by page.
                if (allSingleData && key === 'data') {
                    targetSheetName = `page_${docIndex + 1}`;
                }

                if (!mergedSheets[targetSheetName]) {
                    mergedSheets[targetSheetName] = [];
                }
                mergedSheets[targetSheetName].push(...rows);
            }
        }

        return {
            sheets: mergedSheets,
            mergedToSingleSheet: false
        };
    }

    // Get all unique headers from sheet data
    function getHeaders(sheetData) {
        const headers = [];
        for (const row of sheetData) {
            if (row && typeof row === 'object') {
                for (const key of Object.keys(row)) {
                    if (!headers.includes(key)) {
                        headers.push(key);
                    }
                }
            }
        }
        return headers;
    }

    // Escape HTML
    function escapeHtml(value) {
        return String(value ?? '')
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;');
    }

    // Render sheet tabs
    function renderSheetTabs() {
        const sheetNames = Object.keys(sheetStructure);

        if (sheetNames.length === 0) {
            sheetTabs.innerHTML = '';
            return;
        }

        sheetTabs.innerHTML = sheetNames.map(name => {
            const isActive = name === activeSheet ? 'active' : '';
            const rowCount = sheetStructure[name].length;
            return `<button class="sheet-tab ${isActive}" data-sheet="${name}">${name} (${rowCount})</button>`;
        }).join('');
    }

    // Render table for active sheet
    function renderTable() {
        const sheetData = sheetStructure[activeSheet] || [];

        if (sheetData.length === 0) {
            tableHead.innerHTML = '';
            tableBody.innerHTML = '<tr><td colspan="100" style="text-align:center;padding:40px;">No data available</td></tr>';
            tableInfoText.textContent = 'No rows';
            return;
        }

        const headers = getHeaders(sheetData);

        // Render headers
        tableHead.innerHTML = `<tr>${headers.map(h => `<th>${escapeHtml(h)}</th>`).join('')}</tr>`;

        // Render rows
        tableBody.innerHTML = sheetData.map(row => {
            const cells = headers.map(header => {
                const value = row && row[header] !== undefined ? row[header] : '';
                return `<td title="${escapeHtml(value)}">${escapeHtml(value)}</td>`;
            }).join('');
            return `<tr>${cells}</tr>`;
        }).join('');

        tableInfoText.textContent = `Showing ${sheetData.length} rows | ${headers.length} columns`;
    }

    // Calculate total rows across all sheets
    function getTotalRows() {
        let total = 0;
        for (const key in sheetStructure) {
            total += sheetStructure[key].length;
        }
        return total;
    }

    // Process uploaded file
    function processFile(file) {
        const reader = new FileReader();

        reader.onload = (e) => {
            try {
                let text = e.target.result;

                // Strip BOM if present
                if (text.charCodeAt(0) === 0xFEFF) {
                    text = text.slice(1);
                }
                text = text.trim();

                const parsedDocuments = parsePossiblyMergedJson(text);
                currentData = parsedDocuments;
                currentFileName = file.name.replace(/\.json$/i, '');
                sourceDocumentCount = parsedDocuments.length;

                // Parse to sheets (single or merged JSON documents)
                const parsedResult = mergeDocumentsToSheets(parsedDocuments);
                sheetStructure = parsedResult.sheets;
                const sheetNames = Object.keys(sheetStructure);

                if (sheetNames.length === 0) {
                    alert('No data found in JSON file');
                    return;
                }

                activeSheet = sheetNames[0];

                // Update UI
                fileName.textContent = file.name;
                const baseMeta = `${sheetNames.length} sheet(s) | ${getTotalRows()} total rows`;
                fileMeta.textContent = sourceDocumentCount > 1
                    ? `${baseMeta} | ${sourceDocumentCount} JSON block(s)`
                    : baseMeta;

                fileInfo.classList.add('show');
                tableContainer.classList.add('show');

                renderSheetTabs();
                renderTable();

            } catch (err) {
                console.error('Error parsing JSON:', err);
                alert('Invalid JSON file: ' + err.message);
            }
        };

        reader.onerror = () => {
            alert('Error reading file');
        };

        reader.readAsText(file);
    }

    // Export to XLSX
    function exportToXlsx() {
        if (!sheetStructure || Object.keys(sheetStructure).length === 0) {
            alert('No data to export');
            return;
        }

        const wb = XLSX.utils.book_new();

        for (const sheetName of Object.keys(sheetStructure)) {
            const data = sheetStructure[sheetName];
            if (data.length === 0) continue;

            const headers = getHeaders(data);

            // Build matrix with headers
            const matrix = [headers];
            for (const row of data) {
                const rowData = headers.map(header => {
                    const value = row && row[header] !== undefined ? row[header] : '';
                    return value;
                });
                matrix.push(rowData);
            }

            const sheet = XLSX.utils.aoa_to_sheet(matrix);

            // Set column widths
            const colWidths = headers.map(h => ({ wch: Math.max(h.length, 15) }));
            sheet['!cols'] = colWidths;

            // Sanitize sheet name (max 31 chars, no special chars)
            const safeName = sheetName.replace(/[\\/*?:\[\]]/g, '').substring(0, 31) || 'Sheet';
            XLSX.utils.book_append_sheet(wb, sheet, safeName);
        }

        const safeFileName = currentFileName.replace(/[<>:"/\\|?*]/g, '') || 'export';
        XLSX.writeFile(wb, `${safeFileName}.xlsx`);
    }

    // Clear all data
    function clearData() {
        currentData = null;
        currentFileName = '';
        sheetStructure = {};
        activeSheet = '';
        sourceDocumentCount = 0;

        fileInfo.classList.remove('show');
        tableContainer.classList.remove('show');
        sheetTabs.innerHTML = '';
        tableHead.innerHTML = '';
        tableBody.innerHTML = '';
        fileInput.value = '';
    }

    // ========== Multi-File Merge Functions ==========

    // Parse file and return parsed data
    function parseFileContent(text) {
        // Strip BOM if present
        if (text.charCodeAt(0) === 0xFEFF) {
            text = text.slice(1);
        }
        text = text.trim();
        return parsePossiblyMergedJson(text);
    }

    // Add files to pending list
    async function addFilesToPending(files) {
        for (const file of files) {
            if (!file.name.endsWith('.json')) {
                continue;
            }

            // Check if already added
            if (pendingFiles.some(pf => pf.file.name === file.name && pf.file.size === file.size)) {
                continue;
            }

            try {
                const text = await readFileAsText(file);
                const data = parseFileContent(text);
                const sheets = mergeDocumentsToSheets(data);
                const rowCount = Object.values(sheets.sheets).reduce((sum, arr) => sum + arr.length, 0);

                pendingFiles.push({
                    file,
                    data,
                    sheets: sheets.sheets,
                    status: 'ready',
                    rowCount
                });
            } catch (err) {
                pendingFiles.push({
                    file,
                    data: null,
                    sheets: null,
                    status: 'error',
                    error: err.message,
                    rowCount: 0
                });
            }
        }

        renderFilesList();
    }

    // Read file as text (Promise-based)
    function readFileAsText(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (e) => resolve(e.target.result);
            reader.onerror = () => reject(new Error('Failed to read file'));
            reader.readAsText(file);
        });
    }

    // Render the files list
    function renderFilesList() {
        if (pendingFiles.length === 0) {
            filesList.classList.remove('show');
            filesItems.innerHTML = '';
            return;
        }

        filesList.classList.add('show');

        const totalRows = pendingFiles.reduce((sum, pf) => sum + pf.rowCount, 0);
        const readyCount = pendingFiles.filter(pf => pf.status === 'ready').length;

        filesItems.innerHTML = pendingFiles.map((pf, index) => `
            <div class="file-item" data-index="${index}">
                <div class="file-item-info">
                    <div class="file-item-icon">
                        <i class="fa-solid fa-file-code"></i>
                    </div>
                    <div class="file-item-details">
                        <h4>${escapeHtml(pf.file.name)}</h4>
                        <p>${pf.status === 'ready' ? `${pf.rowCount} rows` : pf.error || 'Error'}</p>
                    </div>
                </div>
                <div class="file-item-status">
                    <span class="status-badge ${pf.status}">${pf.status === 'ready' ? 'Ready' : 'Error'}</span>
                    <button class="btn-remove-file" data-index="${index}" title="Remove">
                        <i class="fa-solid fa-times"></i>
                    </button>
                </div>
            </div>
        `).join('');

        // Add merge info
        const existingInfo = filesList.querySelector('.merge-info');
        if (existingInfo) {
            existingInfo.remove();
        }

        if (pendingFiles.length > 1) {
            const infoDiv = document.createElement('div');
            infoDiv.className = 'merge-info';
            infoDiv.innerHTML = `
                <i class="fa-solid fa-info-circle"></i>
                <span>${readyCount} files ready to merge | Total: ${totalRows} rows</span>
            `;
            filesList.appendChild(infoDiv);
        }
    }

    // Remove file from pending list
    function removeFileFromPending(index) {
        if (index >= 0 && index < pendingFiles.length) {
            pendingFiles.splice(index, 1);
            renderFilesList();
        }
    }

    // Clear all pending files
    function clearPendingFiles() {
        pendingFiles = [];
        renderFilesList();
        clearData();
    }

    // Merge all pending files and display
    function mergeAllFiles() {
        const readyFiles = pendingFiles.filter(pf => pf.status === 'ready');

        if (readyFiles.length === 0) {
            alert('No valid files to merge');
            return;
        }

        // If only one file, process normally
        if (readyFiles.length === 1) {
            const pf = readyFiles[0];
            currentData = pf.data;
            currentFileName = pf.file.name.replace(/\.json$/i, '');
            sourceDocumentCount = pf.data.length;
            sheetStructure = pf.sheets;
        } else {
            // Merge multiple files
            const allDocuments = [];
            const fileNames = [];

            for (const pf of readyFiles) {
                allDocuments.push(...pf.data);
                fileNames.push(pf.file.name.replace(/\.json$/i, ''));
            }

            currentData = allDocuments;
            currentFileName = `merged_${readyFiles.length}_files`;
            sourceDocumentCount = allDocuments.length;

            // Re-parse merged documents to sheets
            const mergeResult = mergeDocumentsToSheets(allDocuments);
            sheetStructure = mergeResult.sheets;
        }

        const sheetNames = Object.keys(sheetStructure);

        if (sheetNames.length === 0) {
            alert('No data found in files');
            return;
        }

        activeSheet = sheetNames[0];

        // Update UI
        fileName.textContent = readyFiles.length === 1
            ? readyFiles[0].file.name
            : `Merged (${readyFiles.length} files)`;

        const baseMeta = `${sheetNames.length} sheet(s) | ${getTotalRows()} total rows`;
        fileMeta.textContent = readyFiles.length > 1
            ? `${baseMeta} | ${readyFiles.length} files merged`
            : sourceDocumentCount > 1
                ? `${baseMeta} | ${sourceDocumentCount} JSON block(s)`
                : baseMeta;

        fileInfo.classList.add('show');
        tableContainer.classList.add('show');

        renderSheetTabs();
        renderTable();
    }

    // Handle single file process (for backward compatibility)
    function processSingleFile(file) {
        pendingFiles = [];
        addFilesToPending([file]).then(() => {
            if (pendingFiles.length === 1 && pendingFiles[0].status === 'ready') {
                mergeAllFiles();
            }
        });
    }

    // Handle multiple files
    function processMultipleFiles(files) {
        const jsonFiles = Array.from(files).filter(f => f.name.endsWith('.json'));

        if (jsonFiles.length === 0) {
            alert('Please select JSON files');
            return;
        }

        if (jsonFiles.length === 1) {
            // Single file - process directly
            processSingleFile(jsonFiles[0]);
        } else {
            // Multiple files - show in list for merging
            addFilesToPending(jsonFiles);
        }
    }

    // Event Listeners
    fileInput.addEventListener('change', (e) => {
        const files = e.target.files;
        if (files && files.length > 0) {
            // If files list is already showing, add to it
            if (pendingFiles.length > 0) {
                addFilesToPending(Array.from(files).filter(f => f.name.endsWith('.json')));
            } else {
                processMultipleFiles(files);
            }
        }
        // Reset input to allow re-selecting same files
        fileInput.value = '';
    });

    uploadSection.addEventListener('click', (e) => {
        // The label already opens the file picker via `for="json-file"`.
        // Avoid triggering a second programmatic click from the parent.
        if (e.target.closest('label[for="json-file"]') || e.target === fileInput) {
            return;
        }
        fileInput.click();
    });

    // Drag and drop
    uploadSection.addEventListener('dragover', (e) => {
        e.preventDefault();
        uploadSection.classList.add('dragover');
    });

    uploadSection.addEventListener('dragleave', () => {
        uploadSection.classList.remove('dragover');
    });

    uploadSection.addEventListener('drop', (e) => {
        e.preventDefault();
        uploadSection.classList.remove('dragover');

        const files = e.dataTransfer.files;
        if (files && files.length > 0) {
            processMultipleFiles(files);
        } else {
            alert('Please drop JSON files');
        }
    });

    // Sheet tab click
    sheetTabs.addEventListener('click', (e) => {
        const tab = e.target.closest('.sheet-tab');
        if (!tab) return;

        const sheetName = tab.dataset.sheet;
        if (sheetName && sheetName !== activeSheet) {
            activeSheet = sheetName;
            renderSheetTabs();
            renderTable();
        }
    });

    btnDownload.addEventListener('click', exportToXlsx);
    btnClear.addEventListener('click', clearData);

    // Multi-file event listeners
    btnAddMore?.addEventListener('click', () => {
        fileInput.click();
    });

    btnMerge?.addEventListener('click', mergeAllFiles);

    btnClearAll?.addEventListener('click', clearPendingFiles);

    // Remove file from list
    filesItems?.addEventListener('click', (e) => {
        const removeBtn = e.target.closest('.btn-remove-file');
        if (removeBtn) {
            const index = parseInt(removeBtn.dataset.index, 10);
            removeFileFromPending(index);
        }
    });
});
