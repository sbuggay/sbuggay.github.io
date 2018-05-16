---
title: Half-Life 1 Quality of Life Changes
date: 2018-02-04
tags:
	- c++
---

At the time of writing, Half-Life 1's release date <a href="https://en.wikipedia.org/wiki/Half-Life_(video_game)">is approaching nearly 20 years old</a>. It's suprising how well the game has held up considering it's roots are even older than that coming from the Quake 1/2 engine.

On a recent playthrough of Half-Life 1 I ran in to a few minor annoyances:
- Enemy corpses block player movement until their death animation is done.
- With `hud_fastswitch 1`, if there is more than one weapon for that slot there is still an extra action to select it.
- Using the `use` key slows you down to `0.3` speed.
- Doors cannot be opened with the `use` key.
- Items cannot be picked up with the `use` key.
- Weapon impact particles appear on skybox textures.
- Autoswitching to newly picked up weapons.

It's likely that some of these were intentional design decisions made by the developers, but it would be nice to at least have the option.

Luckily for us, Valve open sourced the goldsrc engine in 2013. You can find the official repo on GitHub here: [https://github.com/ValveSoftware/halflife](https://github.com/ValveSoftware/halflife). In this post we will take a look at some of these issues and see if we can mitigate them.

### Enemy corpses block player movement until their death animation is done.
----

![solid-nofix](/images/solid-nofix.gif)

Here is an example. Even though I am holding forward the entire time, the entity is solid until after the death animation is complete.

Let's take a look at the relevant function. (There were a few commented out lines of code that I have removed for clarity.)

{% code combat.cpp lang:cpp https://github.com/sbuggay/halflife/blob/5d761709a31ce1e71488f2668321de05f791b405/dlls/combat.cpp#L518-L532 hldll/dlls/combat.cpp:518 line_number:true first_line:518 mark:532-533 %}
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
{% endcode %}

This function gets called after an entity takes damage and it's health drops below `0`. However, it doesn't normally set the `pev->solid` flag to `SOLID_NOT`. At the bottom, you will see our change.

```c++
	// make the corpse non-solid to not block the player after death
	pev->solid = SOLID_NOT;
```

After our change.

![solid-fix](/images/solid-fix.gif)

As you can see, the marine no longer blocks us.

### With `hud_fastswitch 1`, if there is more than one weapon for that slot there is still an extra action to select it.
----

In Half-Life 2, activating a weapon slot that you are already using will automatically cycle through all the weapons in the slot. In Half-Life 1, the engine will instead present the user with the normal weapon selection menu. Requiring you to click to activate the weapon you have cycled to. This makes `hud_fastswitch 1` useless for any weapon slot that you have more than one valid weapon in.

I quite liked Half-Life 2's solution to the problem, so let's see if we can implement it.

We only need to concern ourselves with the part of the code that actually cares if `hud_fastswitch 1` is active, as we want to make sure we don't regress how the normal weapon selection works.	

{% code combat.cpp lang:cpp https://github.com/ValveSoftware/halflife/blob/5d761709a31ce1e71488f2668321de05f791b405/cl_dll/ammo.cpp#L416-L477 cl_dll/ammo.cpp:416 line_number:true first_line:416 %}
WEAPON *p = NULL;
bool fastSwitch = CVAR_GET_FLOAT( "hud_fastswitch" ) != 0;

if ( (gpActiveSel == NULL) || (gpActiveSel == (WEAPON *)1) || (iSlot != gpActiveSel->iSlot) )
{
	PlaySound( "common/wpn_hudon.wav", 1 );
	p = GetFirstPos( iSlot );

	if ( p && fastSwitch ) // check for fast weapon switch mode
	{
		// if fast weapon switch is on, then weapons can be selected in a single keypress
		// but only if there is only one item in the bucket
		WEAPON *p2 = GetNextActivePos( p->iSlot, p->iSlotPos );
		if ( !p2 )
		{	// only one active item in bucket, so change directly to weapon
			ServerCmd( p->szName );
			g_weaponselect = p->iId;
			return;
		}
	}
}
{% endcode %}

Let's take a look at what we've got here. `p` is going to be a pointer to our eventual selected weapon and `fastSwitch` is a boolean that will be set to `true` if we have `hud_fastswitch 1` active.
First, it checks to make sure we aren't currently in the weapon menu, that the weapon we selected isn't the crowbar, and that the slot we selected isn't the one currently selected in the weapon menu.

`WEAPON *p2 = GetNextActivePos( p->iSlot, p->iSlotPos );` is checking if there is a valid weapon in the next position in our slot. Our weapon only "fast switches" if `p2` comes back with nothing (meaning there is no other valid weapon in the same slot.)

We want to change this behavior to instead cycle through every weapon in the slot.

```c++
if ( p && fastSwitch ) // check for fast weapon switch mode
{		
	// if we already have this weapon select, move on to the next.
	if (currentSel && currentSel->iSlot == iSlot)
	{
		p = GetNextActivePos( currentSel->iSlot, currentSel->iSlotPos );

		// if there was no next active pos, revert to the first in the slot
		if ( !p )
		{
			p = GetFirstPos( iSlot );
		}
	}

	ServerCmd( p->szName );
	g_weaponselect = p->iId;
	currentSel = p;
	return;
}
```

I have added a variable `currentSel` that keeps track of our last selected weapon.
`if (currentSel && currentSel->iSlot == iSlot)` if there was a previously selected weapon, and the slot we are trying to move to is in the same slot, we simply get the next valid weapon in the slot. If there is no valid next weapon, we must be at the end of the list. So we default back to the first position.


### Using the `use` key slows you down to `0.3` speed.

Under `pm_shared/pm_shared.c`.

`PM_PlayerMove`

```c++
// Slow down, I'm pulling it! (a box maybe) but only when I'm standing on ground
if ( ( pmove->onground != -1 ) && ( pmove->cmd.buttons & IN_USE) )
{
	VectorScale( pmove->velocity, 0.3, pmove->velocity );
}
```

https://github.com/sbuggay/halflife/blob/5d761709a31ce1e71488f2668321de05f791b405/pm_shared/pm_shared.c#L3025-L3029

So this seems to slow you down for the case of which a box is being pulled. So we can simply only apply this vector scaling while moving backwards.

We will take a look at more of these changes in part 2. 

You can find these changes and more on my fork of of the source https://github.com/sbuggay/halflife/tree/small-qol-changes.