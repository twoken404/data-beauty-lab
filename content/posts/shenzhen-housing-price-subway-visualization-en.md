---
title: "Visualizing the Spatial Relationship Between Housing Prices and Subway Stations in Shenzhen"
date: 2025-12-15
slug: "shenzhen-housing-price-subway-visualization-en"
categories: ["Data Analysis", "Visualization Case"]
tags: ["Python", "Data Visualization", "Geospatial Analysis", "Pandas", "Matplotlib", "Shenzhen"]
draft: false
---

# Visualizing the Spatial Relationship Between Housing Prices and Subway Stations in Shenzhen

In urban studies, accessibility to public transportation is a critical factor influencing real estate values. This project demonstrates a complete data pipeline — from web scraping to spatial visualization — to analyze the relationship between Shenzhen's metro network and surrounding residential property prices.

## Project Data Pipeline Overview

The analysis follows a structured data processing workflow:

1.  **Data Acquisition & Construction**
    *   **`1_Housing_Sell_Spyder.py`**: Scrapes Shenzhen housing transaction data, outputs `ShenzhenHousing_Price.csv`.
    *   **`2_House_Location_Spyder.py`**: Augments housing data with geographic coordinates (longitude/latitude), outputs `ShenzhenHousing_Price_WithLocation.csv`.
    *   **`3_Station_Location_Spyder.py`**: Collects Shenzhen subway station information, outputs `ShenzhenSubway_Station_WithLocation.csv`.
    *   **`4_Subway_House_Linking.py`**: The core linking script. Calculates the distance from each property to its nearest subway station, merges station details (name, line) with price data, and outputs `ShenzhenSubway_StationHousingPrice.csv`. It also generates `ShenzhenSubway_Path.csv` (line connectivity) and `ShenzhenSubway_Station_WithXY.csv` (processed station coordinates).

2.  **Core Analysis & Visualization**
    *   **`5_数据可视化_深圳地铁线路图.py`**: Synthesizes all datasets to produce a composite visualization of the metro network overlaid with housing price heatmaps.

## Key Technical Implementation

### 1. Spatial Linking Calculation

The project's core is spatially linking property points to subway stations using the **Haversine formula** for great-circle distance.

```python
import pandas as pd
import numpy as np
from math import radians, cos, sin, asin, sqrt

def haversine(lon1, lat1, lon2, lat2):
    """Calculate the great-circle distance between two points on Earth (in km)."""
    lon1, lat1, lon2, lat2 = map(radians, [lon1, lat1, lon2, lat2])
    dlon = lon2 - lon1
    dlat = lat2 - lat1
    a = sin(dlat/2)**2 + cos(lat1) * cos(lat2) * sin(dlon/2)**2
    c = 2 * asin(sqrt(a))
    r = 6371  # Earth's mean radius in kilometers
    return c * r

# Example: Find the nearest station for each property
houses = pd.read_csv('ShenzhenHousing_Price_WithLocation.csv')
stations = pd.read_csv('ShenzhenSubway_Station_WithLocation.csv')

def find_nearest_station(house_lon, house_lat):
    distances = stations.apply(
        lambda row: haversine(house_lon, house_lat, row['Longitude'], row['Latitude']),
        axis=1
    )
    min_idx = distances.idxmin()
    nearest_station = stations.loc[min_idx, 'Station_Name']
    min_distance = distances[min_idx]
    return nearest_station, min_distance

houses[['Nearest_Station', 'Distance_km']] = houses.apply(
    lambda row: find_nearest_station(row['Longitude'], row['Latitude']),
    axis=1,
    result_type='expand'
)
```

### 2. Data Visualization: Metro Network & Price Heatmap

The final visualization script integrates line, station, and price data.

```python
import matplotlib.pyplot as plt
import pandas as pd

# Load processed data
station_price = pd.read_csv('ShenzhenSubway_StationHousingPrice.csv')
subway_path = pd.read_csv('ShenzhenSubway_Path.csv')
station_xy = pd.read_csv('ShenzhenSubway_Station_WithXY.csv')

# Create figure
fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(20, 10))

# Subplot 1: Metro Lines and Stations (colored by line)
for line_name, group in subway_path.groupby('Line'):
    ax1.plot(group['X'], group['Y'], marker='o', label=line_name, linewidth=2)
ax1.set_title('Shenzhen Metro Network Map')
ax1.legend(bbox_to_anchor=(1.05, 1), loc='upper left')
ax1.grid(True, linestyle='--', alpha=0.5)

# Subplot 2: Bubble Chart of Average Housing Prices near Stations
scatter = ax2.scatter(station_price['X'],
                      station_price['Y'],
                      s=station_price['Avg_Price']/10000, # Bubble size represents avg price
                      c=station_price['Avg_Price'],
                      cmap='viridis',
                      alpha=0.7,
                      edgecolors='black')
ax2.set_title('Average Housing Price Bubble Map near Shenzhen Metro Stations')
plt.colorbar(scatter, ax=ax2, label='Average Price (CNY/sq m)')

# Annotate stations with the highest prices
for idx, row in station_price.nlargest(5, 'Avg_Price').iterrows():
    ax2.annotate(f"{row['Station_Name']}\n{int(row['Avg_Price'])}", 
                 xy=(row['X'], row['Y']),
                 xytext=(5, 5),
                 textcoords='offset points')

plt.tight_layout()
plt.savefig('Shenzhen_Metro_Housing_Price_Visualization.png', dpi=300, bbox_inches='tight')
plt.show()
```

## Analysis & Insights

The visualizations reveal several patterns:
1.  **Clear Price Gradient**: Average prices near stations in the urban core (Futian, Nanshan) are significantly higher than those in peripheral districts (Longgang, Pingshan).
2.  **Line Differential Effect**: Data suggests a price uplift effect from newly opened lines (e.g., Line 14) on their terminal areas.
3.  **Hub Premium**: Major interchange stations (e.g., Chegongmiao, Shenzhen North) generally command higher surrounding average prices compared to regular stations.

## Project Value & Future Work

This project presents an end-to-end case study in spatial data analysis, from raw data collection to final visualization. The methodology is replicable for studies in other cities. Potential extensions include:
*   Incorporating a temporal dimension to analyze price changes before and after new line openings.
*   Building a more comprehensive valuation model by integrating additional factors like school districts and commercial amenities.
*   Developing an interactive web map for more flexible data exploration.