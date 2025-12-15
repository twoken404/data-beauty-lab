---
title: "Map Visualization Project - File Structure Analysis and Comprehensive Guide"
date: 2025-12-15
slug: "map-visualization-project-files-analysis-en"
categories: ["Python Visualization", "Geospatial", "Project Practice"]
tags: ["file analysis", "map data", "shapefile", "CSV", "visualization project"]
draft: false
---

# Map Visualization Project File Structure and Integrated Application

In real-world map visualization projects, we encounter various data formats and file types. This article analyzes different file types in a typical map visualization project and provides corresponding Python processing code examples.

## 1. Project File Structure Overview

Based on the provided filenames, this is a comprehensive map visualization project containing the following file types:

### 1.1 Data Files
- **CSV format**: `China_HexMap.csv`, `ina_MatrixMap.csv`, `rtual_City.csv`, `rtual_Connect.csv`, `rtual_huouse.csv`
- **Excel format**: `rtual_Connect.xlsx`
- **Shapefile format**: `rtual_Map0.*`, `rtual_Map1.*`

### 1.2 Python Script Files
- **Base maps**: `世界地图.py`
- **basemap applications**: `拟地图的绘制_basemap.py`
- **geoplot applications**: `拟地图的绘制_geoplot.py`
- **plotnine applications**: `拟地图的绘制_plotnine.py`
- **Thematic maps**: `级统计地图.py` and 10+ other scripts

### 1.3 Output Documents
- **PDF reports**: `维柱形地图(a)单色渐变系.pdf` etc.

## 2. Python Processing Methods for Various Data Files

### 2.1 CSV Data File Processing

```python
import pandas as pd
import geopandas as gpd

# Read CSV data
def read_map_csv_files():
    """Read all CSV-format map data in the project"""
    
    # 1. China hexagonal grid data
    china_hex = pd.read_csv('China_HexMap.csv', encoding='utf-8')
    print(f"China_HexMap shape: {china_hex.shape}")
    print(f"Columns: {china_hex.columns.tolist()[:5]}...")  # Show first 5 columns
    
    # 2. Adjacency matrix data
    matrix_map = pd.read_csv('ina_MatrixMap.csv', encoding='utf-8')
    
    # 3. Virtual city data
    virtual_city = pd.read_csv('rtual_City.csv', encoding='utf-8')
    
    # 4. Connection relationship data
    virtual_connect = pd.read_csv('rtual_Connect.csv', encoding='utf-8')
    
    # 5. House data
    virtual_house = pd.read_csv('rtual_huouse.csv', encoding='utf-8')
    
    return {
        'china_hex': china_hex,
        'matrix_map': matrix_map,
        'virtual_city': virtual_city,
        'virtual_connect': virtual_connect,
        'virtual_house': virtual_house
    }

# Execute reading
map_data = read_map_csv_files()
```

### 2.2 Shapefile Processing

```python
def process_shapefiles():
    """Process shapefile format geographic data"""
    
    # Read two shapefiles
    map0 = gpd.read_file('rtual_Map0.shp')
    map1 = gpd.read_file('rtual_Map1.shp')
    
    print(f"Map0 CRS: {map0.crs}")
    print(f"Map1 CRS: {map1.crs}")
    print(f"Map0 geometry types: {map0.geometry.type.unique()}")
    print(f"Map1 geometry types: {map1.geometry.type.unique()}")
    
    # Check and unify coordinate systems
    if map0.crs != map1.crs:
        map1 = map1.to_crs(map0.crs)
        print("Coordinate systems unified")
    
    # Merge data (if needed)
    combined_map = gpd.GeoDataFrame(
        pd.concat([map0, map1], ignore_index=True),
        crs=map0.crs
    )
    
    return map0, map1, combined_map

# Process shapefiles
map0, map1, combined = process_shapefiles()
```

### 2.3 Excel File Processing

