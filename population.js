// Global variables
// Size of population
const POP_SIZE = 250;

// Global function to call a serialization of the global population
// Used for button callbacks
function serial() {
    population.serializeBest();
}

class Population {
    constructor() {
        this.size = POP_SIZE;
        this.pop = [];
        this.deadPop = [];
        this.pool = [];
        this.best = null;
        this.topScore = 0;
        this.generation = 1;
        this.viewBest = false;
        for (let i = 0; i < this.size; i++) {
            this.pop.push(new Player())
        }

        // Function settings
        this.fitnessCalculation = this.normalizeFitness;
        this.selectionProcess = this.poolSelection;
        this.mutationFunction = mutation;
    }

    // Adds a point to every player's score (not used in all simulations)
    addPoint() {
        for (let mem of this.pop) {
            mem.scoreCounter.addPoint();
        }
    }

    // Clears the pool
    clearPool() {
        this.pool.length = 0;
    }

    // Returns the best in the population
    getBest(plot) {
        let top = 0;
        let best = null;
        let sum = 0;
        for (let mem of this.deadPop) {
            if (mem.score > top) {
                top = mem.score;
                best = mem;
            }
            sum += mem.score;
        }
        // Adds the top score to the graph if plot is true
        if (plot) {
            graph.addPoint(top);
            graph.addMedianPoint(sum / this.deadPop.length);
        }
        // Sets the top score and logs it
        if (top > this.topScore) {
            this.topScore = top;
        }
        let p = new Player(best.brain, true);
        p.best = true;
        return p;
    }

    // Returns the best fitness value of a generation
    getMaxFitness() {
        let top = 0;
        for (let mem of this.deadPop) {
            if (mem.fitness > top) {
                top = mem.fitness;
            }
        }
        return top;
    }

    // Creates a new generation using fitness values in a selection process to try and produce
    // A better generation. Also uses mutation for diversity
    newGeneration() {
        // Interface
        let g = mp.select('#generation');
        this.generation++;
        g.html(this.generation);
        // Get best and normalize fitness values
        this.best = this.getBest(true);
        this.fitnessCalculation(this);
        // New generation
        this.pop[0] = this.best;
        this.clearPool();
        for (let i = 1; i < this.size * 0.9; i++) {
            this.pop[i] = this.selectionProcess();
            this.pop[i].brain.mutate(this.mutationFunction);
        }
        for (let i = this.size * 0.9; i < this.size; i++) {
            this.pop[i] = new Player();
        }
        this.deadPop.length = 0;
    }

    // Creates a new "generation" of a single player to loop through while viewing
    newViewingGeneration() {
        let p = new Player(this.deadPop[0].brain);
        this.pop[0] = p;
        this.deadPop.length = 0;
    }

    // Calculates the fitness value for each player when a new generation is made
    normalizeFitness() {
        let sum = 0;
        for (let mem of this.deadPop) {
            sum += mem.fitness;
        }
        for (let mem of this.deadPop) {
            mem.fitness = mem.fitness / sum;
        }

    }

    // Uses a pool to select two networks that are worthy for crossover
    poolSelection() {
        // gets the max fitness value
        let maxFit = this.getMaxFitness();
        // normalize fitness and add to pool
        for (let mem of this.deadPop) {
            let fit = mem.fitness / maxFit;
            var chance = Math.floor(fit * 100);
            for (var i = 0; i < chance; i++) {
                this.pool.push(mem);
            }
        }
        // gets a random DNA from the pool
        let index1 = Math.floor(Math.random() * this.pool.length);
        let index2 = Math.floor(Math.random() * this.pool.length);

        let brain1 = this.pool[index1].brain.copy();
        let brain2 = this.pool[index2].brain.copy();

        // Crossover
        let crossedBrain = NeuralNetwork.crossover(brain1, brain2);
        return new Player(crossedBrain);
    }

    // Serializes the current best neural network weights
    serializeBest() {
        if (this.generation > 1) {
            if (!this.best.dead) {
                this.best.brain.serialize();
            } else if (this.pop.length > 0) {
                for (let mem of this.pop) {
                    if (!mem.dead) {
                        mem.brain.serialize();
                        break;
                    }
                }
            } else this.best.brain.serialize();
        }
    }

    // If the fitness value is being stored in score, this moves it
    setAllFitness() {
        for (let mem of this.deadPop) {
            mem.fitness = Math.pow(mem.score, 2);
        }
    }

    // Sets the fitness calculation to a new function
    setFitnessCalc(callback) {
        this.fitnessCalculation = callback;
    }

    // Sets the mutation function
    setMutation(callback) {
        this.mutationFunction = callback;
    }

    // Sets the selection process to a new function
    setSelection(callback) {
        this.selectionProcess = callback;
    }

    // Uses the players fitness values to select a worthy player
    simpleSelection() {
        let i = 0;
        let r = Math.random();
        while (r > 0) {
            r -= this.deadPop[i].fitness;
            i++;
        }
        i--;
        return new Player(this.deadPop[i].brain);
    }

    // Updates the entire population
    update() {
        for (let i = 0; i < this.pop.length; i++) {
            if (!this.pop[i].dead) this.pop[i].think();
            this.pop[i].update();
            if (this.pop[i].dead) {
                this.deadPop.push(this.pop.splice(i, true)[0]);
            }
        }
        if (this.pop.length == 0) {
            this.newGeneration();
        }
    }

    // Updates a smaller batch of the population, determined by batch_size
    updateIncrement(batch_size) {
        // Good code
        if (batch_size >= this.pop.length) {
            batch_size = this.pop.length;
        }
        // Loops through the batch of the population backwards
        for (let i = batch_size - 1; i >= 0; i--) {
            this.pop[i].think();
            this.pop[i].update();
            if (this.pop[i].dead) {
                this.pop[i].setScore();
                this.deadPop.push(this.pop.splice(i, true)[0]);
            }
            if (this.pop.length == 0) {
                if (this.viewBest) {
                    this.newViewingGeneration();
                } else {
                    this.newGeneration();
                }
            }
        }
    }
}