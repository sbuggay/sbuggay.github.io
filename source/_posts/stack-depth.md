---
title: Calculating Stack Depth
date: 2017-09-06 12:00:00
tags: c
---

A not very useful, yet interesting, excercise is to calculate the current stack depth.

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