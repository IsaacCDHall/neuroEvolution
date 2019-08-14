export class Dna {

  //convert to state in react
    constructor(size) {
        this.size = size;
        this.values = [];
        for (var i = 0; i < size; i++) {
            this.values[i] = random(-1, 1);
        }
    }
    static crossover(a, b) {
        var child = new Dna(a.size);
        var mid = randomInt(0, a.size);
        child.values = child.values.map((v, i) => {
            return i >= mid ? a.values[i] : b.values[i];
        });

        return child;
    }
    mutate(rate = 0.01, size = 0.25) {
        this.values = this.values.map(value => {
            if (random() < rate) {
                value += random(-size, size);
            }
            return value;
        });
    }
}

// these will be methods in react
function random(min = 0, max = 1) {
    return Math.random() * (max - min) + min;
}
function randomInt(min, max) {
    return Math.floor(random(min, max));
}
