import {vec3, vec4, mat4, quat, glMatrix} from 'gl-matrix';
import {gl} from './globals';


class Turtle {
    position: vec4;
    forward: vec4;
    up: vec4;
    right: vec4;
    depth: number;  
    alive: boolean = true;
    trunk: boolean = true;
    flowering: boolean = false;
  
    constructor(position: vec4, forward: vec4, up: vec4, right: vec4, depth: number) {
      this.position = position;
      this.forward = forward;
      this.up = up;
      this.right = right;

      this.depth = depth;
    }

    killTurtle() {
        this.alive = false;
    }

    branchTurtle() {
        this.trunk = false;
    }

    makeFlower() {
        this.flowering = true;
    }

    getPos() : vec4 {
        let output: vec4 = vec4.fromValues(this.position[0], this.position[1], this.position[2], this.position[3]);
        return output;
    }

    getForward() : vec4 {
        let output: vec4 = vec4.fromValues(this.forward[0], this.forward[1], this.forward[2], this.forward[3]);
        return output;
    }

    getUp() : vec4 {
        let output: vec4 = vec4.fromValues(this.up[0], this.up[1], this.up[2], this.up[3]);
        return output;    }

    getRight() : vec4 {
        let output: vec4 = vec4.fromValues(this.right[0], this.right[1], this.right[2], this.right[3]);
        return output;
    }

    getDepth() : number {
        return this.depth;
    }

    incDepth(val: number) {
        this.depth += val;
    }

    moveForward(dist: number) {
        let translate = vec4.create();
        translate = vec4.multiply(translate, this.forward, vec4.fromValues(dist, dist, dist, 1.0)); 
        vec4.add(this.position, this.position, translate);
        this.position[3] = 1.0;
    }

    rotateForward(deg: number) {
        let rotMat = mat4.create();
        rotMat = mat4.rotate(rotMat, mat4.create(), glMatrix.toRadian(deg), vec3.fromValues(this.forward[0], this.forward[1], this.forward[2]));
        this.right = vec4.normalize(this.right, vec4.transformMat4(this.right, this.right, rotMat));
        this.up = vec4.normalize(this.up, vec4.transformMat4(this.up, this.up, rotMat));
    }

    rotateUp(deg: number) {
        let rotMat = mat4.create();
        rotMat = mat4.rotate(rotMat, mat4.create(), glMatrix.toRadian(deg), vec3.fromValues(this.up[0], this.up[1], this.up[2]));
        this.forward = vec4.normalize(this.forward, vec4.transformMat4(this.forward, this.forward, rotMat));
        this.right = vec4.normalize(this.right, vec4.transformMat4(this.right, this.right, rotMat));
    }

    rotateRight(deg: number) {
        let rotMat = mat4.create();
        rotMat = mat4.rotate(rotMat, mat4.create(), glMatrix.toRadian(deg), vec3.fromValues(this.right[0], this.right[1], this.right[2]));
        this.forward = vec4.normalize(this.forward, vec4.transformMat4(this.forward, this.forward, rotMat));
        this.up = vec4.normalize(this.up, vec4.transformMat4(this.up, this.up, rotMat));
    }

    getRotationMatrix() : mat4 {
        let baseDirection: vec3 = vec3.fromValues(0, 1, 0);
        let forwardDir: vec3 = vec3.fromValues(this.forward[0], this.forward[1], this.forward[2]);

        let rotAxis = vec3.create();
        vec3.cross(rotAxis, baseDirection, forwardDir);

        let theta = Math.acos(vec3.dot(baseDirection, forwardDir) / (vec3.length(baseDirection) * vec3.length(forwardDir)));

        let rotMatrix = mat4.create();
        mat4.fromRotation(rotMatrix, theta, rotAxis);

        return rotMatrix;   
    }

    getTranslationMatrix() : mat4 {
        let translation: vec4 = vec4.fromValues(this.position[0], this.position[1], this.position[2], this.position[3]);
        let matrix = mat4.create();
        let identity = mat4.create();
        mat4.identity(identity);
        mat4.translate(matrix, identity, vec3.fromValues(translation[0], translation[1], translation[2]));
        return matrix;
    }

    getScaleMatrix() : mat4 {
        let xScale = 10.0 * Math.pow((1 / this.depth), 1.3);
        let zScale = 10.0 * Math.pow((1 / this.depth), 1.3);
        let matrix = mat4.create();
        let identity = mat4.create();
        mat4.identity(identity);
        mat4.scale(matrix, identity, vec3.fromValues(xScale, 1, zScale));

        return matrix;
    }

    getTransformation() : mat4 {
        let transform = mat4.create();
        mat4.multiply(transform, this.getTranslationMatrix(), this.getRotationMatrix());
        mat4.multiply(transform, transform, this.getScaleMatrix());

        return transform;
    }
  };
  
  export default Turtle;
  
