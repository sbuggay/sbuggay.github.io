---
title: sizeof Implementation
date: 2017-09-12 14:22:07
tags: c
---
The C `sizeof` operator 
```c
#define sizeof(t) (char *)(&t + 1) - (char *)(&t)
```
### Reference
- [https://en.wikipedia.org/wiki/Sizeof](https://en.wikipedia.org/wiki/Sizeof)