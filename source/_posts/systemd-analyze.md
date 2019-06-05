---
title: Using systemd-analyze to Debug Boot Time
date: 2019-06-05 01:22:20
tags:
---

After doing a dist upgrade to Ubuntu 19.04, booting started taking over 20 seconds. `systemd` comes with a handy tool called `systemd-analyze` to debug these kinds of issues.

From the `man` file:

```
systemd-analyze may be used to determine system boot-up performance
statistics and retrieve other state and tracing information from the
system and service manager, and to verify the correctness of unit
files. It is also used to access special functions useful for advanced
system manager debugging.
```

In particular we are interested in the `blame` functionality of it.

```
systemd-analyze [OPTIONS...] blame

systemd-analyze blame prints a list of all running units, ordered by
the time they took to initialize. This information may be used to
optimize boot-up times. Note that the output might be misleading as the
initialization of one service might be slow simply because it waits for
the initialization of another service to complete. Also note:
systemd-analyze blame doesn't display results for services with
Type=simple, because systemd considers such services to be started
immediately, hence no measurement of the initialization delays can be
done.
```

Neat. Seems like what we want.

```bash
[devan:~]$ systemd-analyze blame

21.382s plymouth-quit-wait.service
1.982s snap-node-2184.mount
1.973s snap-gnome\x2dsystem\x2dmonitor-81.mount
1.948s snap-vlc-770.mount
1.936s snap-gnome\x2dlogs-61.mount
1.905s snap-gnome\x2dcharacters-272.mount
1.827s snap-gnome\x2d3\x2d28\x2d1804-47.mount
1.781s snap-gnome\x2d3\x2d28\x2d1804-51.mount
1.778s snap-gnome\x2d3\x2d26\x2d1604-82.mount
1.752s snap-gnome\x2dcharacters-280.mount
1.705s snap-spotify-34.mount
1.662s snap-gtk\x2dcommon\x2dthemes-701.mount
1.651s snap-gnome\x2d3\x2d26\x2d1604-70.mount
1.600s snap-node-2212.mount
1.588s snap-core-6531.mount
...
```

Looks like `plymouth-quit-wait.service` seems to be the culprit here.

`plymouth` seems to be related to displaying the splash screen during boot, not something I really care about.

```
[devan:~]$ systemd-analyze blame
1.858s snap-gnome\x2dcalculator-352.mount
1.855s snap-firefox-216.mount
1.817s snap-gnome\x2dcharacters-272.mount
1.766s snap-gnome\x2dlogs-57.mount
1.763s snap-gtk\x2dcommon\x2dthemes-1198.mount
1.660s snap-gnome\x2dsystem\x2dmonitor-83.mount
1.656s snap-vlc-770.mount
1.628s snap-gnome\x2d3\x2d28\x2d1804-47.mount
1.591s snap-gtk\x2dcommon\x2dthemes-701.mount
1.531s snap-gnome\x2d3\x2d28\x2d1804-51.mount
1.527s snap-core-6964.mount
1.501s snap-spotify-34.mount
1.489s snap-gnome\x2dcalculator-260.mount
1.471s snap-gnome\x2dsystem\x2dmonitor-81.mount
1.458s snap-core18-782.mount
...
```