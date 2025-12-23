import json

def update_items_js(json_path, js_path):
    with open(json_path, 'r', encoding='utf-8') as f:
        data = json.load(f)
        
    js_content = f"const ITEM_LIBRARY = {json.dumps(data, indent=4, ensure_ascii=False)};"
    
    with open(js_path, 'w', encoding='utf-8') as f:
        f.write(js_content)

if __name__ == "__main__":
    update_items_js(
        r"g:\Wuitalur\Site com os sistemas\items_db.json", 
        r"g:\Wuitalur\Site com os sistemas\Sistema_Padrao\script\items_db.js"
    )
