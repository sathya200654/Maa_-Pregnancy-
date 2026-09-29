# -*- coding: utf-8 -*-
import os
import sys

sys.stdout.reconfigure(encoding='utf-8')

index_file = r"C:\Users\abcsa\OneDrive\Desktop\MAA_Mobile_App_Updated\Users\Admin\Downloads\MAA_Mobile_App-main\MAA_Mobile_App-main\app\(tabs)\index.tsx"

with open(index_file, "r", encoding="utf-8") as f:
    code = f.read()

# Replace SVG imports to include Svg components for the circular progress arc
svg_import = """import Svg, { Circle, Defs, LinearGradient, Stop, Rect } from "react-native-svg";"""
lucide_import_old = """import { Heart, Volume2, VolumeX, CalendarDays, Sparkles, ChevronRight, Heart as HeartOutline, Bookmark } from "lucide-react-native";"""
lucide_import_new = """import { Heart, Volume2, VolumeX, CalendarDays, Sparkles, ChevronRight, Heart as HeartOutline, Bookmark, Activity, Flower2, Apple, MessageSquare, Clock, Stethoscope, Footprints } from "lucide-react-native";
import Svg, { Circle, Defs, LinearGradient, Stop, Rect } from "react-native-svg";"""

if lucide_import_old in code:
    code = code.replace(lucide_import_old, lucide_import_new)
    print("Replaced lucide imports & added Svg")
else:
    print("Could not find lucide import")

with open(index_file, "w", encoding="utf-8") as f:
    f.write(code)

print("Prepped index.tsx for redesign!")
