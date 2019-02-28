# Grace Gilbert (gracegi): L-system Jacaranda Tree

![](youngTreeBright.png)

![](middleAge.png)

## Demo Link
https://gracelgilbert.github.io/hw04-l-systems/

## Inspiration
I was inspired by the Jacaranda tree, a tree that grows in southern Africa, as well as Central and South America.

![](gweru_jacaranda.jpg)

There are two main elements that I particularly liked about these trees. The first is their bright purple flowers, distinguishing them from typical green trees. The second is their curved, winding branches. I tried to incorporate these elements into my L-system.

## Resources
- I looked at the CIS 460 slides, along with CIS 566 lecture slides, for examples of grammars.
- I looked at the webgl obj loader documentation to load obj files: https://github.com/frenchtoast747/webgl-obj-loader
- I used this 2D L-system generator to experiment with ideas for my grammar: http://www.kevs3d.co.uk/dev/lsystems/

## Implementation
### L-system Structure
The L-system is made up of various compnents:
- Axiom: the base string that will be expanded
- Current turtle: This turtle keeps track of its position, orientation, and recursion depth. The drawing functions use these values to place and transform geometry in the scene.
- Stack of turtles: Allows a turtle to be saved and returned to later to create branching.  When saving a turtle, the current turtle is pushed onto the stack. When restoring a turtle, a turtle is popped off the stack and is set to be the current turtle.
- Expansion Rules: a map from characters to expansion rules. An expansion rule is a class that contains a list of output strings and a list of corresponding probabilities for each output string. When queried for an output, the expansion rule chooses one of the output strings according to their probabilities.
- Drawing Rules: a map from characters to drawing rules. A drawing rule is similar to an expansion rule, but instead of outputting a string, it outputs a function. These functions are the functions that place geometry elements or update the turtle state.
- Final String: the string after a given number of expansions of the axiom.  This string is then traversed and each character gets mapped to a drawing rule that is run, constructing the tree.

### Grammar
The tree that I created is an instance of my L-system class, where I set all of the elements to produce my particular tree.
#### Expansion Rules
- Axiom: "FFFFX"
- X maps to: 
  - "[2FFFFrXp]Fr[1FFFFrXp]FFFFXp" with probability 0.34,
  - "[3FFFFrXp]Fr[4FFFFrXp]FFFFXp" with probability 0.34,
  - "[5FFFFrXp]Fr[6FFFFrXp]FFFFXp" with probability 0.3, and 
  - "Fp" with probability 0.02.
- F maps to: 
  - "F" with probability 0.75,
  - "FF" with probability 0.05, and 
  - "FFF" with probability 0.2.
- The remaining characters, [, ], 1, 2, 3, 4, 5, 6, r, and p all map to themselves with probability 1.0
#### Drawing Rules

### Visual features





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

