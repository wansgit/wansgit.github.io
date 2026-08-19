/**
 * Regenerate js/data.js from JSON data files.
 * Run: node render-data.js
 * After any admin panel changes.
 */
const fs = require('fs');
const path = require('path');

const dataDir = path.join(__dirname, 'data');
const outFile = path.join(__dirname, 'js', 'data.js');

const extensions = JSON.parse(fs.readFileSync(path.join(dataDir, 'extensions.json'), 'utf8'));
const categories = JSON.parse(fs.readFileSync(path.join(dataDir, 'categories.json'), 'utf8'));

// Convert categories array back to object format for the site
const catObj = {};
categories.forEach(c => {
    catObj[c.id] = {
        name: c.name,
        icon: c.icon || 'fas fa-folder',
        description: c.description || '',
        color: c.color || '#58a6ff'
    };
});

// Convert extensions back to the format main.js expects
const extArr = extensions.map(ext => {
    const obj = {
        extension: ext.extension,
        name: ext.name,
        category: ext.category,
        categoryName: ext.categoryName || ext.category,
        description: ext.description || '',
        details: Array.isArray(ext.details) ? ext.details.join(' ') : (ext.details || ''),
        mimeTypes: ext.mimeTypes || [],
        programs: [],
        alternatives: ext.compatibleFormats || ext.alternatives || [],
        developed: ext.developedBy || ext.developer || '',
        developer: ext.developer || ext.developedBy || '',
        popularity: ext.popularity || 0
    };

    // Rebuild programs array from free/paid software lists
    (ext.freeSoftware || []).forEach(name => {
        obj.programs.push({ name, platform: '', free: true });
    });
    (ext.paidSoftware || []).forEach(name => {
        obj.programs.push({ name, platform: '', free: false });
    });

    return obj;
});

// Sort by popularity descending
extArr.sort((a, b) => b.popularity - a.popularity);

let js = '// File Extension Data - Auto-generated from JSON\n';
js += '// DO NOT EDIT MANUALLY - Run: node render-data.js\n';
js += '// Generated: ' + new Date().toISOString() + '\n\n';
js += 'const fileExtensions = ' + JSON.stringify(extArr, null, 4) + ';\n\n';
js += 'const categories = ' + JSON.stringify(catObj, null, 4) + ';\n';

fs.writeFileSync(outFile, js, 'utf8');
console.log(`Generated data.js with ${extArr.length} extensions and ${Object.keys(catObj).length} categories.`);
console.log(`File: ${outFile}`);