```python
def process_excel_data():
    """Process Excel format connection data"""
    
    # Read Excel file
    excel_connect = pd.read_excel('rtual_Connect.xlsx')
    
    # Check data
    print(f"Excel data shape: {excel_connect.shape}")
    print(f"Column information:\n{excel_connect.dtypes}")
    
    # Compare with CSV version
    csv_connect = pd.read_csv('rtual_Connect.csv')
    
    print(f"\nData consistency check:")
    print(f"Row difference: {len(excel_connect) - len(csv_connect)}")
    print(f"Column difference: {len(excel_connect.columns) - len(csv_connect.columns)}")
    
    return excel_connect

excel_data = process_excel_data()
```

## 3. Core Python Script Function Analysis

### 3.1 Base Map Framework

Here's the potential core content of `世界地图.py`:

```python
import matplotlib.pyplot as plt
import geopandas as gpd

def create_base_map():
    """Create a base world map"""
    world = gpd.read_file(gpd.datasets.get_path('naturalearth_lowres'))
    
    fig, ax = plt.subplots(figsize=(15, 10))
    world.plot(ax=ax, color='lightgray', edgecolor='black')
    
    # Set map boundaries and labels
    ax.set_xlim(-180, 180)
    ax.set_ylim(-90, 90)
    ax.set_xlabel('Longitude')
    ax.set_ylabel('Latitude')
    ax.set_title('Base World Map')
    
    # Add grid
    ax.grid(True, linestyle='--', alpha=0.5)
    
    plt.tight_layout()
    return fig, ax
```

### 3.2 Thematic Map Generation Functions

Based on script names, create general thematic map generation functions:

```python
def generate_thematic_maps(data, map_type):
    """
    Generate various thematic maps
    
    Parameters:
    data: Geographic data
    map_type: Map type ('choropleth', 'bubble', 'cartogram', 'voronoi', 'heatmap')
    """
    
    if map_type == 'choropleth':
        # Choropleth map
        fig, ax = plt.subplots(figsize=(12, 8))
        data.plot(column='value_column', ax=ax, legend=True,
                  legend_kwds={'label': "Value Distribution"},
                  cmap='Blues', edgecolor='black')
        ax.set_title('Choropleth Map')
        
    elif map_type == 'bubble':
        # Bubble map
        fig, ax = plt.subplots(figsize=(12, 8))
        base = data.plot(ax=ax, color='lightgray', edgecolor='black')
        
        # Assume center point data and size data
        centers = data.geometry.centroid
        sizes = data['size_column'] * 10
        
        for idx, center in enumerate(centers):
            ax.scatter(center.x, center.y, s=sizes.iloc[idx],
                      alpha=0.6, color='red', edgecolor='black')
        
        ax.set_title('Bubble Map')
    
    return fig, ax
```

## 4. Project Integration and Data Pipeline

