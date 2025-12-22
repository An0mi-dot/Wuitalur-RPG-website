#!/usr/bin/env python3
"""
Script para atualizar automaticamente version.json e updates.json
baseado nos commits do Git.

Uso:
    python update_version.py           # Auto-detecta tipo de mudança
    python update_version.py --patch   # Força incremento de patch
    python update_version.py --minor   # Força incremento de minor
    python update_version.py --major   # Força incremento de major
"""

import json
import subprocess
import sys
from datetime import datetime
from pathlib import Path
import re

# Configurações
VERSION_FILE = Path(__file__).parent / "version.json"
UPDATES_FILE = Path(__file__).parent / "updates.json"
MAX_UPDATES = 50  # Máximo de commits no updates.json


def run_git_command(args):
    """Executa comando git e retorna output."""
    try:
        result = subprocess.run(
            ["git"] + args,
            capture_output=True,
            text=True,
            check=True,
            cwd=Path(__file__).parent
        )
        return result.stdout.strip()
    except subprocess.CalledProcessError as e:
        print(f"Erro ao executar git: {e}")
        return None


def get_git_commits(limit=50):
    """Obtém últimos commits do Git."""
    output = run_git_command([
        "log",
        f"-{limit}",
        "--pretty=format:%ad|%s",
        "--date=format:%d-%m-%Y"
    ])
    
    if not output:
        return []
    
    commits = []
    for line in output.split('\n'):
        if '|' in line:
            date, message = line.split('|', 1)
            commits.append({"date": date, "message": sanitize_text(message)})
    
    return commits


def sanitize_text(text):
    """Remove acentos e caracteres especiais."""
    replacements = {
        'á': 'a', 'à': 'a', 'ã': 'a', 'â': 'a', 'ä': 'a',
        'é': 'e', 'è': 'e', 'ê': 'e', 'ë': 'e',
        'í': 'i', 'ì': 'i', 'î': 'i', 'ï': 'i',
        'ó': 'o', 'ò': 'o', 'õ': 'o', 'ô': 'o', 'ö': 'o',
        'ú': 'u', 'ù': 'u', 'û': 'u', 'ü': 'u',
        'ç': 'c', 'ñ': 'n',
        'Á': 'A', 'À': 'A', 'Ã': 'A', 'Â': 'A', 'Ä': 'A',
        'É': 'E', 'È': 'E', 'Ê': 'E', 'Ë': 'E',
        'Í': 'I', 'Ì': 'I', 'Î': 'I', 'Ï': 'I',
        'Ó': 'O', 'Ò': 'O', 'Õ': 'O', 'Ô': 'O', 'Ö': 'O',
        'Ú': 'U', 'Ù': 'U', 'Û': 'U', 'Ü': 'U',
        'Ç': 'C', 'Ñ': 'N'
    }
    
    for old, new in replacements.items():
        text = text.replace(old, new)
    
    return text


def detect_version_bump(commits):
    """Detecta tipo de incremento baseado em Conventional Commits."""
    for commit in commits[:10]:  # Analisa últimos 10 commits
        msg = commit['message'].lower()
        
        if 'breaking change' in msg or msg.startswith('!'):
            return 'major'
        elif msg.startswith('feat'):
            return 'minor'
        elif msg.startswith('fix') or msg.startswith('chore'):
            return 'patch'
    
    # Default: patch
    return 'patch'


def increment_version(version_data, bump_type):
    """Incrementa versão baseado no tipo."""
    major = version_data.get('major', 1)
    minor = version_data.get('minor', 0)
    patch = version_data.get('patch', 0)
    
    if bump_type == 'major':
        major += 1
        minor = 0
        patch = 0
    elif bump_type == 'minor':
        minor += 1
        patch = 0
    else:  # patch
        patch += 1
    
    return major, minor, patch


def update_version_file(bump_type='auto'):
    """Atualiza version.json."""
    # Lê versão atual
    if VERSION_FILE.exists():
        with open(VERSION_FILE, 'r', encoding='utf-8') as f:
            version_data = json.load(f)
    else:
        version_data = {
            "tag": "Alpha",
            "major": 1,
            "minor": 0,
            "patch": 0
        }
    
    # Detecta tipo de incremento
    if bump_type == 'auto':
        commits = get_git_commits(10)
        bump_type = detect_version_bump(commits)
    
    # Incrementa versão
    major, minor, patch = increment_version(version_data, bump_type)
    
    # Atualiza dados
    tag = version_data.get('tag', 'Alpha')
    today = datetime.now().strftime('%d-%m-%Y')
    
    new_version = {
        "tag": tag,
        "major": major,
        "minor": minor,
        "patch": patch,
        "display": f"{tag} {major}.{minor}.{patch}",
        "date": today
    }
    
    # Salva
    with open(VERSION_FILE, 'w', encoding='utf-8') as f:
        json.dump(new_version, f, indent=4, ensure_ascii=False)
    
    print(f"✅ Versão atualizada: {new_version['display']} ({today})")
    print(f"   Tipo de incremento: {bump_type}")
    
    return new_version


def update_updates_file():
    """Atualiza updates.json com commits recentes."""
    commits = get_git_commits(MAX_UPDATES)
    
    if not commits:
        print("⚠️  Nenhum commit encontrado no Git")
        return
    
    # Salva
    with open(UPDATES_FILE, 'w', encoding='utf-8') as f:
        json.dump(commits, f, indent=2, ensure_ascii=False)
    
    print(f"✅ Updates atualizados: {len(commits)} commits")


def main():
    """Função principal."""
    # Verifica argumentos
    bump_type = 'auto'
    if len(sys.argv) > 1:
        arg = sys.argv[1].lower()
        if arg in ['--patch', '-p']:
            bump_type = 'patch'
        elif arg in ['--minor', '-m']:
            bump_type = 'minor'
        elif arg in ['--major', '-M']:
            bump_type = 'major'
        elif arg in ['--help', '-h']:
            print(__doc__)
            return
    
    print("🔄 Atualizando sistema de versionamento...")
    print()
    
    # Atualiza arquivos
    update_version_file(bump_type)
    update_updates_file()
    
    print()
    print("✨ Concluído! Arquivos atualizados:")
    print(f"   - {VERSION_FILE}")
    print(f"   - {UPDATES_FILE}")


if __name__ == "__main__":
    main()
