
import re
import json
import os

# Path to the HTML file
input_path = r"g:\Wuitalur\Site com os sistemas\Sistema_Padrao\html\index.html"

# Mapping IDs to readable names
class_map = {
    "cavaleiros-paladium": "Cavaleiros de Paladium",
    "rastejantes": "Rastejantes",
    "protegidos": "Protegidos",
    "consagrados": "Consagrados",
    "furtassaltante": "Furtassaltantes" 
}

def clean_text(text):
    # Unescape common entities
    text = text.replace('&lt;', '<').replace('&gt;', '>').replace('&nbsp;', ' ').replace('&quot;', '"').replace('&apos;', "'")
    return re.sub(r'\s+', ' ', text).strip()

def strip_tags_preserve_structure(html):
    # Convert <br> to newline
    text = re.sub(r'<br\s*/?>', '\n', html)
    # Convert <li> to "- "
    text = re.sub(r'<li[^>]*>', '\n- ', text)
    text = re.sub(r'</li>', '', text)
    # Convert <ul> to newline
    text = re.sub(r'<ul[^>]*>', '\n', text)
    text = re.sub(r'</ul>', '', text)
    # Remove all other tags
    text = re.sub(r'<[^>]+>', '', text)
    # Clean up multiple newlines
    lines = [line.strip() for line in text.split('\n') if line.strip()]
    return '\n'.join(lines)

