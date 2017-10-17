---
title: C sizeof and  offsetof Implementation
date: 2017-09-12 14:22:07
tags: c
---
The C `sizeof` operator 
```c
#define sizeof(t) (char *)(&t + 1) - (char *)(&t)
```
The C `offset` operator 
```c
#define offsetof(t, m) (size_t)&(((t *)0)->m)
```
### Reference
- [https://en.wikipedia.org/wiki/Sizeof](https://en.wikipedia.org/wiki/Sizeof)
- [https://barrgroup.com/Embedded-Systems/How-To/C-Offsetof-Macro](https://barrgroup.com/Embedded-Systems/How-To/C-Offsetof-Macro)