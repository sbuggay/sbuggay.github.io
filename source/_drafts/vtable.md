---
title: Inspecting C++ Vtables with -fdump-class-hierarchy
date: 2016-12-11
tags:
---

```C++
class A {
public:
    void foo0() {}
    virtual void foo1() {}
    int intA;
};

class B : public A {
public:
    void foo1() {}
    void foo2() {}
    int intC;
};
```

```
g++ <source> -fdump-class-hierarchy
```

```
Vtable for A
A::_ZTV1A: 3u entries
0     (int (*)(...))0
8     (int (*)(...))(& _ZTI1A)
16    (int (*)(...))A::foo1

Class A
   size=16 align=8
   base size=12 base align=8
A (0x0x7facb33d55a0) 0
    vptr=((& A::_ZTV1A) + 16u)

Vtable for B
B::_ZTV1B: 3u entries
0     (int (*)(...))0
8     (int (*)(...))(& _ZTI1B)
16    (int (*)(...))B::foo1

Class B
   size=16 align=8
   base size=16 base align=8
B (0x0x7facb326c208) 0
    vptr=((& B::_ZTV1B) + 16u)
  A (0x0x7facb33d5600) 0
      primary-for B (0x0x7facb326c208)
```