def extract_content_from_html(file_path):
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()

    classes_section_match = re.search(r'<section id="classes".*?</section>', content, re.DOTALL)
    if not classes_section_match:
        return {}
    
    classes_html = classes_section_match.group(0)
    ability_library = {}

    for class_id, class_name in class_map.items():
        # Find start of class card
        start_marker = f'<div id="{class_id}" class="class-card">'
        start_idx = classes_html.find(start_marker)
        if start_idx == -1:
            print(f"Could not find class {class_id}")
            continue
            
        # Find end of class card
        # Look for next class card or end of container
        # We can look for the next id="..." class="class-card" 
        # or just split by class-card but regex is heavy.
        # Let's find the closing div of the class card? No, nesting makes it hard.
        # Fallback: Search for `<!-- Classe:` which seems consistent.
        
        sub_content = classes_html[start_idx+len(start_marker):]
        next_class_idx = sub_content.find('<!-- Classe:')
        if next_class_idx != -1:
            class_block = sub_content[:next_class_idx]
        else:
            class_block = sub_content

        class_abilities = {}

        # Scan for ability sections.
        # Pattern: <div class="class-abilities" ...> ... </h4> ... </div>
        # But for Protegidos there are multiple.
        # We want to perform a findall for class-abilities divs and process them if they contain "Habilidades" in h4/h5
        
        # Split by class-abilities div
        # Find all chunks that look like ability sections
        # Helper extraction
        
        ability_sections = re.finditer(r'<div class="class-abilities[^"]*"(.*?)</div>', class_block, re.DOTALL)
        # Note: Greedy matching for </div> is BAD. It will eat everything.
        # We cannot reliably regex match nested divs.
        
        # Iterative Search Approach for "class-abilities"
        # 1. Find `<div class="class-abilities`
        # 2. Extract content until we heuristically find the end.
        
        cursor = 0
        while True:
            abilities_start = class_block.find('<div class="class-abilities', cursor)
            if abilities_start == -1:
                break
                
            # Find the header to see if it's relevant
            # Header is usually first h4 child
            # We assume the section ends before the next class-stat-block, rank-system, or class-abilities
            
            # Find next semantic block start to define bound
            next_block_search = [
                 class_block.find('<div class="class-stat-block', abilities_start + 1),
                 class_block.find('<div class="rank-system', abilities_start + 1),
                 class_block.find('<div class="class-abilities', abilities_start + 1),
                 class_block.find('<div class="incomplete-class-banner', abilities_start + 1)
            ]
            next_block_search = [x for x in next_block_search if x != -1]
            if next_block_search:
                limit = min(next_block_search)
                section_content = class_block[abilities_start:limit]
                cursor = limit # Set cursor to start of next block
            else:
                section_content = class_block[abilities_start:]
                cursor = len(class_block)

            # Check if this section contains Habilidades
            # For Protegidos: "Habilidades (Protegido)", "Habilidades (Criatura)"
            # For others: "Habilidades de Classe"
            header_match = re.search(r'<h4[^>]*>(.*?)</h4>', section_content)
            if not header_match:
                continue
                
            header_text = header_match.group(1).lower()
            if "habilidades" not in header_text and "mecânica" not in header_text:
                continue
                
            # Allow "Mecânica" only if it has levels? No, usually "Mecânica" is passive stuff without level headers.
            # But the user wants "Nível X" structure.
            
            # Parse Levels inside this section
            levels = re.split(r'<h5[^>]*>(.*?)</h5>', section_content)
            
            for i in range(1, len(levels), 2):
                level_title_raw = levels[i]
                level_content = levels[i+1]
                
                # Check if it is a Level header
                if "Nível" not in level_title_raw:
                    continue
                    
                lvl_match = re.search(r'(\d+)', level_title_raw)
                if not lvl_match:
                    continue
                level_num = lvl_match.group(1)
                level_key = f"Nível {level_num}"
                
                # Extract <li> items
                ul_match = re.search(r'<ul>(.*?)</ul>', level_content, re.DOTALL)
                if not ul_match:
                    continue
                    
                lis = re.findall(r'<li>(.*?)</li>', ul_match.group(1), re.DOTALL)
                
                if level_key not in class_abilities:
                    class_abilities[level_key] = []
                
                for li_content in lis:
                    # Name extraction
                    name_match = re.search(r'<strong[^>]*>(.*?)</strong>', li_content)
                    if name_match:
                        raw_name = clean_text(re.sub(r'<[^>]+>', '', name_match.group(1)))
                        if raw_name.endswith(':'): raw_name = raw_name[:-1]
                        
                        # Fix for Consagrados "Efeito"
                        if raw_name == "Efeito" and class_name == "Consagrados":
                            # Maybe rename to "Selo de Nível X" or just keep Efeito?
                            # Use Efeito, but maybe content implies something else.
                            pass
                    else:
                        raw_name = "Habilidade"

                    # Clean metadata
                    action = "Passiva"
                    cost = "Nenhum"
                    
                    # Action
                    act_match = re.search(r'<em class="action-[^"]+">(.*?)</em>', li_content)
                    if act_match:
                         # Extracts " < • Ação Bônus • > "
                         t = clean_text(re.sub(r'<[^>]+>', '', act_match.group(1)))
                         action = t.replace('<', '').replace('>', '').replace('•', '').strip()
                    
                    # Cost
                    cst_match = re.search(r'<em class="energy-cost">(.*?)</em>', li_content)
                    if cst_match:
                         t = clean_text(re.sub(r'<[^>]+>', '', cst_match.group(1)))
                         if t.startswith('-') and t.endswith('-'): t = t[1:-1]
                         cost = t.strip()
                         
                    # Description
                    # Remove name part
                    desc_part = li_content
                    if name_match:
                        desc_part = desc_part.replace(name_match.group(0), '', 1)
                        
                    # Remove metadata parts
                    if act_match: desc_part = desc_part.replace(act_match.group(0), '')
                    if cst_match: desc_part = desc_part.replace(cst_match.group(0), '')
                    
                    # Remove any leftover <em class="action-passive">
                    pass_match = re.search(r'<em class="action-[^"]+">(.*?)</em>', desc_part)
                    if pass_match:
                        t = clean_text(re.sub(r'<[^>]+>', '', pass_match.group(1)))
                        if "Passiva" in t: action = "Passiva"
                        desc_part = desc_part.replace(pass_match.group(0), '')

                    # Final clean
                    final_desc = strip_tags_preserve_structure(desc_part)
                    
                    # Specific fixes
                    if final_desc.startswith(':'): final_desc = final_desc[1:].strip()
                    if final_desc.startswith('- Ganha Naturalmente'): final_desc = final_desc.replace('- Ganha Naturalmente', '', 1).strip()

                    class_abilities[level_key].append({
                        "name": raw_name,
                        "cost": cost,
                        "type": action,
                        "description": final_desc
                    })

        ability_library[class_name] = class_abilities
        
    return ability_library

data = extract_content_from_html(input_path)
print(json.dumps(data, indent=4, ensure_ascii=False))
