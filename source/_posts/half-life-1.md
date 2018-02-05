---
title: Half-Life 1 Small QOL Changes
date: 2018-02-04
tags:
	- c++
---

On a recent playthrough of Half-Life 1 I ran in to a few annoyances:
- Enemy corpses block player movement until their death animation is done.
- Doors cannot be opened with the `use` key.
- Using the `use` key slows you down (even slower than walking.)
- `hud_fastswitch 1` isn't default, nor is it a menu item.
- Even with `hud_fastswitch 1`, if there is more than one weapon for that slot there is still an extra action to select it.

It's likely that some of these were intentional design decisions made by the developers, but it would be nice to at least have the option.
In this post we are going to take a look at the first one.

### Enemy corpses block player movement until their death animation is done.

![solid-nofix](/images/solid-nofix.gif)

Here is an example. Even though I am holding forward the entire time, the entity is solid until after the death animation is complete.

Take a look at this function under [hldll/dlls/combat.cpp](https://github.com/sbuggay/halflife/blob/5d761709a31ce1e71488f2668321de05f791b405/dlls/combat.cpp#L518-L532).
There were a few commented out lines of code that I have removed for clarity.
```c++
void CBaseMonster::BecomeDead( void )
{
	// don't let autoaim aim at corpses.
	pev->takedamage = DAMAGE_YES;
	
	// give the corpse half of the monster's original maximum health. 
	pev->health = pev->max_health / 2;

	// max_health now becomes a counter for how many blood decals the corpse can place.
	pev->max_health = 5; 

	// make the corpse fly away from the attack vector
	pev->movetype = MOVETYPE_TOSS;

	// make the corpse non-solid to not block the player after death
	pev->solid = SOLID_NOT;
}
```

This function gets called after an entity takes damage and it's health drops below `0`. However, it doesn't normally set the `pev->solid` flag to `SOLID_NOT`. At the bottom, you will see our change.

```c++
	// make the corpse non-solid to not block the player after death
	pev->solid = SOLID_NOT;
```

After our change.

![solid-fix](/images/solid-fix.gif)

As you can see, the marine no longer blocks us.