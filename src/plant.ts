import {vec3, vec4, mat4, quat, glMatrix} from 'gl-matrix';
import {gl} from './globals';
import Turtle from './turtle';
import TurtleStack from './turtleStack'
import ExpansionRule from './expansionRule'
import DrawingRule from './drawingRule'
import Lsystem from './lsystem';



class Plant {
    lsystem: Lsystem = new Lsystem("FFFFX");
    Fexpansion: ExpansionRule;
    Xexpansion: ExpansionRule;
    saveExpansion: ExpansionRule;
    resetExpansion: ExpansionRule;
    rot1Expansion: ExpansionRule;
    rot2Expansion: ExpansionRule;

    rot3Expansion: ExpansionRule;
    rot4Expansion: ExpansionRule;

    rot5Expansion: ExpansionRule;
    rot6Expansion: ExpansionRule;

    rotRandExpansion: ExpansionRule;
    flowerExpansion: ExpansionRule;

    expansion: number;
    age: number;


    Fdraw: DrawingRule;
    Xdraw: DrawingRule;
    saveDraw: DrawingRule;
    resetDraw: DrawingRule;
    rot1Draw: DrawingRule;
    rot2Draw: DrawingRule;
    rot3Draw: DrawingRule;
    rot4Draw: DrawingRule;
    rot5Draw: DrawingRule;
    rot6Draw: DrawingRule;

    flowerDraw: DrawingRule;


    rotRandDraw: DrawingRule;

    transformationMats: mat4[] = new Array();
    flowerMats: mat4[] = new Array();
    
    rotations: vec4[] = new Array();
    scales: vec3[] = new Array();

    constructor(expansion: number, age: number) {
        this.Fexpansion = new ExpansionRule(["Fr", "FF", "FFF"], [0.75, 0.05, 0.2]);
        this.Xexpansion = new ExpansionRule(["[2FFFFrXp]Fr[1FFFFrXp]FFFFXp", "[3FFFFrXp]Fr[4FFFFrXp]FFFFXp", "[5FFFFrXp]Fr[6FFFFrXp]FFFFXp", "Fp"], [0.34, 0.34, 0.3, 0.02]);
        this.saveExpansion = new ExpansionRule(["["], [1.0]);
        this.resetExpansion = new ExpansionRule(["]"], [1.0]);
        this.rot1Expansion = new ExpansionRule(["1"], [1.0]);
        this.rot2Expansion = new ExpansionRule(["2"], [1.0]);

        this.rot3Expansion = new ExpansionRule(["3"], [1.0]);
        this.rot4Expansion = new ExpansionRule(["4"], [1.0]);

        this.rot5Expansion = new ExpansionRule(["5"], [1.0]);
        this.rot6Expansion = new ExpansionRule(["6"], [1.0]);

        this.rotRandExpansion = new ExpansionRule(["r"], [1.0]);

        this.flowerExpansion = new ExpansionRule(["p"], [1.0]);

        this.expansion = expansion;
        this.age = age;



        this.lsystem.addExpansionRule("F", this.Fexpansion);
        this.lsystem.addExpansionRule("X", this.Xexpansion);
        this.lsystem.addExpansionRule("[", this.saveExpansion);
        this.lsystem.addExpansionRule("]", this.resetExpansion);
        this.lsystem.addExpansionRule("1", this.rot1Expansion);
        this.lsystem.addExpansionRule("2", this.rot2Expansion);
        this.lsystem.addExpansionRule("3", this.rot3Expansion);
        this.lsystem.addExpansionRule("4", this.rot4Expansion);
        this.lsystem.addExpansionRule("5", this.rot5Expansion);
        this.lsystem.addExpansionRule("6", this.rot6Expansion);
        this.lsystem.addExpansionRule("r", this.rot6Expansion);
        this.lsystem.addExpansionRule("r", this.rot6Expansion);
        this.lsystem.addExpansionRule("p", this.rot6Expansion);


        
    }



    drawLine() {
        if (this.lsystem.currTurtle.alive) {
            let translation: vec4 = this.lsystem.currTurtle.getPos();

            this.transformationMats.push(this.lsystem.currTurtle.getTransformation());
        
            this.lsystem.currTurtle.moveForward(0.37);
            let depthChange = 0.03 + (0.05 * Math.random() - 0.025);
            if (this.lsystem.currTurtle.trunk && this.lsystem.currTurtle.getDepth() < 5) {
                depthChange /= 2.0;
            }

            this.lsystem.currTurtle.incDepth(depthChange);

            if (this.lsystem.currTurtle.getPos()[1] < 3 && this.lsystem.currTurtle.getDepth() > 3 && !this.lsystem.currTurtle.trunk) {
                this.lsystem.currTurtle.killTurtle();
            }
        }

    }

    rotateUpPos() {
        let theta: number = 70 * (1 / (this.lsystem.currTurtle.getDepth()));
        theta += 5 * Math.random();
        this.lsystem.currTurtle.rotateUp(theta);
    }

    rotateUpNeg() {
        let theta: number = 70 * (1 / (this.lsystem.currTurtle.getDepth()));
        theta -= 5 * Math.random();
        this.lsystem.currTurtle.rotateUp(theta);
    }

    rotateRightPos() {
        let theta: number = 70 * (1 / (this.lsystem.currTurtle.getDepth()));
        theta += 5 * Math.random();
        this.lsystem.currTurtle.rotateRight(theta);
    }

    rotateRightNeg() {
        let theta: number = 70 * (1 / (this.lsystem.currTurtle.getDepth()));
        theta -= 5 * Math.random();
        this.lsystem.currTurtle.rotateRight(theta);
    }

