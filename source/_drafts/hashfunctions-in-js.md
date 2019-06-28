---
title: post
date: 2019-04-05 20:41:57
tags:
---

- DJB2
```ts
function hash(str) {
    let hash = 5381;

    str.split("").forEach(c => {
        console.log(c, hash);
        hash = ((hash << 5) + hash) + c.charCodeAt(0); /* hash * 33 + c */
    });
    
    return hash;
}
```

- DJB2a
```ts
function hash(str) {
    let hash = 5381;

    str.split("").forEach(c => {
        console.log(c, hash);
        hash = ((hash << 5) + hash) + c.charCodeAt(0); /* hash * 33 + c */
    });
    
    return hash;
}
```
- FNV-1
- FNV-1a
- SDBM
- CRC32
- Murmur2
