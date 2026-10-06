const fs = require('fs');
const jsPath = 'c:/Users/jguiv/Desktop/COISAS/PROG/WuSistema/new-site/js/mesa.js';
let js = fs.readFileSync(jsPath, 'utf8');

// 1. Add this.updateState() to MesaQuickMenu.open()
js = js.replace(
  /open\(\) \{\s*this\.isOpen = true;\s*const dropdown = document\.getElementById\('mesa-quick-menu-dropdown'\);\s*const btn = document\.getElementById\('nav-hamburger-btn'\);\s*if \(dropdown\) dropdown\.classList\.add\('active'\);\s*if \(btn\) btn\.classList\.add\('active'\);\s*\}/,
  "open() {\n      this.isOpen = true;\n      const dropdown = document.getElementById('mesa-quick-menu-dropdown');\n      const btn = document.getElementById('nav-hamburger-btn');\n      if (dropdown) dropdown.classList.add('active');\n      if (btn) btn.classList.add('active');\n      this.updateState();\n    }"
);

// 2. Add MesaAreaManager.updateMasterButtons() and MesaQuickMenu.updateState() into updateTokenBtnState()
js = js.replace(
  /this\.state\.isMaster = false;\s*this\.state\.myPlayerSlot = null;\s*this\.updateTokenBtnState\(\);\s*return false;\s*\}/g,
  "this.state.isMaster = false;\n        this.state.myPlayerSlot = null;\n        this.updateTokenBtnState();\n        if (window.MesaAreaManager && typeof MesaAreaManager.updateMasterButtons === 'function') MesaAreaManager.updateMasterButtons();\n        if (window.MesaQuickMenu && typeof MesaQuickMenu.updateState === 'function') MesaQuickMenu.updateState();\n        return false;\n      }"
);

js = js.replace(
  /this\.state\.isMaster = true;\s*this\.state\.myToken = candidateToken;\s*this\.state\.myPlayerSlot = null;\s*localStorage\.setItem\('wu_user_token', candidateToken\);\s*localStorage\.setItem\('mesa_token', candidateToken\);\s*this\.updateTokenBtnState\(\);\s*return true;\s*\}/,
  "this.state.isMaster = true;\n        this.state.myToken = candidateToken;\n        this.state.myPlayerSlot = null;\n        localStorage.setItem('wu_user_token', candidateToken);\n        localStorage.setItem('mesa_token', candidateToken);\n        this.updateTokenBtnState();\n        if (window.MesaAreaManager && typeof MesaAreaManager.updateMasterButtons === 'function') MesaAreaManager.updateMasterButtons();\n        if (window.MesaQuickMenu && typeof MesaQuickMenu.updateState === 'function') MesaQuickMenu.updateState();\n        return true;\n      }"
);

fs.writeFileSync(jsPath, js, 'utf8');
