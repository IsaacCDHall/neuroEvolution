import P5 from 'p5';
import 'p5/lib/addons/p5.dom';
import * as tf from '@tensorflow/tfjs';
import { Pipe } from './pipe';
import { Bird } from './bird';
import { Population } from './population';
const globalAny = global;
new P5((p5) => {
    const pipes = [];
    var pop;
    var player;
    var statsEl;
    // var popSizeSlider:P5.Element;
    tf.setBackend('cpu');
    p5.setup = () => {
        p5.createCanvas(p5.windowWidth, 600);
        p5.background(0);
        globalAny.p5 = p5; // Hacky way to make p5 global...
        globalAny.tf = tf;
        pop = new Population(100);
        // Single player
        player = new Bird(p5.createVector(25, p5.height / 2 + 50));
        player.player = true;
        p5.keyPressed = () => {
            if (p5.keyCode === 32)
                player.flap();
        };
        // Create pipes
        var spacing = 150;
        for (var i = 0; i < 100; i++) {
            var x = 500 + i * spacing * 2;
            // var gap = Math.max(50, 100-i*10);
            var height = p5.height / 2 + Math.sin(Math.PI * i / 4) * p5.height / 4 + p5.random() * Math.min(p5.height / 4, i * 5);
            var pipe = new Pipe(p5.createVector(x, height), Math.max(100, 300 - i * 5));
            pipe.text = '#' + (i + 1);
            pipes.push(pipe);
            spacing--;
        }
        statsEl = p5.createP();
        // popSizeSlider = p5.createSlider(1,100, 10);
    };
    var xOffset = 0;
    p5.draw = () => {
        p5.translate(-xOffset, 0);
        p5.background(0);
        // birds[0].pos.set(p5.mouseX,p5.mouseY);
        pipes.forEach(pipe => pipe.draw());
        if (!pop)
            return;
        pop.birds.forEach(bird => {
            bird.update();
            bird.draw();
            bird.checkCollidePipes(pipes);
            bird.sensePipes(pipes);
        });
        if (player) {
            player.update();
            player.draw();
            player.checkCollidePipes(pipes);
        }
        p5.push();
        p5.stroke(255, 0, 0);
        p5.line(pop.bestDist, 0, pop.bestDist, p5.height);
        p5.pop();
        var bestBird = pop.birds.sort((a, b) => b.pos.x - a.pos.x)[0];
        if (bestBird.pos.x > pop.bestDist)
            pop.bestDist = bestBird.pos.x;
        if (pop.birds.every(b => !b.alive) && (!player || !player.alive)) {
            pop.calcFitness();
            console.log('best dna: %o', pop.birds.sort((a, b) => b.pos.x - a.pos.x)[0].dna.values);
            // pop.size = +popSizeSlider.value();
            pop.nextGen();
            if (player)
                player.reset();
        }
        var aliveBirds = pop.birds.concat(player).filter(b => b.alive);
        var avgBirdX = aliveBirds.map(b => b.pos.x).reduce((a, b) => a + b, 0) / aliveBirds.length;
        xOffset = avgBirdX - 100;
        var stats = {
            birds: pop.size,
            alive: aliveBirds.length,
            bestCur: bestBird.pos.x,
            bestEver: pop.bestDist
        };
        var html = '';
        html += `gen: ${pop.generation}<br>`;
        html += `birds: ${stats.birds}<br>`;
        html += `alive: ${stats.alive}<br>`;
        html += `current best: ${stats.bestCur}<br>`;
        html += `best ever: ${stats.bestEver}<br>`;
        statsEl.html(html);
    };
});
