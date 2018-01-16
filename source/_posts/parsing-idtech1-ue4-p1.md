---
title: "id Tech 1 Maps in UE4 Part 1: Parsing WAD Map Data"
date: 2017-10-04 10:59:17
tags: c
---
The map data serialization for Doom 1/2 is pretty well outlined here on the [Doom wikia](http://doom.wikia.com/wiki/WAD). Game data (including map information) is stored in WAD (Where's All the Data?) files. If you want to follow along with a DOOM 1 or DOOM 2 WAD you will need to purchase the games as the game data is not freeware. If not you could try parsing something like [Freedoom](https://freedoom.github.io).

It follows the following format:

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

We will respresents these two structures like this:

```c
typedef struct header_t {
    char id[4];
    int numlumps;
    int infotableofs;
} header_t;

typedef struct directory_t {
    int filepos;
    int size;
    char name[8];
} directory_t;
```

Load our WAD into memory and read in the header:

```c
FILE *wad = fopen("DOOM2.WAD", "rb");

header_t header;
fread(&header, sizeof(header_t), 1, wad);
```

With our header read in we gain some information. `id` should be either `"IWAD"` (for Internal WAD) or `"PWAD"` (Used for expansions or modding.) `numlumps` will be how many lump directories we have with `infotableofs` being the offset of where this list starts in memory. Now we can start reading in our lumps:

```c
// Allocate space for our lumps
directory_t *lumps = malloc(sizeof(directory_t) * header.numlumps);

// Move the file head to the infotable offset
fseek(wad, header.infotableofs, SEEK_SET);
// Read them in
fread(lumps, sizeof(directory_t), header.numlumps, wad);
```

Lets iterate over the first 20 to see what we have to work with.

```c
directory_t *lump = lumps;

for (int i = 0; i < 15; i++) {
    printf("%.8s (%d) [%d]\n", lump->name, lump->filepos, lump->size);
    lump++;
}
```

Here is the output:

```bash
PLAYPAL (12) [10752]
COLORMAP (10764) [8704]
ENDOOM (19468) [4000]
DEMO1 (23468) [4834]
DEMO2 (28304) [8018]
DEMO3 (36324) [17898]
MAP01 (54224) [0]
THINGS (54224) [690]
LINEDEFS (54916) [5180]
SIDEDEFS (60096) [15870]
VERTEXES (75968) [1532]
SEGS (77500) [7212]
SSECTORS (84712) [776]
NODES (85488) [5404]
SECTORS (90892) [1534]
REJECT (92428) [436]
BLOCKMAP (92864) [6418]
MAP02 (99284) [0]
THINGS (99284) [1730]
LINEDEFS (101016) [7322]
```

The first six are:

- [PLAYPAL](http://doom.wikia.com/wiki/PLAYPAL) - Color palettes
- [COLORMAP](http://doom.wikia.com/wiki/COLORMAP) - Brighness values
- [ENDOOM](http://doom.wikia.com/wiki/ENDOOM) - Text to display when DOOM exits
- [DEMOX](http://doom.wikia.com/wiki/Demo) - Demo data

After that we get to what we are actually interested in, a map marker.

```bash
MAP01 (54224) [0]
```

Notice that the size of this lump is `0`. This is not always true for WADs though. A better test is testing against the name, which must follow the format of: `ExMy` or `MAPxx`.

What's important is what comes after the map markers, these structures are always present:

```bash
THINGS (54224) [690]
LINEDEFS (54916) [5180]
SIDEDEFS (60096) [15870]
VERTEXES (75968) [1532]
SEGS (77500) [7212]
SSECTORS (84712) [776]
NODES (85488) [5404]
SECTORS (90892) [1534]
REJECT (92428) [436]
BLOCKMAP (92864) [6418]
```

The only ones we need to concern ourselves with are:

- THINGS
- LINEDEFS
- SIDEDEFS
- VERTEXES
- SECTORS

