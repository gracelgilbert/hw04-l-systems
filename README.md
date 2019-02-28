# Grace Gilbert (gracegi): L-system Jacaranda Tree

![](tree2.png)

![](tree1.png)

## Demo Link
https://gracelgilbert.github.io/hw04-l-systems/

## Inspiration
I was inspired by the Jacaranda tree, a tree that grows in southern Africa, as well as Central and South America.

![](gweru_jacaranda.jpg)

![](jacaranda-trees-in-full-splendour-with-blossom-in-the-trees-and-on-AJ73GK.jpg)

There are two main elements that I particularly liked about these trees. The first is their bright purple flowers, distinguishing them from typical green trees. The second is their curved, winding branches. I tried to incorporate these elements into my L-system.

## Resources
- I looked at the CIS 460 slides, along with CIS 566 lecture slides, for examples of grammars.
- I looked at the webgl obj loader documentation to load obj files: https://github.com/frenchtoast747/webgl-obj-loader
- I used this 2D L-system generator to experiment with ideas for my grammar: http://www.kevs3d.co.uk/dev/lsystems/

## Implementation
Example of a basic Turtle class in TypeScript (Turtle.ts)
```
import {vec3} from 'gl-matrix';

export default class Turtle {
  constructor(pos: vec3, orient: vec3) {
    this.position = pos;
    this.orientation = orient;
  }

  moveForward() {
    add(this.position, this.position, this.orientation * 10.0);
  }
}
```
Example of a hash map in TypeScript:
```
let expansionRules : Map<string, string> = new Map();
expansionRules.set('A', 'AB');
expansionRules.set('B', 'A');

console.log(expansionRules.get('A')); // Will print out 'AB'
console.log(expansionRules.get('C')); // Will print out 'undefined'
```
Using functions as map values in TypeScript:
```
function moveForward() {...}
function rotateLeft() {...}
let drawRules : Map<string, any> = new Map();
drawRules.set('F', moveForward);
drawRules.set('+', rotateLeft);

let func = drawRules.get('F');
if(func) { // Check that the map contains a value for this key
  func();
}
```
Note that in the above case, the code assumes that all functions stored in the `drawRules` map take in no arguments. If you want to store a class's functions as values in a map, you'll have to refer to a specific instance of a class, e.g.
```
let myTurtle: Turtle = new Turtle();
let drawRules: Map<string, any> = new Map();
drawRules.set('F', myTurtle.moveForward.bind(myTurtle));
let func = drawRules.get('F');
if(func) { // Check that the map contains a value for this key
  func();
}
```

