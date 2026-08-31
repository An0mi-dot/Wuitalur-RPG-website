const fs = require('fs');
const file = 'C:/Users/jguiv/Desktop/COISAS/PROG/WuSistema/new-site/fios-do-medo/racas.html';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(/<span class="attr-saude">FR<\/span>/g, '<span class="attr-forca">Força</span>');

fs.writeFileSync(file, content, 'utf8');
