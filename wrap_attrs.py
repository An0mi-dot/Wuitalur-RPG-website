import re

files = [
    r"C:\Users\jguiv\Desktop\COISAS\PROG\WuSistema\new-site\races.html",
    r"C:\Users\jguiv\Desktop\COISAS\PROG\WuSistema\new-site\atributos.html",
]

# Ordered replacements (longer/more specific first to avoid conflicts)
replacements = [
    (r'\bResistência Elemental\b', 'attr-re'),
    (r'\bResistencia Elemental\b', 'attr-re'),
    (r'\bResistência Física\b', 'attr-rf'),
    (r'\bResistencia Fisica\b', 'attr-rf'),
    (r'\bEnergia Astral\b', 'attr-ea'),
    (r'\bEnergia de Lodo\b', None),  # skip - not an attribute
    (r'\bSentidos\b', 'attr-sen'),
    (r'\bSentido\b', 'attr-sen'),
    (r'\bDestreza\b', 'attr-des'),
    (r'\bIntelecto\b', 'attr-int'),
    (r'\bForça\b', 'attr-fr'),
    (r'\bForca\b', 'attr-fr'),
    (r'\bSaúde\b', 'attr-saude'),
    (r'\bsaúde\b', 'attr-saude'),
    (r'\bFAMA\b', 'attr-fama'),
    (r'\bCOSMO\b', 'attr-cosmo'),
    (r'\bDES\b', 'attr-des'),
    (r'\bDex\b', 'attr-des'),
    (r'\bFAM\b', 'attr-fama'),
    (r'\bSEN\b', 'attr-sen'),
    (r'\bSen\b', 'attr-sen'),
    (r'\bINT\b', 'attr-int'),
    (r'\bInt\b', 'attr-int'),
    (r'\bFRA\b', 'attr-rf'),
    (r'\bFama\b', 'attr-fama'),
    (r'\bFR\b', 'attr-fr'),
    (r'\bFor\b', 'attr-fr'),
    (r'\bRF\b', 'attr-rf'),
    (r'\bRE\b', 'attr-re'),
    (r'\bRe\b', 'attr-re'),
]

for filepath in files:
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    for pattern, cls in replacements:
        if cls is None:
            continue  # skip

        def replace_fn(match):
            word = match.group(0)
            return f'<span class="{cls}">{word}</span>'

        content = re.sub(pattern, replace_fn, content)

    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)

    print(f"Done: {filepath}")
