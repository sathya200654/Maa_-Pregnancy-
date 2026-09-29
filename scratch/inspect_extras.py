import sys
import json
sys.path.append('.')
from scratch.te_base import te_base

with open(r"scratch\en_keys.json", "r", encoding="utf-8") as f:
    en_keys = json.load(f)

extras = [k for k in te_base if k not in en_keys]
print(f"Total extras in te_base: {len(extras)}")
for k in extras:
    print(f"  {k}: {te_base[k]}")
