from docx import Document
doc = Document('Wuitalur RPG - Sistema _ 1.3.9 _.docx')

for j in range(4017, 4195):
    t = doc.paragraphs[j].text.strip()
    if t:
        try:
            print(f"[{j}] {t}", flush=True)
        except:
            pass
