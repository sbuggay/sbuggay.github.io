---
title: sizeof Implementation
date: 2017-09-12 14:22:07
tags: c
---
```c
#define sizeof(t) (char *)(&t + 1) - (char *)(&t)
```