---
title: "我的Grok年度报告：一位视觉创作者的AI使用分析"
date: 2025-12-31
slug: "grok-annual-report-chinese-analysis"
categories: ["人工智能", "数据分析", "创意工作"]
tags: ["Grok", "AI使用分析", "年度报告", "图像生成", "数据可视化", "Python", "AI创作"]
draft: false
---

# Grok 年度使用分析报告
> 本文使用的数据分析代码已开源，仓库地址：  
> [https://github.com/twoken404/grok_and_deepseek_2025_analyze/](https://github.com/twoken404/grok_and_deepseek_2025_analyze/)
> 
*报告生成时间: 2025-12-31 21:07:50*

## 📊 总体概况

- **总对话数**: 65 次
- **总消息数**: 844 条
- **你的消息**: 415 条
- **AI回复**: 429 条
- **消息比例**: 你:415 : 429 AI

## 🎨 图像生成统计

- **图像生成次数**: 366 次
- **图像生成率**: 43.4% (占所有消息比例)
- **含图像的对话**: 58 个
- **平均提示词长度**: 495 字符

## 🤖 模型使用情况

- **grok-4**: 108 次 (12.8%)
- **grok-4-1-non-thinking-w-tool**: 514 次 (60.9%)
- **grok-4-auto**: 109 次 (12.9%)
- **grok-3**: 111 次 (13.2%)
- ****: 2 次 (0.2%)

### 模式使用
- **expert模式**: 97 次
- **grok-4-1模式**: 483 次
- **auto模式**: 198 次

## ⏰ 使用时间模式

### 时段分布
- 深夜 (0-6点):  15 (1.8%)
- 早晨 (6-9点):  4 (0.5%)
- 上午 (9-12点): ██████ 103 (12.2%)
- 中午 (12-14点): ████ 68 (8.1%)
- 下午 (14-18点): █████████ 165 (19.5%)
- 晚上 (18-22点): ██████████████████████ 383 (45.4%)
- 深夜 (22-24点): ██████ 106 (12.6%)

### 星期分布
- 周一: 187 条
- 周二: 103 条
- 周三: 78 条
- 周四: 117 条
- 周五: 90 条
- 周六: 131 条
- 周日: 138 条

## 💬 对话类型分布

- **图像生成**: 58 次 (89.2%)
- **技术讨论**: 3 次 (4.6%)
- **普通对话**: 1 次 (1.5%)
- **知识问答**: 2 次 (3.1%)
- **创意写作**: 1 次 (1.5%)

## 🔑 图像提示热门关键词

1. **warm**: 350 次
2. **cinematic**: 241 次
3. **chinese**: 191 次
4. **light**: 161 次
5. **her**: 161 次
6. **ratio**: 157 次
7. **aspect**: 155 次
8. **lighting**: 146 次
9. **style**: 143 次
10. **film**: 138 次
11. **from**: 136 次
12. **color**: 134 次
13. **shot**: 129 次
14. **soft**: 125 次
15. **woman**: 121 次
16. **man**: 119 次
17. **atmosphere**: 113 次
18. **golden**: 111 次
19. **his**: 104 次
20. **field**: 100 次

## 🏷️ 对话标题关键词

- cinematic: 25 次
- scene: 12 次
- image: 10 次
- generation: 9 次
- chinese: 9 次
- hong: 7 次
- kong: 7 次
- romance: 3 次
- tension: 3 次
- tense: 3 次

## 💡 使用总结

### 🎨 视觉创作者型
- 主要使用Grok进行图像生成
- 提示词详细，追求艺术效果
- 视觉创意表达丰富

### ⏰ 时间偏好: 晚上 (18-22点)

### 📝 基于样本数据的观察
从提供的样本看，你的使用特点包括：
- 详细的场景描述能力
- 对视觉细节的高度关注
- 喜欢设定特定情境（战时、浪漫等）
- 使用专家模式追求高质量输出

## 年度报告生成代码

```python
import json
from datetime import datetime
from collections import Counter, defaultdict
import re

class GrokDataAnalyzer:
    def __init__(self, json_file_path):
        """初始化分析器"""
        with open(json_file_path, 'r', encoding='utf-8') as f:
            self.data = json.load(f)
        
        # 提取所有对话
        self.conversations = self.data.get('conversations', [])
        
    def parse_timestamp(self, timestamp_data):
        """解析时间戳"""
        if isinstance(timestamp_data, dict) and '$date' in timestamp_data:
            # 处理MongoDB日期格式
            date_data = timestamp_data['$date']
            if isinstance(date_data, dict) and '$numberLong' in date_data:
                timestamp_ms = int(date_data['$numberLong'])
                return datetime.fromtimestamp(timestamp_ms / 1000)
            elif isinstance(date_data, str):
                return datetime.fromisoformat(date_data.replace('Z', '+00:00'))
        elif isinstance(timestamp_data, str):
            return datetime.fromisoformat(timestamp_data.replace('Z', '+00:00'))
        return None
    
    def analyze_basic_stats(self):
        """基础统计分析"""
        total_conversations = len(self.conversations)
        total_messages = 0
        human_messages = 0
        assistant_messages = 0
        image_generations = 0
        
        # 统计模型使用情况
        model_usage = Counter()
        mode_usage = Counter()
        
        # 时间相关统计
        date_stats = defaultdict(lambda: {'messages': 0, 'images': 0})
        hour_stats = defaultdict(int)
        
        for conv_data in self.conversations:
            conversation = conv_data.get('conversation', {})
            responses = conv_data.get('responses', [])
            
            # 对话创建时间
            create_time_str = conversation.get('create_time')
            if create_time_str:
                conv_date = self.parse_timestamp(create_time_str)
                if conv_date:
                    date_key = conv_date.strftime('%Y-%m-%d')
            
            for resp in responses:
                response_data = resp.get('response', {})
                total_messages += 1
                
                # 发送者统计
                sender = response_data.get('sender', '').lower()
                if 'human' in sender:
                    human_messages += 1
                elif 'assistant' in sender:
                    assistant_messages += 1
                
                # 模型统计
                model = response_data.get('model', 'unknown')
                model_usage[model] += 1
                
                # 模式统计
                metadata = response_data.get('metadata', {})
                request_meta = metadata.get('request_metadata', {})
                mode = request_meta.get('mode', 'default')
                mode_usage[mode] += 1
                
                # 图像生成统计
                if response_data.get('query_type') == 'imagine':
                    image_generations += 1
                
                # 时间分析
                create_time = self.parse_timestamp(response_data.get('create_time'))
                if create_time:
                    # 按日期统计
                    date_key = create_time.strftime('%Y-%m-%d')
                    date_stats[date_key]['messages'] += 1
                    if response_data.get('query_type') == 'imagine':
                        date_stats[date_key]['images'] += 1
                    
                    # 按小时统计
                    hour_key = create_time.hour
                    hour_stats[hour_key] += 1
        
        return {
            'total_conversations': total_conversations,
            'total_messages': total_messages,
            'human_messages': human_messages,
            'assistant_messages': assistant_messages,
            'image_generations': image_generations,
            'image_generation_rate': (image_generations / total_messages * 100) if total_messages > 0 else 0,
            'model_usage': dict(model_usage),
            'mode_usage': dict(mode_usage),
            'date_stats': dict(date_stats),
            'hour_stats': dict(hour_stats)
        }
    
    def analyze_image_generations(self):
        """分析图像生成情况"""
        image_prompts = []
        image_count_by_conv = defaultdict(int)
        
        for conv_data in self.conversations:
            conv_id = conv_data.get('conversation', {}).get('id', 'unknown')
            responses = conv_data.get('responses', [])
            
            for resp in responses:
                response_data = resp.get('response', {})
                if response_data.get('query_type') == 'imagine':
                    query = response_data.get('query', '')
                    image_prompts.append(query)
                    image_count_by_conv[conv_id] += 1
        
        # 分析提示词特征
        prompt_features = {
            'total_prompts': len(image_prompts),
            'avg_prompt_length': sum(len(p) for p in image_prompts) / len(image_prompts) if image_prompts else 0,
            'common_keywords': self.extract_keywords(image_prompts),
            'conversations_with_images': len(image_count_by_conv),
            'images_per_conversation': dict(Counter(image_count_by_conv.values()))
        }
        
        return prompt_features
    
    def extract_keywords(self, prompts, top_n=20):
        """从提示词中提取关键词"""
        all_text = ' '.join(prompts).lower()
        
        # 提取英文单词
        words = re.findall(r'\b[a-z]{3,}\b', all_text)
        
        # 过滤常见停用词
        stop_words = {'the', 'and', 'with', 'for', 'this', 'that', 'are', 'was', 'were', 'has', 'have', 'had'}
        filtered_words = [w for w in words if w not in stop_words]
        
        # 统计词频
        word_counts = Counter(filtered_words)
        
        return dict(word_counts.most_common(top_n))
    
    def analyze_time_patterns(self):
        """分析时间模式"""
        weekday_names = ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
        
        # 初始化统计
        weekday_stats = {i: 0 for i in range(7)}
        month_stats = {i: 0 for i in range(1, 13)}
        time_slot_stats = {
            '深夜 (0-6点)': 0,
            '早晨 (6-9点)': 0,
            '上午 (9-12点)': 0,
            '中午 (12-14点)': 0,
            '下午 (14-18点)': 0,
            '晚上 (18-22点)': 0,
            '深夜 (22-24点)': 0
        }
        
        for conv_data in self.conversations:
            responses = conv_data.get('responses', [])
            for resp in responses:
                response_data = resp.get('response', {})
                create_time = self.parse_timestamp(response_data.get('create_time'))
                
                if create_time:
                    # 星期统计
                    weekday = create_time.weekday()  # 0=周一, 6=周日
                    weekday_stats[weekday] += 1
                    
                    # 月份统计
                    month = create_time.month
                    month_stats[month] += 1
                    
                    # 时段统计
                    hour = create_time.hour
                    if 0 <= hour < 6:
                        time_slot_stats['深夜 (0-6点)'] += 1
                    elif 6 <= hour < 9:
                        time_slot_stats['早晨 (6-9点)'] += 1
                    elif 9 <= hour < 12:
                        time_slot_stats['上午 (9-12点)'] += 1
                    elif 12 <= hour < 14:
                        time_slot_stats['中午 (12-14点)'] += 1
                    elif 14 <= hour < 18:
                        time_slot_stats['下午 (14-18点)'] += 1
                    elif 18 <= hour < 22:
                        time_slot_stats['晚上 (18-22点)'] += 1
                    else:
                        time_slot_stats['深夜 (22-24点)'] += 1
        
        # 转换星期为中文
        weekday_stats_named = {weekday_names[i]: weekday_stats[i] for i in range(7)}
        
        return {
            'weekday_stats': weekday_stats_named,
            'month_stats': month_stats,
            'time_slot_stats': time_slot_stats
        }
    
    def analyze_conversation_content(self):
        """分析对话内容特征"""
        conversation_types = Counter()
        title_keywords = []
        
        for conv_data in self.conversations:
            conversation = conv_data.get('conversation', {})
            responses = conv_data.get('responses', [])
            
            title = conversation.get('title', '').lower()
            title_keywords.append(title)
            
            # 判断对话类型
            has_images = any(
                resp.get('response', {}).get('query_type') == 'imagine'
                for resp in responses
            )
            
            if has_images:
                conversation_types['图像生成'] += 1
            else:
                # 检查是否有特定关键词
                all_text = ' '.join([
                    resp.get('response', {}).get('message', '').lower() 
                    for resp in responses
                ])
                
                if any(keyword in all_text for keyword in ['代码', '编程', 'python']):
                    conversation_types['技术讨论'] += 1
                elif any(keyword in all_text for keyword in ['解释', '什么', '为什么', '如何']):
                    conversation_types['知识问答'] += 1
                elif any(keyword in all_text for keyword in ['创作', '故事', '诗歌']):
                    conversation_types['创意写作'] += 1
                else:
                    conversation_types['普通对话'] += 1
        
        # 提取标题关键词
        all_titles = ' '.join(title_keywords)
        title_words = re.findall(r'\b[a-z]{3,}\b', all_titles.lower())
        title_word_counts = Counter(title_words)
        
        return {
            'conversation_types': dict(conversation_types),
            'common_title_words': dict(title_word_counts.most_common(10))
        }
    
    def generate_report(self, output_file='grok_年度分析报告.md'):
        """生成分析报告"""
        basic_stats = self.analyze_basic_stats()
        image_analysis = self.analyze_image_generations()
        time_patterns = self.analyze_time_patterns()
        content_analysis = self.analyze_conversation_content()
        
        with open(output_file, 'w', encoding='utf-8') as f:
            # 标题
            f.write("# Grok 年度使用分析报告\n\n")
            f.write(f"*报告生成时间: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}*\n\n")
            
            # 1. 总体概况
            f.write("## 📊 总体概况\n\n")
            f.write(f"- **总对话数**: {basic_stats['total_conversations']} 次\n")
            f.write(f"- **总消息数**: {basic_stats['total_messages']} 条\n")
            f.write(f"- **你的消息**: {basic_stats['human_messages']} 条\n")
            f.write(f"- **AI回复**: {basic_stats['assistant_messages']} 条\n")
            f.write(f"- **消息比例**: 你:{basic_stats['human_messages']} : {basic_stats['assistant_messages']} AI\n\n")
            
            # 2. 图像生成统计
            f.write("## 🎨 图像生成统计\n\n")
            f.write(f"- **图像生成次数**: {basic_stats['image_generations']} 次\n")
            f.write(f"- **图像生成率**: {basic_stats['image_generation_rate']:.1f}% (占所有消息比例)\n")
            f.write(f"- **含图像的对话**: {image_analysis['conversations_with_images']} 个\n")
            f.write(f"- **平均提示词长度**: {image_analysis['avg_prompt_length']:.0f} 字符\n\n")
            
            # 3. 模型使用情况
            f.write("## 🤖 模型使用情况\n\n")
            for model, count in basic_stats['model_usage'].items():
                f.write(f"- **{model}**: {count} 次 ({count/basic_stats['total_messages']*100:.1f}%)\n")
            
            if basic_stats['mode_usage']:
                f.write("\n### 模式使用\n")
                for mode, count in basic_stats['mode_usage'].items():
                    if mode != 'default':
                        f.write(f"- **{mode}模式**: {count} 次\n")
            
            # 4. 时间模式分析
            f.write("\n## ⏰ 使用时间模式\n\n")
            
            # 时段分布
            f.write("### 时段分布\n")
            total_msgs = sum(time_patterns['time_slot_stats'].values())
            for slot, count in time_patterns['time_slot_stats'].items():
                if count > 0:
                    percentage = count / total_msgs * 100
                    bar = "█" * int(percentage / 2)
                    f.write(f"- {slot}: {bar} {count} ({percentage:.1f}%)\n")
            
            # 星期分布
            f.write("\n### 星期分布\n")
            for day, count in time_patterns['weekday_stats'].items():
                f.write(f"- {day}: {count} 条\n")
            
            # 5. 对话类型分析
            f.write("\n## 💬 对话类型分布\n\n")
            total_conv = sum(content_analysis['conversation_types'].values())
            for conv_type, count in content_analysis['conversation_types'].items():
                percentage = count / total_conv * 100 if total_conv > 0 else 0
                f.write(f"- **{conv_type}**: {count} 次 ({percentage:.1f}%)\n")
            
            # 6. 热门关键词
            if image_analysis['common_keywords']:
                f.write("\n## 🔑 图像提示热门关键词\n\n")
                for i, (keyword, count) in enumerate(image_analysis['common_keywords'].items(), 1):
                    f.write(f"{i}. **{keyword}**: {count} 次\n")
            
            # 7. 标题关键词
            if content_analysis['common_title_words']:
                f.write("\n## 🏷️ 对话标题关键词\n\n")
                for word, count in content_analysis['common_title_words'].items():
                    f.write(f"- {word}: {count} 次\n")
            
            # 8. 使用总结
            f.write("\n## 💡 使用总结\n\n")
            
            # 判断主要用途
            image_ratio = basic_stats['image_generation_rate']
            if image_ratio > 30:
                f.write("### 🎨 视觉创作者型\n")
                f.write("- 主要使用Grok进行图像生成\n")
                f.write("- 提示词详细，追求艺术效果\n")
                f.write("- 视觉创意表达丰富\n")
            elif '图像生成' in content_analysis['conversation_types']:
                f.write("### 🎭 混合使用型\n")
                f.write("- 兼顾图像生成与文本对话\n")
                f.write("- 既有创意表达，也有实用查询\n")
                f.write("- 使用场景多样化\n")
            else:
                f.write("### 💬 文本对话型\n")
                f.write("- 主要进行文本交流\n")
                f.write("- 关注知识获取与问题解决\n")
                f.write("- 对话内容丰富\n")
            
            # 时间模式判断
            top_time_slot = max(time_patterns['time_slot_stats'].items(), key=lambda x: x[1])[0]
            f.write(f"\n### ⏰ 时间偏好: {top_time_slot}\n")
            
            # 根据你的样本数据推测
            f.write("\n### 📝 基于样本数据的观察\n")
            f.write("从提供的样本看，你的使用特点包括：\n")
            f.write("- 详细的场景描述能力\n")
            f.write("- 对视觉细节的高度关注\n")
            f.write("- 喜欢设定特定情境（战时、浪漫等）\n")
            f.write("- 使用专家模式追求高质量输出\n")
        
        print(f"报告已生成: {output_file}")
        return output_file

# 主程序
if __name__ == "__main__":
    try:
        print("正在分析Grok使用数据...")
        analyzer = GrokDataAnalyzer('prod-grok-backend.json')  # 请将文件名替换为实际文件名
        
        # 生成报告
        report_file = analyzer.generate_report()
        
        print(f"\n✅ 分析完成！")
        print(f"📄 报告文件: {report_file}")
        
        # 显示简要统计
        stats = analyzer.analyze_basic_stats()
        print(f"\n📊 简要统计:")
        print(f"   对话总数: {stats['total_conversations']}")
        print(f"   消息总数: {stats['total_messages']}")
        print(f"   图像生成: {stats['image_generations']} 次")
        print(f"   最常用模型: {max(stats['model_usage'].items(), key=lambda x: x[1])[0]}")
        
    except FileNotFoundError:
        print("❌ 错误: 找不到数据文件")
        print("请确保 'grok_data.json' 文件在当前目录下")
    except json.JSONDecodeError:
        print("❌ 错误: 数据文件格式不正确")
    except Exception as e:
        print(f"❌ 分析过程中出现错误: {e}")
        import traceback
        traceback.print_exc()
```