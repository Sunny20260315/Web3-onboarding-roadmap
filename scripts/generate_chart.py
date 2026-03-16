#!/usr/bin/env python3
# 文件路径: scripts/generate_chart.py

import json
from pathlib import Path

def main():
    stats_file = Path("stats.json")
    if not stats_file.exists():
        print("❌ stats.json 不存在，先运行 calculate_progress.py")
        return
    
    with open(stats_file, 'r') as f:
        data = json.load(f)
    
    stats = data["stats"]
    
    # 生成简单的 SVG 进度图
    svg = f'''<svg width="600" height="300" xmlns="http://www.w3.org/2000/svg">
  <rect width="600" height="300" fill="#fafafa"/>
  <text x="300" y="30" text-anchor="middle" font-size="18" font-weight="bold">学习进度看板</text>
  
  {generate_bars(stats)}
  
  <text x="300" y="280" text-anchor="middle" font-size="12" fill="#666">
    更新于 {data["last_updated"][:10]} | 总体 {stats["overall"]["percentage"]}%
  </text>
</svg>'''
    
    with open("progress-chart.svg", "w") as f:
        f.write(svg)
    print("✅ progress-chart.svg 已生成")

def generate_bars(stats):
    colors = {
        "01": "#2196F3", "02": "#9C27B0", "03": "#FF9800",
        "04": "#4CAF50", "05": "#F44336", "06": "#00BCD4",
        "07": "#E91E63", "08": "#3F51B5", "09": "#795548"
    }
    
    bars = []
    y = 60
    
    for module, data in stats.items():
        if module == "overall":
            continue
        
        key = module[:2]
        name = module.replace(f"{key}-", "").replace("-", " ")
        pct = data["percentage"]
        width = pct * 4  # 最大400px
        
        # 背景
        bars.append(f'<rect x="150" y="{y}" width="400" height="18" fill="#eee" rx="9"/>')
        # 进度
        bars.append(f'<rect x="150" y="{y}" width="{width}" height="18" fill="{colors.get(key, "#4CAF50")}" rx="9"/>')
        # 文字
        bars.append(f'<text x="140" y="{y+13}" text-anchor="end" font-size="11" fill="#333">{name}</text>')
        bars.append(f'<text x="{150+width+5}" y="{y+13}" font-size="10" fill="#666">{pct}%</text>')
        
        y += 25
    
    return "\n  ".join(bars)

if __name__ == "__main__":
    main()