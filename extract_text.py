import docx2txt
import os

docx_path = r"g:\Wuitalur\Site com os sistemas\Wuitalur RPG - Sistema _ 1.3.7 _.docx"
output_path = r"g:\Wuitalur\Site com os sistemas\extracted_system.txt"

if os.path.exists(docx_path):
    text = docx2txt.process(docx_path)
    with open(output_path, "w", encoding="utf-8") as f:
        f.write(text)
    print(f"Successfully extracted text to {output_path}")
else:
    print(f"File not found: {docx_path}")
