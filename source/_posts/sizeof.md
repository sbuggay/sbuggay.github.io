---
title: C sizeof and  offsetof Implementation
date: 2017-09-12 14:22:07
tags: c
---
C has no internal reflection. Which basically means that given a raw pointer there is no way to infer anything about it at runtime. We can't know if it's size, what type it is, etc. If it's a struct we don't even know 

The C `sizeof` macro.

```c
#define sizeof(t) (char *)(&t + 1) - (char *)(&t)
```

The C `offset` macro.

```c
#define offsetof(t, m) (size_t)&(((t *)0)->m)
```

### Reference

- [https://en.wikipedia.org/wiki/Sizeof](https://en.wikipedia.org/wiki/Sizeof)
- [https://barrgroup.com/Embedded-Systems/How-To/C-Offsetof-Macro](https://barrgroup.com/Embedded-Systems/How-To/C-Offsetof-Macro)