export class Pipe {
    constructor(pos, gap = 100) {
        this.width = 100;
        this.pos = pos;
        this.vel = p5.createVector(-3, 0);
        this.gap = gap;
        this.text = '';
    }
    draw() {
        p5.push();
        p5.fill(0, 192, 0);
        var top = this.topRect;
        var bot = this.bottomRect;
        p5.rect(top.x, top.y, top.w, top.h);
        p5.rect(bot.x, bot.y, bot.w, bot.h);
        if(this.text) p5.text(this.text, bot.x+this.width+10, p5.height-10);
    }
    get topRect() {
        return {
            x: this.pos.x,
            y: 0,
            w: this.width,
            h: this.pos.y - this.gap / 2
        };
    }
    get bottomRect() {
        return {
            x: this.pos.x,
            y: this.pos.y + this.gap / 2,
            w: this.width,
            h: p5.height - (this.pos.y + this.gap / 2)
        };
    }
    update() {
        // this.pos.add(this.vel);
    }
}
