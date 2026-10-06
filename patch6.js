const fs = require('fs');
const jsPath = 'c:/Users/jguiv/Desktop/COISAS/PROG/WuSistema/new-site/js/mesa.js';
let js = fs.readFileSync(jsPath, 'utf8');

js = js.replace(
  /this\.updateTokenBtnState\(\);\s*MesaChat\.updateSenderIdentity\(\);/g,
  "this.updateTokenBtnState();\n        this.updateAuthChip();\n        MesaChat.updateSenderIdentity();"
);

fs.writeFileSync(jsPath, js, 'utf8');
