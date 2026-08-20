const xlsx = require('xlsx');

function printHeaders(file) {
    console.log(`Headers for ${file}:`);
    const workbook = xlsx.readFile(`public/template/${file}`);
    const sheet_name_list = workbook.SheetNames;
    const data = xlsx.utils.sheet_to_json(workbook.Sheets[sheet_name_list[0]], { header: 1 });
    console.log(data[0] || "No headers found");
    console.log('---');
}

try {
    printHeaders('TemplateAnggota.xlsx');
    printHeaders('TemplateProker.xlsx');
} catch (e) {
    console.error(e);
}
