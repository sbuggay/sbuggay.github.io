---
title: "C Garbage Collection Part 1: Finding the stack"
date: 2017-09-12 14:22:23
tags: 
    - c
---

The simplest garbage collection pattern is mark and sweep. Implementing this in C we need to check 3 data segments for references to allocated memory. The stack, the heap, and .bss. In this post we will take a look at find where the stack exists in memory so we can scan it. There are platform specific ways to find this information, but this solution is platform agnostic.

```c
size_t top_of_stack;

void print_stack_depth() {
    int bottom_of_stack;
    printf("stack depth: %lu\n", top_of_stack - (size_t) &bottom_of_stack)
}

int main() {
    int sentinal;
    top_of_stack = (size_t) &sentinal;

    print_stack_depth();

    return 0;
}
```

### Reference

- [http://web.engr.illinois.edu/~maplant2/gc.html](http://web.engr.illinois.edu/~maplant2/gc.html)