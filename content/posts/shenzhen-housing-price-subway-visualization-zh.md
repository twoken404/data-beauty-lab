---
title: "深圳房价与地铁站的空间关系可视化分析"
date: 2025-12-15
slug: "shenzhen-housing-price-subway-visualization-zh"
categories: ["数据分析", "可视化案例"]
tags: ["Python", "数据可视化", "地理空间分析", "Pandas", "Matplotlib", "深圳"]
draft: false
---

# 深圳房价与地铁站的空间关系可视化分析

在快节奏的城市生活中，交通便利性是影响房产价值的关键因素之一。本项目旨在通过数据爬取、处理与可视化，探索深圳地铁网络与周边房价的空间关系，揭示公共交通可达性对住宅价格的影响模式。

## 项目数据流程概览

整个分析项目遵循以下数据处理流程：

1.  **数据采集与构建**
    *   **`1_Housing_Sell_Spyder.py`**: 爬取深圳房产交易数据，生成`ShenzhenHousing_Price.csv`。
    *   **`2_House_Location_Spyder.py`**: 为房产数据补充地理坐标（经纬度），生成`ShenzhenHousing_Price_WithLocation.csv`。
    *   **`3_Station_Location_Spyder.py`**: 爬取深圳地铁站点信息，生成`ShenzhenSubway_Station_WithLocation.csv`。
    *   **`4_Subway_House_Linking.py`**: 核心关联脚本。计算每个房产到最近地铁站的距离，并将站点信息（如站名、线路）与房产价格合并，最终生成`ShenzhenSubway_StationHousingPrice.csv`。同时，还生成了描述地铁线路连接关系的`ShenzhenSubway_Path.csv`和处理后的站点坐标`ShenzhenSubway_Station_WithXY.csv`。

2.  **核心分析与可视化**
    *   **`5_数据可视化_深圳地铁线路图.py`**: 综合以上所有数据，生成深圳地铁网络与房价热力叠加图。

## 核心技术实现

### 1. 空间关联计算

项目核心在于将房产点与地铁站点进行空间关联。我们使用**Haversine公式**计算球面两点间距离。

```python
import pandas as pd
import numpy as np
from math import radians, cos, sin, asin, sqrt

def haversine(lon1, lat1, lon2, lat2):
    """计算两个经纬度坐标之间的球面距离（公里）"""
    lon1, lat1, lon2, lat2 = map(radians, [lon1, lat1, lon2, lat2])
    dlon = lon2 - lon1
    dlat = lat2 - lat1
    a = sin(dlat/2)**2 + cos(lat1) * cos(lat2) * sin(dlon/2)**2
    c = 2 * asin(sqrt(a))
    r = 6371  # 地球平均半径，单位为公里
    return c * r

# 示例：为每个房子找到最近的地铁站及距离
houses = pd.read_csv('ShenzhenHousing_Price_WithLocation.csv')
stations = pd.read_csv('ShenzhenSubway_Station_WithLocation.csv')

def find_nearest_station(house_lon, house_lat):
    distances = stations.apply(
        lambda row: haversine(house_lon, house_lat, row['经度'], row['纬度']),
        axis=1
    )
    min_idx = distances.idxmin()
    nearest_station = stations.loc[min_idx, '站名']
    min_distance = distances[min_idx]
    return nearest_station, min_distance

houses[['最近地铁站', '距离_公里']] = houses.apply(
    lambda row: find_nearest_station(row['经度'], row['纬度']),
    axis=1,
    result_type='expand'
)
```

### 2. 数据可视化：地铁网络与房价热图

最终的可视化脚本整合了线路、站点、房价三方面信息。

```python
import matplotlib.pyplot as plt
import pandas as pd

# 加载数据
station_price = pd.read_csv('ShenzhenSubway_StationHousingPrice.csv')
subway_path = pd.read_csv('ShenzhenSubway_Path.csv')
station_xy = pd.read_csv('ShenzhenSubway_Station_WithXY.csv')

# 创建画布
fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(20, 10))

# 子图1：地铁线路与站点（按线路颜色区分）
for line_name, group in subway_path.groupby('线路'):
    ax1.plot(group['X坐标'], group['Y坐标'], marker='o', label=line_name, linewidth=2)
ax1.set_title('深圳地铁线路网络图')
ax1.legend(bbox_to_anchor=(1.05, 1), loc='upper left')
ax1.grid(True, linestyle='--', alpha=0.5)

# 子图2：站点周边房价气泡图
scatter = ax2.scatter(station_price['X坐标'],
                      station_price['Y坐标'],
                      s=station_price['平均房价']/10000, # 气泡大小代表均价
                      c=station_price['平均房价'],
                      cmap='viridis',
                      alpha=0.7,
                      edgecolors='black')
ax2.set_title('深圳地铁站点周边平均房价气泡图')
plt.colorbar(scatter, ax=ax2, label='平均房价 (元/平方米)')

# 为高房价站点添加标注
for idx, row in station_price.nlargest(5, '平均房价').iterrows():
    ax2.annotate(f"{row['站名']}\n{int(row['平均房价'])}", 
                 xy=(row['X坐标'], row['Y坐标']),
                 xytext=(5, 5),
                 textcoords='offset points')

plt.tight_layout()
plt.savefig('深圳地铁与房价关系图.png', dpi=300, bbox_inches='tight')
plt.show()
```

## 分析与洞察

通过可视化结果，我们可以得出一些初步结论：
1.  **价格梯度明显**：城市核心区（如福田、南山）地铁站周边房价显著高于外围区域（如龙岗、坪山）。
2.  **线路效应差异**：新开通的线路（如地铁14号线）对远端区域房价的拉动作用在数据中有所体现。
3.  **枢纽溢价**：大型换乘站（如车公庙、深圳北站）周边的平均房价普遍高于普通站点。

## 项目意义与扩展

本项目提供了一个从原始数据爬取到最终空间可视化的完整数据分析案例。方法论可复用于其他城市的研究。可能的扩展方向包括：
*   引入时间维度，分析地铁新线开通前后的房价变化。
*   结合更多影响因子，如学区、商业配套，建立更全面的估价模型。
*   开发交互式Web地图，提供更灵活的探索体验。

---
