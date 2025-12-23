import re
import json

def extract_items(file_path):
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()

    # Find the Equipamentos section
    start_tag = '<section id="equipamentos" class="content-section">'
    start_index = content.find(start_tag)
    
    if start_index == -1:
        print("Equipamentos section not found")
        return

    # Extract relevant portion (until next section or end)
    content = content[start_index:]
    
    # Regex to find categories
    # <div class="equipment-category">
    #    <h3>Category Name</h3>
    #    <div class="equipment-grid">
    #       ... items ...
    #    </div>
    # </div>
    
    category_pattern = re.compile(
        r'<div class="equipment-category">\s*<h3>(?P<category>.*?)</h3>\s*<div class="equipment-grid">(?P<grid_content>.*?)</div>\s*</div>',
        re.DOTALL
    )

    item_pattern = re.compile(
        r'<div class="item-card">\s*'
        r'<div class="item-header">\s*<h4>(?P<name>.*?)</h4>\s*<span class="weight-indicator (?P<weight_class>.*?)">(?P<weight>.*?)</span>\s*</div>\s*'
        r'<div class="item-stats-grid">\s*(?P<stats>.*?)\s*</div>\s*'
        r'<p class="item-desc">(?P<desc>.*?)</p>\s*'
        r'(?:<p class="item-effect">(?P<effect>.*?)</p>)?',
        re.DOTALL
    )

    stat_pattern = re.compile(r'<div class="stat-item"><strong>(?P<key>.*?):</strong>\s*(?P<val>.*?)</div>', re.DOTALL)

    items_db = {}

    for cat_match in category_pattern.finditer(content):
        category = cat_match.group('category').strip()
        grid_content = cat_match.group('grid_content')
        
        items_db[category] = []
        
        for item_match in item_pattern.finditer(grid_content):
            name = item_match.group('name').strip()
            weight = item_match.group('weight').strip()
            stats_block = item_match.group('stats')
            desc = item_match.group('desc').replace('\n', ' ').strip()
            effect = item_match.group('effect')
            
            if effect:
                effect = effect.replace('\n', ' ').strip()
                # Remove extra spaces
                effect = re.sub(r'\s+', ' ', effect)

            # Clean name (sometimes has tags inside? unlikely based on reading)
            
            stats = {}
            for stat_match in stat_pattern.finditer(stats_block):
                k = stat_match.group('key').strip()
                v = stat_match.group('val').replace('\n', ' ').strip()
                # clean span tags from value (e.g. <span class="attr-destreza">DES</span>)
                v = re.sub(r'<[^>]+>', '', v).strip()
                stats[k] = v

            item_obj = {
                "name": name,
                "weight": weight,
                "stats": stats,
                "description": desc,
                "effect": effect
            }
            
            items_db[category].append(item_obj)

    return items_db

if __name__ == "__main__":
    items = extract_items(r"g:\Wuitalur\Site com os sistemas\Sistema_Padrao\html\index.html")
    
    with open("items_db.json", "w", encoding="utf-8") as f:
        json.dump(items, f, indent=4, ensure_ascii=False)

    print("Extraction complete. Saved to items_db.json")
