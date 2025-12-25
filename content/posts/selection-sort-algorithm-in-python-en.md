---
title: "Selection Sort: The Art of Creating Order from Chaos"
date: 2025-12-25
slug: "selection-sort-algorithm-in-python-en"
categories: ["Algorithms", "Python Programming"]
tags: ["Sorting Algorithms", "Selection Sort", "Python", "Data Structures", "Algorithm Fundamentals"]
draft: false
---

### What is Selection Sort?

Selection Sort is a simple and intuitive comparison-based sorting algorithm. Its principle is straightforward: **repeatedly select the smallest (or largest) element from the unsorted portion and place it at the end of the sorted portion**. Imagine organizing a line of people by height; you would repeatedly scan the unordered group, find the shortest person, and have them join the end of the sorted line.

### The Core Idea

The algorithm conceptually divides the array (or list) into two segments:
1.  **Sorted Subarray**: Located at the left end, initially empty.
2.  **Unsorted Subarray**: Occupying the rest of the sequence, initially the entire list.

In each iteration, the algorithm **scans the entire unsorted subarray** to find the minimum element (for ascending order). It then swaps this minimum element with the first element of the unsorted subarray. Thus, this first element becomes part of the sorted subarray.

### Step-by-Step Walkthrough

Let's trace the algorithm with a concrete example. We'll sort the array `[64, 25, 12, 22, 11]` in ascending order.

**Initial State**:
Unsorted: [64, 25, 12, 22, 11]
Sorted: []

**First Pass**:
*   Find the minimum (`11`) in the unsorted subarray `[64, 25, 12, 22, 11]`.
*   Swap `11` with the first unsorted element `64`.
*   Result: `[11, 25, 12, 22, 64]`
*   Updated State:
    Sorted: [11]
    Unsorted: [25, 12, 22, 64]

**Second Pass**:
*   Find the minimum (`12`) in `[25, 12, 22, 64]`.
*   Swap `12` with `25`.
*   Result: `[11, 12, 25, 22, 64]`
*   Updated State:
    Sorted: [11, 12]
    Unsorted: [25, 22, 64]

**Third Pass**:
*   Find the minimum (`22`) in `[25, 22, 64]`.
*   Swap `22` with `25`.
*   Result: `[11, 12, 22, 25, 64]`
*   Updated State:
    Sorted: [11, 12, 22]
    Unsorted: [25, 64]

**Fourth Pass**:
*   Find the minimum (`25`) in `[25, 64]`. It is already the first element, so no swap needed.
*   Result: `[11, 12, 22, 25, 64]`
*   Updated State:
    Sorted: [11, 12, 22, 25]
    Unsorted: [64]

With only one element remaining in the unsorted portion, the array is fully sorted.

### Python Implementation

Here is how you can implement Selection Sort in Python.

```python
def selection_sort(arr):
    """
    Performs in-place selection sort (ascending) on a list.
    
    Args:
        arr: The list to be sorted.
        
    Returns:
        None (the list is modified in-place).
    """
    n = len(arr)
    
    # Traverse through all array elements
    for i in range(n):
        # Assume the element at index i is the smallest
        min_idx = i
        
        # Find the minimum element in the remaining unsorted array
        for j in range(i + 1, n):
            if arr[j] < arr[min_idx]:
                min_idx = j  # Update the index of the minimum element
                
        # Swap the found minimum element with the element at index i
        arr[i], arr[min_idx] = arr[min_idx], arr[i]

# Example: Sorting a list of numbers
numbers = [64, 25, 12, 22, 11]
print("Before sorting:", numbers)
selection_sort(numbers)
print("After sorting:", numbers)

# Example: Sorting a list of strings (lexicographical order)
words = ["apple", "banana", "cherry", "date", "blueberry"]
print("\nBefore sorting:", words)
selection_sort(words)  # String comparison is based on Unicode code points
print("After sorting:", words)

# Example: Sorting a list of tuples (by the first element)
items = [(2, 'b'), (1, 'a'), (4, 'd'), (3, 'c')]
print("\nBefore sorting:", items)
selection_sort(items)  # Compares the first element of each tuple
print("After sorting:", items)
```

### Comparison with Other Sorting Algorithms

Selection Sort is famous for its simplicity, but it is not the most performant. Between Selection Sort and there's a key distinction.

 {{< bilibili BV1uL4y187Dz >}}

**Selection Sort vs. Bubble Sort**:
*   **Number of Swaps**: Selection Sort performs at most one swap per pass, while Bubble Sort may perform many adjacent swaps. This gives Selection Sort an advantage when write operations are costly (e.g., writing to flash memory).
*   **Stability**: The standard Selection Sort is **not stable**. Consider the list `[(4, 'a'), (2, 'b'), (4, 'c'), (1, 'd')]`. When sorting by the first element, the relative order of the two tuples with value 4 might change. Bubble Sort is typically stable.

**Time Complexity Analysis**:
*   **Best, Worst, and Average Cases**: Regardless of the input data, Selection Sort always makes `n(n-1)/2` comparisons. Therefore, its time complexity is always **O(n²)**.
*   **Space Complexity**: As an in-place algorithm, its space complexity is **O(1)**.

### Potential Optimizations

Even though the basic Selection Sort has a fixed O(n²) efficiency, we can consider some conceptual optimizations:

1.  **Simultaneous Min and Max Search**: In each pass, we can find both the minimum and maximum elements from the unsorted portion, placing them at the beginning and end of the sorted portion respectively. This could theoretically halve the number of passes.
2.  **Achieving Stability**: A stable version of Selection Sort can be implemented by using **insertion** instead of **swap**, but this would sacrifice space complexity.

### When to Use Selection Sort?

Selection Sort might be appropriate in scenarios such as:
*   **Very small datasets**, where simplicity outweighs efficiency.
*   **High cost of swap operations** compared to comparison operations.
*   **Extremely limited memory**, requiring a strictly in-place sorting algorithm.
*   **Educational purposes**, to help beginners grasp the fundamental concepts of sorting.