    rotateForwardPos() {
        let theta: number = 70 * (1 / (this.lsystem.currTurtle.getDepth()));
        theta += 5 * Math.random();
        this.lsystem.currTurtle.rotateForward(theta);
    }

    rotateForwardNeg() {
        let theta: number = 70 * (1 / (this.lsystem.currTurtle.getDepth()));
        theta -= 5 * Math.random();
        this.lsystem.currTurtle.rotateForward(theta);
    }

    rotateRandom() {
        let thetaF: number = 3.2 * Math.random();
        let thetaR: number = 3.2 * Math.random();
        let thetaU: number = 3.2 * Math.random();

        if (!this.lsystem.currTurtle.trunk) {
            thetaF *= Math.min(this.lsystem.currTurtle.getDepth(), 15);
            thetaR *= Math.min(this.lsystem.currTurtle.getDepth(), 15);
            thetaU *= Math.min(this.lsystem.currTurtle.getDepth(), 15);
        }

        
        this.lsystem.currTurtle.rotateForward(thetaF);
        this.lsystem.currTurtle.rotateUp(thetaU);
        this.lsystem.currTurtle.rotateRight(thetaR);
    }



    saveTurtle() {
        // let currTurtle: Turtle = this.lsystem.getTurtle();
        // let savedTurtle: Turtle = new Turtle(currTurtle.getPos(), currTurtle.getForward(), currTurtle.getUp(), currTurtle.getRight(), currTurtle.getDepth());
        // this.lsystem.turtleStack.push(savedTurtle);
        let pFlower = 0.5;
        let rand = Math.random();
        if (rand < pFlower) {
            this.lsystem.currTurtle.makeFlower();
        }
        this.lsystem.saveTurtle();
        this.lsystem.currTurtle.incDepth(1.0);
        this.lsystem.currTurtle.branchTurtle();

    }

    updateExpansion(expansion: number) {
        this.expansion = expansion;
    }

    resetTurtle() {
        // if (this.lsystem.turtleStack.stack.length != 0) {
        //     // console.log("here");
        // let newTurtle: Turtle = this.lsystem.turtleStack.pop();
        // this.lsystem.setCurrTurtle(newTurtle);
        this.lsystem.resetTurtle();

        // }
    }

    placeFlower() {
        let p = 0.8 * Math.min(1.0 - this.age, 1.0);
        if (this.lsystem.currTurtle.getDepth() < 10) {
            p = 0.0;
        }
        let prob = Math.random();
        if (prob < p) {
            let num = 1 + Math.floor(3 * Math.random());
            for (var i = 0; i < num; i++) {
                let transformation = mat4.create();
                mat4.multiply(transformation, this.lsystem.currTurtle.getTranslationMatrix(), this.lsystem.currTurtle.getRotationMatrix());
                let identity = mat4.create();
                mat4.identity(identity);

                let offset = mat4.create();
                mat4.rotateX(offset, identity, Math.random() * 10 * (i + 1));
                mat4.rotateY(offset, offset, Math.random() * 10 * (i + 1));
                mat4.rotateZ(offset, offset, Math.random() * 10 * (i + 1));

                mat4.multiply(transformation, transformation, offset);


                this.flowerMats.push(transformation);
            }
        }

    }

    fillRules() {
        this.Fdraw = new DrawingRule([this.drawLine.bind(this)], [1.0]);
        this.rot1Draw = new DrawingRule([this.rotateUpPos.bind(this)], [1.0]);
        this.rot2Draw = new DrawingRule([this.rotateUpNeg.bind(this)], [1.0]);

        this.rot3Draw = new DrawingRule([this.rotateRightPos.bind(this)], [1.0]);
        this.rot4Draw = new DrawingRule([this.rotateRightNeg.bind(this)], [1.0]);
        this.rot5Draw = new DrawingRule([this.rotateForwardPos.bind(this)], [1.0]);
        this.rot6Draw = new DrawingRule([this.rotateForwardNeg.bind(this)], [1.0]);
        this.rotRandDraw = new DrawingRule([this.rotateRandom.bind(this)], [1.0]);


        this.Xdraw = new DrawingRule([this.blank.bind(this)], [1.0]);
        this.saveDraw = new DrawingRule([this.saveTurtle.bind(this)], [1.0]);
        this.resetDraw = new DrawingRule([this.resetTurtle.bind(this)], [1.0]);
        this.flowerDraw = new DrawingRule([this.placeFlower.bind(this)], [1.0]);


        this.lsystem.addDrawingRule("F", this.Fdraw);
        this.lsystem.addDrawingRule("X", this.Xdraw);
        this.lsystem.addDrawingRule("1", this.rot1Draw);
        this.lsystem.addDrawingRule("2", this.rot2Draw);
        this.lsystem.addDrawingRule("3", this.rot3Draw);
        this.lsystem.addDrawingRule("4", this.rot4Draw);
        this.lsystem.addDrawingRule("5", this.rot5Draw);
        this.lsystem.addDrawingRule("6", this.rot6Draw);
        this.lsystem.addDrawingRule("r", this.rotRandDraw);
        this.lsystem.addDrawingRule("p", this.flowerDraw);


        this.lsystem.addDrawingRule("[", this.saveDraw);
        this.lsystem.addDrawingRule("]", this.resetDraw);

    }



    

    runLsystem() {

        this.lsystem.setString(this.expansion);
        this.lsystem.runString();
        // console.log(this.lsystem.finalString);

    }

    blank() {

    }

    
  };
  
  export default Plant;
  
