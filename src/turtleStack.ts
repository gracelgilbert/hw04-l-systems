import Turtle from './turtle'; 
import {vec3, vec4, mat4, quat, glMatrix} from 'gl-matrix';

class TurtleStack {
    stack: Turtle[] = new Array();

    constructor () {

    }

    push (currTurtle: Turtle) {
        let newTurtle = new Turtle(currTurtle.getPos(), currTurtle.getForward(), currTurtle.getUp(), currTurtle.getRight(), currTurtle.getDepth());
        this.stack.push(newTurtle);
    }

    pop () : Turtle {
        let poppedTurtle = this.stack.pop();
        let newTurtle: Turtle = new Turtle(poppedTurtle.getPos(), poppedTurtle.getForward(), poppedTurtle.getUp(), poppedTurtle.getRight(), poppedTurtle.getDepth());
        if (!poppedTurtle.trunk) {
            newTurtle.branchTurtle();
        }
        if (poppedTurtle.flowering) {
            newTurtle.makeFlower();
        }
        return newTurtle;
    }

    getSize() : number {
        return this.stack.length;
    }

    peek () : Turtle {
        return this.stack[this.stack.length - 1];
    }
}

export default TurtleStack;
