document.getElementById('loadFiles').addEventListener('click', async () => {
    const res = await fetch('/api/files');
    const files = await res.json();
    document.getElementById('output').innerHTML = JSON.stringify(files, null, 2);
});

document.getElementById('loadSheetData').addEventListener('click', async () => {
    const res = await fetch('/api/sheets');
    const sheetData = await res.json();
    document.getElementById('output').innerHTML = JSON.stringify(sheetData, null, 2);
});
