import {vec3, vec4, mat4, quat, glMatrix} from 'gl-matrix';
import {gl} from './globals';


class ExpansionRule {
    outputStrings: string[] = new Array();
    outputProbs: number[] = new Array();
  
    constructor(outputStrings: string[], outputProbs: number[]) {
        this.outputStrings = outputStrings;
        this.outputProbs = outputProbs;
    }

    getOutput() : string{
        let sumProb = 0;
        for (var i = 0; i < this.outputStrings.length; ++i) {
            let currOutput = this.outputStrings[i];
            let p = this.outputProbs[i];
            sumProb += p;
            let rand = Math.random();
            if (rand < sumProb) {
                return currOutput;
            }
        }
        return "";
    }
  };
  
  export default ExpansionRule;
  
