import re
import json

def extract_items_robust(file_path):
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()

    # Locate the start of Equipamentos section to avoid picking up other h3s
    start_tag = '<section id="equipamentos" class="content-section">'
    start_index = content.find(start_tag)
    if start_index == -1: return {}
    content = content[start_index:]

    # We will iterate through lines or chunks.
    # But regex finditer is good if we construct it well.
    # Let's find "Category Headers" AND "Item Cards" in order of appearance.
    
    # Pattern for Category Header: <h3>Title</h3>
    # Pattern for Item Card: <div class="item-card"> ... </div> (We have to be careful with closing div)
    
    # Actually, simpler: split by '<div class="equipment-category">'
    categories_splits = content.split('<div class="equipment-category">')
    
    items_db = {}
    
    for section in categories_splits[1:]: # Skip text before first category
        # First capture the category name
        h3_match = re.search(r'<h3>(.*?)</h3>', section)
        if not h3_match: continue
        
        cat_name = h3_match.group(1).strip()
        items_db[cat_name] = []
        
        # Now find all item cards in this section
        # We can't use simple regex for item card because of nested divs.
        # But we know they start with <div class="item-card"> and end with... </div>? 
        # Actually they are siblings inside grid.
        # Let's use string partitioning for 'class="item-card">'
        
        cards = section.split('class="item-card">')
        for card_raw in cards[1:]: 
            # card_raw starts with the content INSIDE the card div (minus the opening tag)
            # We need to find where it ends. 
            # It ends before the next item-card OR before the end of the container.
            # But wait, looking for where it ends is hard without parsing divs.
            
            # Fortunately, the internal structure is consistent.
            # It contains: 
            #  <div class="item-header"> ... </div>
            #  <div class="item-stats-grid"> ... </div>
            #  <p class="item-desc"> ... </p>
            #  <p class="item-effect"> ... </p> (Optional)
            
            # Let's just Regex search for these components within 'card_raw' until we hit something that looks like the start of next card or end of grid.
            # Actually, regex matching the inner parts is safer than matching the outer div.
            
            name_match = re.search(r'<h4>(.*?)</h4>', card_raw)
            if not name_match: continue # Not a valid card chunk
            name = name_match.group(1).strip()
            
            weight_match = re.search(r'class="weight-indicator (.*?)">(.*?)</span>', card_raw)
            weight = weight_match.group(2).strip() if weight_match else "?"
            
            # stats grid
            # It's inside <div class="item-stats-grid"> ... </div>
            # We can find the start of stats grid
            stats = {}
            stats_start = card_raw.find('class="item-stats-grid">')
            if stats_start != -1:
                stats_end = card_raw.find('</div>', stats_start) # Should be safe-ish assuming stats don't have nested divs (they contain stat-item divs! Unsafe)
                
                # Let's regex for stat-items instead.
                # Look for all stat-items before the description or next header
                # Limit the search scope to reasonable length or until <p class="item-desc">
                
                desc_start = card_raw.find('class="item-desc">')
                limit = desc_start if desc_start != -1 else len(card_raw)
                
                stats_chunk = card_raw[stats_start:limit]
                
                for s_m in re.finditer(r'<div class="stat-item"><strong>(.*?):</strong>(.*?)</div>', stats_chunk, re.DOTALL):
                     k = s_m.group(1).strip()
                     v = re.sub(r'<[^>]+>', '', s_m.group(2)).strip().replace('\n', ' ')
                     stats[k] = v

            # Desc
            desc_match = re.search(r'<p class="item-desc">(.*?)</p>', card_raw, re.DOTALL)
            desc = desc_match.group(1).replace('\n', ' ').strip() if desc_match else ""
            
            # Effect
            # It might appear before next card
            effect = ""
            eff_match = re.search(r'<p class="item-effect">(.*?)</p>', card_raw, re.DOTALL)
            # We must ensure this effect belongs to THIS card, i.e., appears before next "item-card" or end of block
            # Since we split by item-card, 'card_raw' contains everything after this card started. 
            # But it also contains the rest of the file if we are not careful? 
            # NO, 'cards' is a list from split. card_raw goes until the start of next card (because we split by it).
            # So card_raw contains exactly one card + maybe some closing divs/whitespace at the end.
            
            if eff_match:
                 effect = eff_match.group(1).replace('\n', ' ').strip()
                 effect = re.sub(r'<[^>]+>', '', effect) # Clean bold tags within effect if desired? Or keep them?
                 # User likes formatting. Let's keep minimal formatting but remove newlines.
                 # Let's re-read effect with html tags preserved but flattened space
                 effect = re.sub(r'\s+', ' ', eff_match.group(1).strip())
            
            items_db[cat_name].append({
                "name": name,
                "weight": weight,
                "stats": stats,
                "description": desc,
                "effect": effect
            })

    return items_db

if __name__ == "__main__":
    items = extract_items_robust(r"g:\Wuitalur\Site com os sistemas\Sistema_Padrao\html\index.html")
    with open("items_db.json", "w", encoding="utf-8") as f:
        json.dump(items, f, indent=4, ensure_ascii=False)
    print("New extraction complete.")