```python
class MapVisualizationProject:
    """Map visualization project management class"""
    
    def __init__(self, project_dir='.'):
        self.project_dir = project_dir
        self.data = {}
        self.maps = {}
        
    def load_all_data(self):
        """Load all data in the project"""
        
        # 1. Load CSV data
        csv_files = [
            'China_HexMap.csv',
            'ina_MatrixMap.csv', 
            'rtual_City.csv',
            'rtual_Connect.csv',
            'rtual_huouse.csv'
        ]
        
        for file in csv_files:
            key = file.replace('.csv', '')
            self.data[key] = pd.read_csv(
                f'{self.project_dir}/{file}', 
                encoding='utf-8'
            )
            print(f"Loaded: {file} - {self.data[key].shape}")
        
        # 2. Load Shapefiles
        self.data['map0'] = gpd.read_file(f'{self.project_dir}/rtual_Map0.shp')
        self.data['map1'] = gpd.read_file(f'{self.project_dir}/rtual_Map1.shp')
        
        # 3. Load Excel
        self.data['excel_connect'] = pd.read_excel(
            f'{self.project_dir}/rtual_Connect.xlsx'
        )
        
        return self.data
    
    def create_data_relationships(self):
        """Establish relationships between data"""
        
        # Example: Connect city data and connection relationships
        if 'rtual_City' in self.data and 'rtual_Connect' in self.data:
            cities = self.data['rtual_City']
            connections = self.data['rtual_Connect']
            
            # Create city network graph
            import networkx as nx
            G = nx.Graph()
            
            # Add nodes (cities)
            for _, city in cities.iterrows():
                G.add_node(city['city_id'], 
                          pos=(city['lon'], city['lat']),
                          attributes=city.to_dict())
            
            # Add edges (connections)
            for _, conn in connections.iterrows():
                G.add_edge(conn['from_city'], conn['to_city'],
                          weight=conn.get('weight', 1))
            
            self.data['city_network'] = G
            print(f"Created network with {G.number_of_nodes()} nodes and "
                  f"{G.number_of_edges()} edges")
        
        return self.data

# Use project management class
project = MapVisualizationProject()
project.load_all_data()
project.create_data_relationships()
```

## 5. Automated Report Generation

```python
def generate_visualization_report(project_data, output_dir='output'):
    """Generate comprehensive visualization report"""
    
    import os
    from matplotlib.backends.backend_pdf import PdfPages
    
    os.makedirs(output_dir, exist_ok=True)
    
    # Create PDF report
    with PdfPages(f'{output_dir}/map_visualization_report.pdf') as pdf:
        
        # 1. Data overview page
        fig, axes = plt.subplots(2, 2, figsize=(15, 10))
        
        # Display data statistics
        data_summary = []
        for key, df in project_data.items():
            if isinstance(df, pd.DataFrame):
                data_summary.append({
                    'Dataset': key,
                    'Rows': len(df),
                    'Columns': len(df.columns)
                })
        
        summary_df = pd.DataFrame(data_summary)
        axes[0, 0].axis('off')
        axes[0, 0].table(cellText=summary_df.values,
                        colLabels=summary_df.columns,
                        cellLoc='center',
                        loc='center')
        axes[0, 0].set_title('Data File Overview')
        
        # 2. Map display page
        if 'map0' in project_data:
            project_data['map0'].plot(ax=axes[0, 1], color='lightblue')
            axes[0, 1].set_title('Map0 Region')
        
        # Save to PDF
        pdf.savefig(fig)
        plt.close()
        
    print(f"Report generated at: {output_dir}/map_visualization_report.pdf")
```

## 6. Project Maintenance and Extension Recommendations

### 6.1 File Naming Conventions
Recommended consistent naming conventions:
- Data files: `category_description_version.extension`
- Script files: `sequence_type_description.py`
- Output files: `sequence_description_variant_format.pdf`

### 6.2 Data Version Control
```python
import hashlib
import json

def create_data_manifest(project_dir='.'):
    """Create data manifest for version control"""
    
    manifest = {
        'created': pd.Timestamp.now().isoformat(),
        'files': {}
    }
    
    for root, dirs, files in os.walk(project_dir):
        for file in files:
            if file.endswith(('.csv', '.shp', '.xlsx', '.py')):
                filepath = os.path.join(root, file)
                
                # Calculate file hash
                with open(filepath, 'rb') as f:
                    file_hash = hashlib.md5(f.read()).hexdigest()
                
                # Get file information
                stat = os.stat(filepath)
                manifest['files'][file] = {
                    'path': filepath,
                    'size': stat.st_size,
                    'modified': pd.Timestamp(stat.st_mtime, unit='s').isoformat(),
                    'hash': file_hash
                }
    
    # Save manifest
    with open('data_manifest.json', 'w', encoding='utf-8') as f:
        json.dump(manifest, f, indent=2, ensure_ascii=False)
    
    return manifest
```

---

