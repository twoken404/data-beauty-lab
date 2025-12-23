---
title: "Visualizing Planar Affine Transformations: Exploring Geometric Transformations with Python"
date: 2025-01-23
slug: "affine-transformation-visualization-en"
categories: ["Data Visualization", "Linear Algebra"]
tags: ["Python", "Matplotlib", "Linear Transformation", "Affine Transformation", "Visualization"]
draft: false
---

### What Are Planar Affine Transformations?

Planar affine transformations are a fundamental concept in geometry, describing transformations that preserve straight lines and parallelism. In essence, they are combinations of operations like rotation, scaling, and shearing applied to points on a plane. After transformation, lines remain lines, and parallel lines stay parallel. This concept is ubiquitous in computer graphics, image processing, and machine learning.

This article will guide you through a series of vivid Python visualization cases to intuitively understand the basic types of affine transformations.

### Preparation: Grid and Visualization Function

First, we create a coordinate grid as the "canvas" for transformations and define a generic visualization function.

```python
import numpy as np
import matplotlib.pyplot as plt

# Generate grid data
x1 = np.arange(-20, 20 + 1, step=1)
x2 = np.arange(-20, 20 + 1, step=1)
XX1, XX2 = np.meshgrid(x1, x2)

# Custom visualization function
def visualize_transform(XX1, XX2, ZZ1, ZZ2, cube, arrows, fig_name):
    # ... (See original code for implementation details)
    # This function plots the original grid (gray), transformed grid (blue),
    # highlights a unit square, and shows two basis vectors.
```

### Case 1: Rotation

Rotation turns points around a fixed point (usually the origin) by a given angle. For example, a 30-degree counter-clockwise rotation.

```python
import numpy as np
# Counter-clockwise rotation by 30 degrees around the origin
theta = 30/180*np.pi
R = np.array([[np.cos(theta), -np.sin(theta)],
              [np.sin(theta),  np.cos(theta)]])
# Apply the rotation matrix R to grid points X
Z = X @ R.T
```
**Effect**: The entire grid and the inner unit square rotate 30 degrees around the origin. The red x-axis basis vector and the green y-axis basis vector also rotate together, remaining perpendicular.

### Case 2: Scaling

Scaling can be uniform (isotropic) or non-uniform (anisotropic).
*   **Uniform Scaling (Enlargement)**: Stretches equally along both axes.
    ```python
    S = np.array([[2, 0],
                  [0, 2]])
    Z = X @ S
    ```
    **Effect**: Grid spacing increases, and the area of the unit square becomes four times larger.
*   **Uniform Scaling (Reduction)**: Compresses equally along both axes.
    ```python
    S = np.array([[0.4, 0],
                  [0,   0.4]])
    ```
    **Effect**: Grid spacing decreases, and the unit square shrinks.
*   **Non-uniform Scaling**: Different scaling factors for different axes.
    ```python
    S = np.array([[2, 0],
                  [0, 0.5]])
    ```
    **Effect**: The grid is stretched along the x-axis and squashed along the y-axis. The square becomes a rectangle, and the lengths of the basis vectors change accordingly.

### Case 3: Composite Transformations (Scaling and Rotation)

The order of transformations is crucial because matrix multiplication is not commutative.
*   **Scale then Rotate**
    ```python
    Z = X @ S.T @ R.T
    ```
    **Effect**: First stretch/squash the grid, then rotate this deformed grid.
*   **Rotate then Scale**
    ```python
    Z = X @ R.T @ S.T
    ```
    **Effect**: First rotate the standard grid, then scale the rotated grid. The final result is distinctly different from the previous case.

### Case 4: Shearing

Shearing is a transformation that "skews" a shape, for example, along the horizontal (x) axis.
```python
T = np.array([[1, 1.5],
              [0,   1]])
Z = X @ T.T
```
**Effect**: The vertical grid lines become slanted but remain parallel. The unit square transforms into a parallelogram. The y-axis basis vector remains unchanged, while the x-axis basis vector gains a component in the y-direction.

### Applications

Through these cases, we've visually explored:
1.  How the **rotation matrix** `R` changes orientation while preserving shape.
2.  How the **scaling matrix** `S` changes size, either uniformly or non-uniformly.
3.  How the **shear matrix** `T` changes shape while potentially preserving area (when its determinant is 1).
4.  How the **order of matrix multiplication** dictates the final outcome of composite transformations.

**Real-World Applications**:
*   **Image Processing**: Rotating, scaling, and deskewing images.
*   **Computer Vision**: Using affine transformation models for feature matching and image registration.
*   **Data Augmentation**: In training machine learning models (especially for computer vision), applying random affine transformations to training images increases data diversity and improves model generalization.
*   **Computer Graphics**: Implementing movement, rotation, and scaling of 2D sprites.

Understanding affine transformations and their matrix representations is a vital foundation for delving deeper into these fields.