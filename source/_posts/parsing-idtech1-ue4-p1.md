---
title: "id Tech 1 Maps in UE4 Part 1: Parsing WAD Map Data"
date: 2017-10-04 10:59:17
tags: c
---
The map data serialization for Doom 1/2 is pretty well outlined here on the Doom wikia: [http://doom.wikia.com/wiki/WAD](http://doom.wikia.com/wiki/WAD). Game data (including map information) is stored in WAD (Where's All the Data?) files. It follows the following format:

The header struct, refered to as wadinfo_t:

| Offset | Size | Name | Description |
| ------ | ---- | ---- | ----------- |
| 0x00 | 4 | identification | "PWAD" or "IWAD" |
| 0x04 | 4 | numlumps | Number of lumps in WAD |
| 0x08 | 4 | infotableofs | Offset of infotable |

The directory struct, refered to as filelump_t:

| Offset | Size | Name | Description |
| ------ | ---- | ---- | ----------- |
| 0x00 | 4 | filepos | Pointer to the start of the data in the WAD |
| 0x04 | 4 | size | Size of lump in bytes |
| 0x08 | 8 | name | String for lumps name. If shorter than 8 bytes must be padded to 8 |