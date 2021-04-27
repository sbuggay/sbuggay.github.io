---
title: FreeBSD Brogue Terminal Mode
date: 2021-04-27 15:12:55
tags:
---

![brogue](/images/broguet.png)

```sh
git clone https://github.com/tmewett/BrogueCE/
```

Add terminal and webrogue support to `config.mk`. I turned off graphics support because this is running on a headless rpi.

```diff
index b33967b..22b4d35 100644
--- a/config.mk
+++ b/config.mk
@@ -2,15 +2,15 @@
 DATADIR := .
 
 # Include terminal support. Requires ncurses
-TERMINAL := NO
+TERMINAL := YES
 
 # Include graphical support. Requires SDL2 and SDL2_image
-GRAPHICS := YES
+GRAPHICS := NO
 # Path to sdl2-config script
 SDL_CONFIG := sdl2-config
 
 # Select web brogue mode. Requires POSIX system.
-WEBBROGUE := NO
+WEBBROGUE := YES
 
 # Enable debugging mode. See top of Rogue.h for features
 DEBUG := NO
 ```

Disable `snprintf` in `web-platform.c`. For some reason adding `-std=c99` wasn't enough to appease clang so I just disabled the warnings.

```diff
index f199d3c..84851d9 100644
--- a/src/platform/web-platform.c
+++ b/src/platform/web-platform.c
@@ -116,10 +116,10 @@ static void flushOutputBuffer() {
 
     no_bytes_sent = sendto(wfd, outputBuffer, outputBufferPos, 0, (struct sockaddr *)&addr_write, sizeof(struct sockaddr_un));
     if (no_bytes_sent == -1) {
-        snprintf(msg, 80, "Error: %s\n", strerror(errno));
+        // snprintf(msg, 80, "Error: %s\n", strerror(errno));
         writeToLog(msg);
     } else if (no_bytes_sent != outputBufferPos) {
-        snprintf(msg, 80, "Sent %d bytes only - %s\n", no_bytes_sent, strerror(errno));
+        // snprintf(msg, 80, "Sent %d bytes only - %s\n", no_bytes_sent, strerror(errno));
         writeToLog(msg);
     }
 
```

```sh
gmake
```

```sh
./rogue -t
```

All the web-platform exposes is a socket to interface with the game. You can use something like https://github.com/kipraske/web-brogue as a frontend for it.