import { collisionRectRect } from './collision';
import { Brain } from './brain';
import P5 from 'p5';
import { Pipe } from './pipe';
import { Dna } from './dna';
export class Bird {
    constructor(startPos) {
        this.startPos = startPos;
        this.size = 30;
        this.alive = true;
        this.gravity = 0.5;
        this.speed = 5;
        this.lift = 5;
        this.player = false;
        this.pos = startPos.copy();
        this.vel = p5.createVector(this.speed, 0); //p5.random(-1,1));
        this.acc = p5.createVector(0, this.gravity);
        this.brain = new Brain(2, 4, 1);
        // var weights = this.brain.getWeights();
        // this.brain.setWeights(weights);
        this.dna = new Dna(this.brain.getWeights().length);
    }
    reset() {
        this.pos = this.startPos.copy();
        this.vel = p5.createVector(this.speed, 0); //p5.random(-1,1));
        this.acc = p5.createVector(0, this.gravity);
        this.alive = true;
    }
    draw() {
        p5.push();
        if (this.alive) {
            if (this.player)
                p5.fill(0, 0, 255);
            else
                p5.fill(255, 0, 0, 128);
        }
        else {
            p5.fill(64);
        }
        p5.stroke(255);
        // p5.noStroke();
        p5.translate(this.pos.x, this.pos.y);
        p5.rotate(this.vel.heading());
        // p5.triangle(0,0-this.size/2, this.size,0, 0,0+this.size/2);
        p5.line(this.size, 0, this.size / 2, 0);
        p5.circle(0, 0, this.size);
        p5.pop();
    }
    flap() {
        this.vel.y = -this.lift;
    }
    update() {
        if (!this.alive)
            return;
        if (this.player && p5.keyIsDown(32))
            this.flap();
        this.vel.add(this.acc);
        this.pos.add(this.vel);
        if (this.pos.y < 0 || this.pos.y >= p5.height)
            this.alive = false;
        if (this.pipeDist && !this.player) {
            var actions = this.brain.predict([this.pipeDist.x / p5.width, this.pipeDist.y / p5.height]);
            if (actions[0] > 0.5)
                this.flap();
        }
    }
    checkCollidePipes(pipes) {
        var collide = pipes.some(p => this.checkCollidePipe(p));
        if (collide)
            this.alive = false;
        return collide;
    }
    checkCollidePipe(pipe) {
        var top = pipe.topRect;
        var bot = pipe.bottomRect;
        return this.checkCollide(top.x, top.y, top.w, top.h) || this.checkCollide(bot.x, bot.y, bot.w, bot.h);
    }
    checkCollide(x, y, w, h) {
        return collisionRectRect(this.pos.x - this.size / 2, this.pos.y - this.size / 2, this.size, this.size, x, y, w, h);
    }
    sensePipes(pipes) {
        var pipe = pipes.filter(p => p.pos.x + p.width / 2 >= this.pos.x).sort((a, b) => a.pos.x - b.pos.x)[0];
        var distX = p5.width;
        var distY = p5.height;
        if (pipe) {
            // p5.circle(pipe.pos.x,pipe.pos.y, 16);
            distX = pipe.pos.x - this.pos.x;
            distY = pipe.pos.y - this.pos.y;
        }
        this.pipeDist = p5.createVector(distX, distY);
    }
    applyDna() {
        this.brain.setWeights(this.dna.values);
    }
    calcFitness() {
        this.fitness = this.pos.x / p5.width;
        this.fitness = Math.pow(this.fitness, 3);
        return this.fitness;
    }
}
