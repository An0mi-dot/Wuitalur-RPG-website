const fs = require('fs');
const jsPath = 'c:/Users/jguiv/Desktop/COISAS/PROG/WuSistema/new-site/js/mesa.js';
let js = fs.readFileSync(jsPath, 'utf8');

js = js.replace(
  /const npcsBtn = document\.getElementById\('menu-npcs-btn'\);\s*if \(npcsBtn\) \{\s*npcsBtn\.style\.display = isMaster \? 'flex' : 'none';\s*\}/,
  "const npcsBtn = document.getElementById('menu-npcs-btn');\n    if (npcsBtn) {\n      npcsBtn.style.display = isMaster ? 'flex' : 'none';\n    }\n\n    const roteiroBtn = document.getElementById('menu-roteiro-btn');\n    if (roteiroBtn) {\n      roteiroBtn.style.display = isMaster ? 'flex' : 'none';\n    }"
);

js = js.replace(
  /const mobileChooseArea = document\.getElementById\('mobile-choose-area-item'\);\s*const isMaster = MesaApp && MesaApp\.state && MesaApp\.state\.isMaster;\s*const myToken = MesaApp && MesaApp\.state && MesaApp\.state\.myToken;\s*if \(mobileChooseArea\) \{\s*mobileChooseArea\.style\.display = isMaster \? 'flex' : 'none';\s*\}/,
  "const mobileChooseArea = document.getElementById('mobile-choose-area-item');\n\n    const isMaster = MesaApp && MesaApp.state && MesaApp.state.isMaster;\n    const myToken = MesaApp && MesaApp.state && MesaApp.state.myToken;\n\n    if (mobileChooseArea) {\n      mobileChooseArea.style.display = isMaster ? 'flex' : 'none';\n    }\n\n    const mobileRoteiroBtn = document.getElementById('mobile-roteiro-item');\n    if (mobileRoteiroBtn) {\n      mobileRoteiroBtn.style.display = isMaster ? 'flex' : 'none';\n    }"
);

// We ALSO need to add the roteiroBtn to MesaAreaManager.updateMasterButtons !
js = js.replace(
  /const mobileNpcsItem = document\.getElementById\('mobile-npcs-item'\);/,
  "const mobileNpcsItem = document.getElementById('mobile-npcs-item');\n    const roteiroBtn = document.getElementById('menu-roteiro-btn');\n    const mobileRoteiroBtn = document.getElementById('mobile-roteiro-item');"
);

js = js.replace(
  /if \(mobileNpcsItem\) \{\s*mobileNpcsItem\.style\.display = isMaster \? 'flex' : 'none';\s*\}/,
  "if (mobileNpcsItem) {\n      mobileNpcsItem.style.display = isMaster ? 'flex' : 'none';\n    }\n    if (roteiroBtn) {\n      roteiroBtn.style.display = isMaster ? 'inline-flex' : 'none';\n    }\n    if (mobileRoteiroBtn) {\n      mobileRoteiroBtn.style.display = isMaster ? 'flex' : 'none';\n    }"
);


fs.writeFileSync(jsPath, js, 'utf8');
