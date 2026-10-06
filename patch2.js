const fs = require('fs');
const jsPath = 'c:/Users/jguiv/Desktop/COISAS/PROG/WuSistema/new-site/js/mesa.js';
let js = fs.readFileSync(jsPath, 'utf8');

js = js.replace(
  "const npcsBtn = document.getElementById('menu-npcs-btn');\n    if (npcsBtn) {\n      npcsBtn.style.display = isMaster ? 'flex' : 'none';\n    }",
  "const npcsBtn = document.getElementById('menu-npcs-btn');\n    if (npcsBtn) {\n      npcsBtn.style.display = isMaster ? 'flex' : 'none';\n    }\n\n    const roteiroBtn = document.getElementById('menu-roteiro-btn');\n    if (roteiroBtn) {\n      roteiroBtn.style.display = isMaster ? 'flex' : 'none';\n    }"
);

js = js.replace(
  "const mobileChooseArea = document.getElementById('mobile-choose-area-item');\n\n    const isMaster = MesaApp && MesaApp.state && MesaApp.state.isMaster;\n    const myToken = MesaApp && MesaApp.state && MesaApp.state.myToken;\n\n    if (mobileChooseArea) {\n      mobileChooseArea.style.display = isMaster ? 'flex' : 'none';\n    }",
  "const mobileChooseArea = document.getElementById('mobile-choose-area-item');\n\n    const isMaster = MesaApp && MesaApp.state && MesaApp.state.isMaster;\n    const myToken = MesaApp && MesaApp.state && MesaApp.state.myToken;\n\n    if (mobileChooseArea) {\n      mobileChooseArea.style.display = isMaster ? 'flex' : 'none';\n    }\n\n    const mobileRoteiroBtn = document.getElementById('mobile-roteiro-item');\n    if (mobileRoteiroBtn) {\n      mobileRoteiroBtn.style.display = isMaster ? 'flex' : 'none';\n    }"
);

fs.writeFileSync(jsPath, js, 'utf8');
