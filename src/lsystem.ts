import {vec3, vec4, mat4, quat, glMatrix} from 'gl-matrix';
import {gl} from './globals';
import Turtle from './turtle';
import TurtleStack from './turtleStack'
import ExpansionRule from './expansionRule'
import DrawingRule from './drawingRule'



class Lsystem {
    turtleStack: TurtleStack = new TurtleStack();
    currTurtle: Turtle = new Turtle(vec4.fromValues(0, 0, 0, 1), vec4.fromValues(0, 1, 0, 0), vec4.fromValues(0, 0, 1, 0), vec4.fromValues(1, 0, 0, 0), 1);
    axiom: string;
    expansionRules: Map<string, ExpansionRule> = new Map();
    drawingRules: Map<string, DrawingRule> = new Map();
    finalString: string = "";

  
    constructor(axiom: string) {
        this.axiom = axiom;
    }

    getTurtle() : Turtle {
        return this.currTurtle;
    }

    addExpansionRule(char: string, rule: ExpansionRule) {
        this.expansionRules.set(char, rule);
    }
    
    addDrawingRule(char: string, rule: DrawingRule) {
        this.drawingRules.set(char, rule);
    }

    setCurrTurtle(turtle: Turtle) {
        this.currTurtle = turtle;
    }

    saveTurtle() {
        this.turtleStack.push(this.currTurtle);
    }
    resetTurtle() {
        this.currTurtle = this.turtleStack.pop();
    }

    expand(baseString: string, depth: number) : string {

        if (depth == 0) {
            return baseString;
        } else {
            depth--;
            let size = baseString.length;
            let currString = "";
            for (var i = 0; i < size; ++i) {
                let currChar = baseString.charAt(i);
                let toAdd = this.expansionRules.get(currChar).getOutput();
                currString += toAdd;
            }
            return this.expand(currString, depth);
        }
    }

    setString(depth: number) {
        this.finalString = this.expand(this.axiom, depth);


    }

    runString() {
        for (var i = 0; i < this.finalString.length; ++i) {
            let currChar = this.finalString.charAt(i);

            let currRule = this.drawingRules.get(currChar).getOutput();
            if (currRule) {
                currRule();
            }
        }
    }

    
  };
  
  export default Lsystem;
  
