# -*- coding: utf-8 -*-
import os
import sys
from PIL import Image, ImageDraw

sys.stdout.reconfigure(encoding='utf-8')

src_image_path = r"C:\Users\abcsa\.gemini\antigravity-ide\brain\dd49c3e1-5d8e-4289-a42a-92b2dafd23e8\.user_uploaded\media_1789656362645.png"
project_root = r"C:\Users\abcsa\OneDrive\Desktop\MAA_Mobile_App_Updated\Users\Admin\Downloads\MAA_Mobile_App-main\MAA_Mobile_App-main"

print(f"Loading source icon: {src_image_path}")
base_img = Image.open(src_image_path).convert("RGBA")

# 1. Update Expo assets
assets_dir = os.path.join(project_root, "assets")
os.makedirs(assets_dir, exist_ok=True)

# icon.png (1024x1024)
icon_path = os.path.join(assets_dir, "icon.png")
base_img.resize((1024, 1024), Image.Resampling.LANCZOS).save(icon_path, "PNG")
print(f"Saved: {icon_path}")

# adaptive-icon.png (1024x1024)
# In adaptive icons, center the art within safe area (approx 724x724 on 1024x1024 canvas)
adaptive_img = Image.new("RGBA", (1024, 1024), (251, 251, 254, 255))
scaled_art = base_img.resize((860, 860), Image.Resampling.LANCZOS)
paste_pos = ((1024 - 860) // 2, (1024 - 860) // 2)
adaptive_img.paste(scaled_art, paste_pos, scaled_art)
adaptive_path = os.path.join(assets_dir, "adaptive-icon.png")
adaptive_img.save(adaptive_path, "PNG")
print(f"Saved: {adaptive_path}")

# favicon.png (48x48)
favicon_path = os.path.join(assets_dir, "favicon.png")
base_img.resize((48, 48), Image.Resampling.LANCZOS).save(favicon_path, "PNG")
print(f"Saved: {favicon_path}")

# 2. Update Android mipmap directories
res_dir = os.path.join(project_root, "android", "app", "src", "main", "res")

densities = {
    "mipmap-mdpi": {"launcher": 48, "foreground": 108},
    "mipmap-hdpi": {"launcher": 72, "foreground": 162},
    "mipmap-xhdpi": {"launcher": 96, "foreground": 216},
    "mipmap-xxhdpi": {"launcher": 144, "foreground": 324},
    "mipmap-xxxhdpi": {"launcher": 192, "foreground": 432},
}

def create_circular_icon(image, size):
    img = image.resize((size, size), Image.Resampling.LANCZOS)
    mask = Image.new("L", (size, size), 0)
    draw = ImageDraw.Draw(mask)
    draw.ellipse((0, 0, size, size), fill=255)
    result = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    result.paste(img, (0, 0), mask=mask)
    return result

def create_foreground_icon(image, size):
    # Foreground on a transparent canvas, scaled to 78% of size to fit safe zone
    fg = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    inner_size = int(size * 0.80)
    scaled = image.resize((inner_size, inner_size), Image.Resampling.LANCZOS)
    offset = (size - inner_size) // 2
    fg.paste(scaled, (offset, offset), mask=scaled)
    return fg

for folder, sizes in densities.items():
    target_folder = os.path.join(res_dir, folder)
    if not os.path.exists(target_folder):
        continue

    # ic_launcher.webp
    launcher_size = sizes["launcher"]
    launcher_img = base_img.resize((launcher_size, launcher_size), Image.Resampling.LANCZOS)
    launcher_path = os.path.join(target_folder, "ic_launcher.webp")
    launcher_img.save(launcher_path, "WEBP")

    # ic_launcher_round.webp
    round_img = create_circular_icon(base_img, launcher_size)
    round_path = os.path.join(target_folder, "ic_launcher_round.webp")
    round_img.save(round_path, "WEBP")

    # ic_launcher_foreground.webp
    fg_size = sizes["foreground"]
    fg_img = create_foreground_icon(base_img, fg_size)
    fg_path = os.path.join(target_folder, "ic_launcher_foreground.webp")
    fg_img.save(fg_path, "WEBP")

    print(f"Generated Android icons for {folder}: {launcher_size}px, fg: {fg_size}px")

print("\nApp icons updated successfully across all Expo and Android densities!")
