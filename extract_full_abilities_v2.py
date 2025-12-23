
import re
import json
import os
from html.parser import HTMLParser

# Path to the HTML file
input_path = r"g:\Wuitalur\Site com os sistemas\Sistema_Padrao\html\index.html"

# Mapping IDs to readable names if necessary, or just use the ID/Title
class_map = {
    "cavaleiros-paladium": "Cavaleiros de Paladium",
    "rastejantes": "Rastejantes",
    "protegidos": "Protegidos",
    "consagrados": "Consagrados",
    "furtassaltantes": "Furtassaltantes"
}

def clean_text(text):
    return re.sub(r'\s+', ' ', text).strip()

def extract_content_from_html(file_path):
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()

    # Find the classes section
    classes_section_match = re.search(r'<section id="classes".*?</section>', content, re.DOTALL)
    if not classes_section_match:
        return {}
    
    classes_html = classes_section_match.group(0)
    
    # Process each class
    ability_library = {}

    for class_id, class_name in class_map.items():
        # Regex to find the class card
        class_regex = f'<div id="{class_id}" class="class-card">.*?</div>\s*<!--'
        # Note: The closing div might be hard to match with greedy regex. 
        # Better approach: Find the start of the div, then find the next class-card or end of container.
        
        start_marker = f'<div id="{class_id}" class="class-card">'
        start_idx = classes_html.find(start_marker)
        if start_idx == -1:
            print(f"Could not find class {class_id}")
            continue
            
        # Find end of this class card (next class card or end of classes container)
        # Assuming comments <! -- Classe: ... --> separate them or end of container
        # Use simpler matching: match balanced divs? No, regex is risky.
        # Let's slice from start_idx to end
        
        sub_content = classes_html[start_idx:]
        
        # Determine strict boundary: next <div ... class="class-card"> or </div> matching the container
        # Hacky but effective for this specific file structure: look for next "<!-- Classe:"
        next_class_idx = sub_content.find('<!-- Classe:', 5) # Skip initial
        if next_class_idx != -1:
            class_block = sub_content[:next_class_idx]
        else:
            # Maybe end of container
            class_block = sub_content
            
        # Now parse abilities inside this class_block
        # Looking for <div class="class-abilities"> that contains <h4>Habilidades de Classe</h4>
        
        abilities_block_match = re.search(r'<div class="class-abilities">.*?<h4>Habilidades de Classe</h4>(.*?)</div>', class_block, re.DOTALL)
        
        if not abilities_block_match:
            # Maybe the div class has extra classes like "solar-glow"?
            # Let's try searching for the header specifically
            header_idx = class_block.find('<h4>Habilidades de Classe</h4>')
            if header_idx != -1:
                 # Find the closing div for this section. This is tricky without a parser.
                 # Let's assume the block goes until the next "class-abilities" or "class-stat-block" or "rank-system" or end of div.
                 remaining = class_block[header_idx:]
                 # Find next div with class that implies a new section
                 end_sec = re.search(r'<div class="class-stat-block|<div class="rank-system|<div class="class-abilities', remaining[5:])
                 if end_sec:
                     abilities_html = remaining[:end_sec.start()]
                 else:
                     abilities_html = remaining
            else:
                print(f"No abilities found for {class_name}")
                continue
        else:
            abilities_html = abilities_block_match.group(1)

        class_abilities = {}
        
        # Split by levels "<h5>Nível X...</h5>"
        # We find all h5 tags
        levels = re.split(r'<h5>(.*?)</h5>', abilities_html)
        
        # re.split returns [preamble, title1, content1, title2, content2...]
        # Skip index 0 usually
        
        for i in range(1, len(levels), 2):
            level_title_raw = levels[i]
            level_content = levels[i+1]
            
            # Extract level number
            level_match = re.search(r'Nível (\d+)', level_title_raw)
            if not level_match:
                continue
            level_key = f"Nível {level_match.group(1)}"
            
            # Find <ul> list items
            # There might be explanatory text before the ul (ignored for DB usually)
            
            ul_match = re.search(r'<ul>(.*?)</ul>', level_content, re.DOTALL)
            if not ul_match:
                continue
                
            lis = re.findall(r'<li>(.*?)</li>', ul_match.group(1), re.DOTALL)
            
            abilities_list = []
            for li_content in lis:
                # 1. Extract Name
                name_match = re.search(r'<strong>(.*?)</strong>', li_content)
                if not name_match:
                    continue
                
                # Clean name: remove <br>, trim, remove trailing colon
                raw_name = re.sub(r'<[^>]+>', '', name_match.group(1)).strip()
                if raw_name.endswith(':'): 
                    raw_name = raw_name[:-1]
                elif raw_name.endswith(' - Ganha Naturalmente'):
                    raw_name = raw_name.replace(' - Ganha Naturalmente', '')

                # 2. Extract Metadata (Action, Cost) found in <em> tags usually at the end
                # Common patterns: <em class="action-bonus">...</em> <em class="energy-cost">...</em>
                # Or just <em>Action</em>
                
                action = "Passiva" # Default
                cost = "Nenhum"
                
                # Check specifics
                action_match = re.search(r'<em class="action-[^"]+">(.*?)</em>', li_content)
                if not action_match:
                    # Generic em check?
                     pass
                else:
                    action = clean_text(re.sub(r'<[^>]+>', '', action_match.group(1)))
                    # Clean up things like "< • Ação Bônus • >" -> "Ação Bônus"
                    action = action.replace('< • ', '').replace(' • >', '').replace('•', '').strip()

                cost_match = re.search(r'<em class="energy-cost">(.*?)</em>', li_content)
                if cost_match:
                    cost = clean_text(cost_match.group(1))
                    if cost.startswith('-') and cost.endswith('-'):
                        cost = cost[1:-1] # Remove dashes
                    cost = cost.strip()

                # 3. Extract Description
                # Remove the name tag
                desc_html = li_content.replace(name_match.group(0), '', 1)
                
                # Remove the metadata tags we found
                if action_match:
                    desc_html = desc_html.replace(action_match.group(0), '')
                if cost_match:
                    desc_html = desc_html.replace(cost_match.group(0), '')
                
                # Remove - Passiva - markers if they were plain text or simple ems
                # Sometimes it's <em class="action-passive">-Passiva-</em>
                passive_match = re.search(r'<em class="action-passive">(.*?)</em>', desc_html)
                if passive_match:
                    action = "Passiva"
                    desc_html = desc_html.replace(passive_match.group(0), '')

                # Also Clean up "<br>" at the start or end
                # Convert <br> to newlines for the text
                desc_text = re.sub(r'<br\s*/?>', '\n', desc_html)
                
                # Handle nested lists <ul> in description 
                # (e.g. Erupção Solar has bullets)
                # Replace <li> inside description with "- "
                desc_text = re.sub(r'<li[^>]*>', '\n- ', desc_text)
                desc_text = re.sub(r'</li>', '', desc_text)
                desc_text = re.sub(r'<ul[^>]*>', '\n', desc_text)
                desc_text = re.sub(r'</ul>', '', desc_text)
                
                # Remove all other tags (span, etc) but keep text
                desc_text = re.sub(r'<[^>]+>', '', desc_text)
                
                # Unescape entities
                desc_text = desc_text.replace('&lt;', '<').replace('&gt;', '>').replace('&nbsp;', ' ')
                
                # Clean whitespace
                lines = [line.strip() for line in desc_text.split('\n') if line.strip()]
                final_desc = '\n'.join(lines)
                
                # Fix cases where name was followed by " - Ganha Naturalmente" in text
                if final_desc.startswith('- Ganha Naturalmente'):
                    final_desc = final_desc.replace('- Ganha Naturalmente', '', 1).strip()
                if final_desc.startswith(':'):
                    final_desc = final_desc[1:].strip()

                abilities_list.append({
                    "name": raw_name.strip(),
                    "cost": cost.strip(),
                    "type": action.strip(),
                    "description": final_desc
                })
            
            if abilities_list:
                class_abilities[level_key] = abilities_list

        ability_library[class_name] = class_abilities

    # Perform specific manual fixes based on observation
    # Sometimes levels are ranges or groupings that might be missed if strictly looking for "Nível X"
    # But current HTML looks like "<h5>Nível 1</h5>" etc.
    
    return ability_library

data = extract_content_from_html(input_path)
print(json.dumps(data, indent=4, ensure_ascii=False))
