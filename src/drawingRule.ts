import {vec3, vec4, mat4, quat, glMatrix} from 'gl-matrix';
import {gl} from './globals';


class DrawingRule {
    outputFunctions: any[] = new Array();
    outputProbs: number[] = new Array();
  
    constructor(outputFunctions: any[], outputProbs: number[]) {
        this.outputFunctions = outputFunctions;
        this.outputProbs = outputProbs;
    }

    getOutput() : any {
        let sumProb = 0;
        for (var i = 0; i < this.outputFunctions.length; ++i) {
            let currFunction = this.outputFunctions[i];
            let p = this.outputProbs[i];
            sumProb += p;
            let rand = Math.random();
            if (rand < sumProb) {
                return currFunction;
            }
        }
        return null;
    }
  };
  
  export default DrawingRule;
  
