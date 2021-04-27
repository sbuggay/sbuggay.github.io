---
title: The Boids and the Trees
date: 2020-02-24 00:00:08
tags:
---

I have recently been binge watching [The Coding Train](https://www.youtube.com/user/shiffman) by Daniel Shiffman. In two of his videos he [creates a flocking simulation](https://www.youtube.com/watch?v=mhjuuHl6qHM) and a [Quadtree](https://www.youtube.com/watch?v=OJxEcs0w_kE). I thought it would be a good excercise to try and combine the two concepts. 

[![quadtree](/images/quadtree.png)](https://devanbuggay.com/boids)

I was fairly happy with the result. You can play around with the simulation here: https://devanbuggay.com/boids.

There is also another amazing YouTube channel by [Sebastian Lague](https://www.youtube.com/channel/UCmtyQOKKmrMVaKuRXz02jbQ) where he creates [3D boids with collision detection](https://www.youtube.com/watch?v=bqtqltqcQhw).

### Improvements

A list of an improvements I want to make in the future.

- Sliders for simulation variables (perception radius, cohesion/alignment/seperation factors, speed, etc)
- Better quadtree performance by having it be incremental (only update a boid in the tree once it's left it's boundary)
- Improved interaction
- Wrap the range checks on the quadtree to have it emulate a "sphere" instead of disjoint space.

### Reference
- https://en.wikipedia.org/wiki/Boids
- https://en.wikipedia.org/wiki/Quadtree