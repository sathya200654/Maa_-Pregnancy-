# -*- coding: utf-8 -*-
import sys

sys.stdout.reconfigure(encoding='utf-8')

file_path = r"C:\Users\abcsa\OneDrive\Desktop\MAA_Mobile_App_Updated\Users\Admin\Downloads\MAA_Mobile_App-main\MAA_Mobile_App-main\app\(tabs)\chat.tsx"

with open(file_path, "r", encoding="utf-8") as f:
    code = f.read()

# 1. Update POPULAR_CATEGORY_SHORTLIST to match requested categories
old_categories = '''const POPULAR_CATEGORY_SHORTLIST = [
  "All",
  "General Pregnancy",
  "Food & Nutrition",
  "Baby Development",
  "Fruits",
  "Vegetables",
  "Indian Foods",
  "Supplements",
  "Vitamins",
  "Water & Hydration",
  "Morning Sickness & Nausea",
  "Symptoms",
  "Scans & Tests",
  "Labor & Delivery",
];'''

new_categories = '''const POPULAR_CATEGORY_SHORTLIST = [
  "All",
  "Health",
  "Symptoms",
  "Food",
  "Yoga",
  "Baby",
  "Nutrition",
  "Mental Wellness",
  "Medicines",
  "General Pregnancy",
  "Scans & Tests",
  "Labor & Delivery",
];'''

if old_categories in code:
    code = code.replace(old_categories, new_categories)
    print("Replaced POPULAR_CATEGORY_SHORTLIST")
else:
    print("Could not find POPULAR_CATEGORY_SHORTLIST")

# 2. Add Svg import if not present
if 'import Svg, {' not in code:
    code = code.replace(
        'import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";',
        'import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";\nimport Svg, { Defs, LinearGradient, Stop, Rect } from "react-native-svg";'
    )
    print("Added Svg imports")

# 3. Update header layout to include the soft Baby Pink -> Baby Blue gradient
old_header_start = '''      {/* Top Header Bar */}
      <View style={styles.header}>
        <View style={styles.headerRow}>'''

new_header_start = '''      {/* Top Header Bar with Soft Baby Pink -> Baby Blue Gradient */}
      <View style={styles.header}>
        <Svg height="100%" width="100%" style={StyleSheet.absoluteFillObject}>
          <Defs>
            <LinearGradient id="chatHeaderGrad" x1="0" y1="0" x2="1" y2="1">
              <Stop offset="0%" stopColor="#FDE7EF" stopOpacity={0.95} />
              <Stop offset="60%" stopColor="#FFFFFF" stopOpacity={0.9} />
              <Stop offset="100%" stopColor="#E6F4FC" stopOpacity={0.95} />
            </LinearGradient>
          </Defs>
          <Rect width="100%" height="100%" rx={26} ry={26} fill="url(#chatHeaderGrad)" />
        </Svg>
        <View style={styles.headerRow}>'''

if old_header_start in code:
    code = code.replace(old_header_start, new_header_start)
    print("Updated header with Svg gradient")
else:
    print("Could not find old_header_start")

# 4. Update alternating pink and blue category chips
old_cat_chip = '''              return (
                <TouchableOpacity
                  key={cat}
                  style={[styles.categoryChip, isSelected && styles.categoryChipActive]}
                  onPress={() => {
                    setSelectedCategory(cat);
                    if (searchQuery) setSearchQuery("");
                  }}
                  activeOpacity={0.75}
                >
                  <Text
                    style={[
                      styles.categoryChipText,
                      isSelected && styles.categoryChipTextActive,
                    ]}
                  >
                    {getLocalizedCategory(cat, selectedLanguage)}
                  </Text>
                </TouchableOpacity>
              );'''

new_cat_chip = '''              const isEven = idx % 2 === 0;
              return (
                <TouchableOpacity
                  key={cat}
                  style={[
                    styles.categoryChip,
                    isEven ? styles.categoryChipPink : styles.categoryChipBlue,
                    isSelected && styles.categoryChipActive,
                  ]}
                  onPress={() => {
                    setSelectedCategory(cat);
                    if (searchQuery) setSearchQuery("");
                  }}
                  activeOpacity={0.75}
                >
                  <Text
                    style={[
                      styles.categoryChipText,
                      isSelected && styles.categoryChipTextActive,
                    ]}
                  >
                    {getLocalizedCategory(cat, selectedLanguage)}
                  </Text>
                </TouchableOpacity>
              );'''

if 'displayCategories.map((cat) => {' in code:
    code = code.replace('displayCategories.map((cat) => {', 'displayCategories.map((cat, idx) => {')
    code = code.replace(old_cat_chip, new_cat_chip)
    print("Updated category chips with alternating pink & blue")

# 5. Update userBubbleText, userBubble, and styles
styles_replacements = [
    ('backgroundColor: colors.brand,\n    borderRadius: 18,', 'backgroundColor: "#FDE7EF",\n    borderRadius: 20,\n    borderWidth: 1,\n    borderColor: "#F8C8D8",'),
    ('userBubbleText: {\n    fontSize: 14,\n    fontWeight: "700",\n    color: colors.white,', 'userBubbleText: {\n    fontSize: 14,\n    fontWeight: "700",\n    color: "#30343B",'),
    ('userTimeText: {\n    fontSize: 10,\n    fontWeight: "600",\n    color: "rgba(255, 255, 255, 0.75)",', 'userTimeText: {\n    fontSize: 10,\n    fontWeight: "600",\n    color: "#6F7480",'),
    ('assistantText: {\n    fontSize: 14,\n    fontWeight: "500",\n    color: "#2C3550",', 'assistantText: {\n    fontSize: 14,\n    fontWeight: "500",\n    color: "#30343B",'),
]

for old_s, new_s in styles_replacements:
    if old_s in code:
        code = code.replace(old_s, new_s)
        print(f"Replaced style: {old_s[:25]}...")
    else:
        print(f"Could not find style: {old_s[:25]}...")

# 6. Add category chip pink/blue styles if not in code
extra_styles = '''  categoryChipPink: {
    backgroundColor: "#FDE7EF",
    borderColor: "#F8C8D8",
  },
  categoryChipBlue: {
    backgroundColor: "#E6F4FC",
    borderColor: "#BFDFF5",
  },
'''

if 'categoryChipPink' not in code:
    code = code.replace('  categoryChip: {', extra_styles + '  categoryChip: {')
    print("Added categoryChipPink and Blue styles")

with open(file_path, "w", encoding="utf-8") as f:
    f.write(code)

print("Updated chat.tsx successfully!")
