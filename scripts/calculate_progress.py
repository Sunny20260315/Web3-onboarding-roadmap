#!/usr/bin/env python3
# 文件路径: scripts/calculate_progress.py

import os
import json
import re
from pathlib import Path
from datetime import datetime

class ProgressCalculator:
    def __init__(self, root_dir="."):
        self.root = Path(root_dir)
        self.stats = {}
    
    def scan_module(self, module_path):
        """扫描单个模块"""
        if not module_path.exists():
            return {"score": 0, "percentage": 0, "grade": "⚪ 待开始"}
        
        score = 0
        details = {}
        
        # 检查 README
        readme = module_path / "README.md"
        if readme.exists():
            score += 10
            content = readme.read_text(encoding='utf-8')
            lines = len(content.split('\n'))
            details["lines"] = lines
            if lines > 50:
                score += 10
        
        # 检查实战项目目录（支持多种命名）
        project_names = ["💼 实战项目", "projects", "实战项目", "examples"]
        for name in project_names:
            if (module_path / name).exists():
                score += 30
                details["has_projects"] = True
                break
        
        # 检查代码文件
        code_exts = ['*.sol', '*.js', '*.ts', '*.jsx', '*.tsx']
        code_count = 0
        for ext in code_exts:
            code_count += len(list(module_path.rglob(ext)))
        if code_count > 0:
            score += 20
            details["code_files"] = code_count
        
        # 检查最近更新
        try:
            latest = max(
                (f.stat().st_mtime for f in module_path.rglob("*") if f.is_file()),
                default=0
            )
            days_ago = (datetime.now().timestamp() - latest) / 86400
            if days_ago <= 90:
                score += 15
                details["recent"] = True
        except:
            pass
        
        # Git 贡献统计
        try:
            import subprocess
            result = subprocess.run(
                ["git", "log", "--oneline", "--", str(module_path)],
                capture_output=True, text=True, cwd=self.root
            )
            commits = len([l for l in result.stdout.split('\n') if l.strip()])
            if commits > 0:
                score += 15
                details["commits"] = commits
        except:
            pass
        
        percentage = min(score, 100)
        
        # 评级
        if percentage >= 80: grade = "🟢 完善"
        elif percentage >= 60: grade = "🟡 良好"
        elif percentage >= 40: grade = "🟠 进行中"
        elif percentage >= 20: grade = "🔴 起步"
        else: grade = "⚪ 待开始"
        
        return {
            "score": score,
            "percentage": percentage,
            "grade": grade,
            "details": details
        }
    
    def calculate_all(self):
        """计算所有模块"""
        modules = [
            "01-Web2-Foundation",
            "02-Blockchain-Core",
            "03-Smart-Contract",
            "04-Web3-Frontend",
            "05-Fullstack-DApp",
            "06-DeFi-Protocol",
            "07-NFT-Metaverse",
            "08-DAO-Governance",
            "09-Advanced-Topics"
        ]
        
        total = 0
        completed = 0
        
        for module in modules:
            path = self.root / module
            self.stats[module] = self.scan_module(path)
            total += self.stats[module]["percentage"]
            if self.stats[module]["percentage"] >= 70:
                completed += 1
        
        self.stats["overall"] = {
            "percentage": round(total / len(modules)),
            "modules_completed": completed,
            "total_modules": len(modules)
        }
        
        return self.stats
    
    def generate_table(self):
        """生成 Markdown 表格"""
        names = {
            "01-Web2-Foundation": "Web2 基础巩固",
            "02-Blockchain-Core": "区块链核心原理",
            "03-Smart-Contract": "智能合约开发",
            "04-Web3-Frontend": "Web3 前端集成",
            "05-Fullstack-DApp": "全栈 DApp 实战",
            "06-DeFi-Protocol": "DeFi 协议深度",
            "07-NFT-Metaverse": "NFT 与元宇宙",
            "08-DAO-Governance": "DAO 与治理",
            "09-Advanced-Topics": "前沿技术探索"
        }
        
        lines = [
            "| 阶段 | 主题 | 进度 | 完成度 | 状态 |",
            "|:---:|:---|:---:|:---:|:---:|"
        ]
        
        for i, (module, data) in enumerate(self.stats.items(), 1):
            if module == "overall":
                continue
            
            name = names.get(module, module)
            pct = data["percentage"]
            
            # 生成进度条
            filled = int(pct / 5)  # 20个字符宽度
            bar = "█" * filled + "░" * (20 - filled)
            
            lines.append(f"| {i:02d} | {name} | `{bar}` | {pct}% | {data['grade']} |")
        
        # 总体行
        ov = self.stats["overall"]
        bar = "█" * int(ov["percentage"]/5) + "░" * (20 - int(ov["percentage"]/5))
        lines.append(f"| - | **总体进度** | `{bar}` | **{ov['percentage']}%** | **{ov['modules_completed']}/{ov['total_modules']}** |")
        
        return "\n".join(lines)
    
    def update_readme(self):
        """更新 README.md"""
        readme = self.root / "README.md"
        if not readme.exists():
            print("❌ README.md 不存在")
            return False
        
        content = readme.read_text(encoding='utf-8')
        new_table = self.generate_table()
        
        # 查找并替换旧表格
        pattern = r'(## 📊 学习进度总览\n\n)[\s\S]*?(\n## |$)'
        replacement = r'\1' + new_table + r'\2'
        
        new_content = re.sub(pattern, replacement, content)
        
        if new_content == content:
            # 如果没有匹配到，尝试在文件开头插入
            print("⚠️ 未找到现有表格，尝试插入新表格")
            new_content = content.replace(
                "# 🚀 Web2 to Web3 Fullstack Guide",
                "# 🚀 Web2 to Web3 Fullstack Guide\n\n## 📊 学习进度总览\n\n" + new_table
            )
        
        readme.write_text(new_content, encoding='utf-8')
        print("✅ README.md 已更新")
        return True
    
    def save_json(self):
        """保存 JSON 统计"""
        with open(self.root / "stats.json", "w", encoding='utf-8') as f:
            json.dump({
                "last_updated": datetime.now().isoformat(),
                "stats": self.stats
            }, f, ensure_ascii=False, indent=2)
        print("✅ stats.json 已保存")

def main():
    calc = ProgressCalculator()
    print("🔍 扫描知识库模块...")
    calc.calculate_all()
    
    print("📝 更新文档...")
    calc.update_readme()
    calc.save_json()
    
    # 打印摘要
    print("\n📈 进度摘要:")
    for m, d in calc.stats.items():
        if m != "overall":
            print(f"  {m}: {d['percentage']}% {d['grade']}")
    print(f"\n🎯 总体: {calc.stats['overall']['percentage']}%")

if __name__ == "__main__":
    main()