with open('Sistema_Padrao/css/style.css', 'r', encoding='utf-8') as f:
    css_content = f.read()

# Remove old ARG styles
if "SOBREPOSICAO MODO ARG" in css_content:
    css_content = css_content.split("/* --- SOBREPOSICAO MODO ARG:")[0]

arg_css = '''
/* === ARG INTERFACE: SERIOUS MODE === */
#espectros.race-card {
    background: #0a0a0a;
    border: 1px solid #222;
    color: #0f0;
    font-family: 'Courier New', monospace;
    position: relative;
    overflow: hidden;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.9), inset 0 0 20px rgba(0, 255, 0, 0.05);
}

#espectros.race-card::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 200%;
    height: 100%;
    background: repeating-linear-gradient(
        0deg,
        rgba(0, 255, 0, 0.03),
        rgba(0, 255, 0, 0.03) 1px,
        transparent 1px,
        transparent 2px
    );
    animation: scanlines 8s linear infinite;
    pointer-events: none;
    z-index: 1;
}

@keyframes scanlines {
    0% { transform: translateY(0); }
    100% { transform: translateY(10px); }
}

#espectros.race-card h3 {
    color: #0f0;
    text-shadow: 0 0 5px rgba(0, 255, 0, 0.5);
    font-size: 1.5rem;
    letter-spacing: 2px;
    margin: 0 0 1.5rem 0;
    text-transform: uppercase;
    border-bottom: 1px solid #111;
    padding-bottom: 1rem;
    font-weight: bold;
}

.arg-container {
    position: relative;
    z-index: 2;
}

.arg-terminal {
    background: #000;
    border: 1px solid #0f0;
    padding: 1.5rem;
    margin: 1rem 0;
    line-height: 1.8;
    color: #0f0;
    font-size: 0.95rem;
}

.arg-line {
    margin: 0.5rem 0;
    text-shadow: 0 0 3px rgba(0, 255, 0, 0.3);
}

.arg-line::before {
    content: '> ';
    color: #0f0;
    font-weight: bold;
}

.arg-error {
    color: #f00;
    text-shadow: 0 0 3px rgba(255, 0, 0, 0.5);
}

.arg-redacted {
    background: #0f0;
    color: #000;
    padding: 0 2px;
    font-weight: bold;
}

.arg-glitch-text {
    position: relative;
    display: inline-block;
    color: #0f0;
}

.arg-glitch-text::before,
.arg-glitch-text::after {
    content: attr(data-text);
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
}

.arg-glitch-text::before {
    animation: glitch-1 0.3s infinite;
    color: #f00;
    z-index: -1;
    text-shadow: -2px 0 #f00;
}

.arg-glitch-text::after {
    animation: glitch-2 0.3s infinite;
    color: #0ff;
    z-index: -2;
    text-shadow: 2px 0 #0ff;
}

@keyframes glitch-1 {
    0% { clip-path: polygon(0 0, 100% 0, 100% 35%, 0 35%); transform: translate(-2px, -2px); }
    20% { clip-path: polygon(0 60%, 100% 60%, 100% 100%, 0 100%); transform: translate(2px, 2px); }
    40% { clip-path: polygon(0 30%, 100% 30%, 100% 60%, 0 60%); transform: translate(-2px, 0); }
    60% { clip-path: polygon(0 0, 100% 0, 100% 30%, 0 30%); transform: translate(0, 2px); }
    100% { clip-path: polygon(0 0, 100% 0, 100% 100%, 0 100%); transform: translate(0, 0); }
}

@keyframes glitch-2 {
    0% { clip-path: polygon(0 60%, 100% 60%, 100% 100%, 0 100%); transform: translate(2px, 2px); }
    20% { clip-path: polygon(0 0, 100% 0, 100% 35%, 0 35%); transform: translate(-2px, -2px); }
    40% { clip-path: polygon(0 60%, 100% 60%, 100% 100%, 0 100%); transform: translate(2px, 0); }
    60% { clip-path: polygon(0 30%, 100% 30%, 100% 60%, 0 60%); transform: translate(-2px, 2px); }
    100% { clip-path: polygon(0 0, 100% 0, 100% 100%, 0 100%); transform: translate(0, 0); }
}

.arg-button {
    background: #000;
    border: 1px solid #0f0;
    color: #0f0;
    padding: 0.8rem 1.5rem;
    font-family: 'Courier New', monospace;
    font-size: 0.9rem;
    cursor: pointer;
    text-transform: uppercase;
    letter-spacing: 1px;
    margin-top: 1.5rem;
    transition: all 0.2s;
    text-shadow: 0 0 5px rgba(0, 255, 0, 0.5);
}

.arg-button:hover {
    background: #0f0;
    color: #000;
    box-shadow: 0 0 15px rgba(0, 255, 0, 0.8);
}

.arg-button:active {
    transform: translate(1px, 1px);
}

.arg-corrupted {
    opacity: 0.6;
    text-decoration: line-through;
    color: #666;
}

.arg-metadata {
    font-size: 0.85rem;
    color: #666;
    margin-top: 1.5rem;
    padding-top: 1.5rem;
    border-top: 1px solid #111;
}
'''

with open('Sistema_Padrao/css/style.css', 'w', encoding='utf-8') as f:
    f.write(css_content + arg_css)
    
print("CSS updated")
