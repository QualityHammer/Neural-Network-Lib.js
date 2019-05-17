class ActivationFunction {
    // Sigmoid
    static sigmoid(x) {
        return 1 / (1 + Math.exp(-x));
    }
    
    // Derivative of sigmoid, assuming that y has already been passed through sigmoid
    static sigmoidDeriv(y) {
        return y * (1 - y);
    }
}

// let network = new NeuralNetwork(2, 2, 1);
class NeuralNetwork {
    // A could be either a neural network to copy, or a number of input nodes to create a new one
    constructor(a, hiddenCount, outputCount) {
        if (a instanceof NeuralNetwork) {
            // Copy other neural network
            this.inputNodes = a.inputNodes;
            this.hiddenNodes = a.hiddenNodes;
            this.outputNodes = a.outputNodes;
            this.weights_ih = a.weights_ih.copy();
            this.weights_ho = a.weights_ho.copy();
            this.bias_h = a.bias_h.copy();
            this.bias_o = a.bias_o.copy();
            this.learningRate = a.learningRate;
        } else {
            // Set number of nodes
            this.inputNodes = a;
            this.hiddenNodes = hiddenCount;
            this.outputNodes = outputCount;

            // Weights from input layer to hidden layer
            this.weights_ih = new Matrix(this.hiddenNodes, this.inputNodes);
            // Weights from hidden layer to output layer
            this.weights_ho = new Matrix(this.outputNodes, this.hiddenNodes);
            this.weights_ih.randomize();
            this.weights_ho.randomize();

            // Hidden node bias
            this.bias_h = new Matrix(this.hiddenNodes, 1);
            // Output node bias
            this.bias_o = new Matrix(this.outputNodes, 1);
            this.bias_h.randomize();
            this.bias_o.randomize();
            // Set learning rate and activation function
            this.learningRate = 0.1;
        }
        this.activation = ActivationFunction.sigmoid;
    }

    // Trains with a single input array using backpropagation
    backpropagation(input_array, target_array) {
        // Copy of feedforward function
        let inputs = Matrix.fromArray(input_array);
        let hidden = Matrix.multiply(this.weights_ih, inputs);
        hidden.add(this.bias_h);
        hidden.map(this.activation);
        let outputs = Matrix.multiply(this.weights_ho, hidden);
        outputs.add(this.bias_o);
        outputs.map(this.activation);

        // Convert target array to matrix
        let targets = Matrix.fromArray(target_array);

        // Calculate output layer cost
        let outputCost = Matrix.subtract(targets, outputs);
        // Calculate output gradient
        let outputGradients = Matrix.map(outputs, ActivationFunction.sigmoidDeriv);
        outputGradients.scale(outputCost);
        outputGradients.scale(this.learningRate);
        // Calculate output deltas
        let hiddenTranspose = Matrix.transpose(hidden);
        let weights_hoDelta = Matrix.multiply(outputGradients, hiddenTranspose);
        // Apply to output weights and output biases
        this.weights_ho.add(weights_hoDelta);
        this.bias_o.add(outputGradients);

        // Calculate hidden layer cost
        let weights_hoTranspose = Matrix.transpose(this.weights_ho);
        let hiddenCost = Matrix.multiply(weights_hoTranspose, outputCost);
        // Calculate hidden gradient
        let hiddenGradients = Matrix.map(hidden, ActivationFunction.sigmoidDeriv);
        hiddenGradients.scale(hiddenCost);
        hiddenGradients.scale(this.learningRate);
        // Calculate hidden deltas
        let inputTranspose = Matrix.transpose(inputs);
        let weight_ihDelta = Matrix.multiply(hiddenGradients, inputTranspose);
        // Apply to hidden weights and hidden biases
        this.weights_ih.add(weight_ihDelta);
        this.bias_h.add(hiddenGradients);
    }

    // Returns a copy of this neural network
    copy() {
        return new NeuralNetwork(this);
    }

    // Static crossover
    // Uses crossover to combine the weights of two neural networks into a new one
    static crossover(networkA, networkB) {
        let net = new NeuralNetwork(networkA.inputNodes, networkA.hiddenNodes, networkA.outputNodes);
        net.weights_ih = networkA.weights_ih.crossover(networkB.weights_ih);
        net.weights_ho = networkA.weights_ho.crossover(networkB.weights_ho);
        net.bias_h = networkA.bias_h.crossover(networkB.bias_h);
        net.bias_o = networkA.bias_o.crossover(networkB.bias_o);
        return net;
    }

    // Uses crossover to combine the weights of two neural networks into a new one
    crossover(other) {
        let net = new NeuralNetwork(this.inputNodes, this.hiddenNodes, this.outputNodes);
        net.weights_ih = this.weights_ih.crossover(other.weights_ih);
        net.weights_ho = this.weights_ho.crossover(other.weights_ho);
        net.bias_h = this.bias_h.crossover(other.bias_h);
        net.bias_o = this.bias_o.crossover(other.bias_o);
        return net;
    }

    // Takes a serialized neural network and returns a new network with that data
    static deserialize(data) {
        if (typeof data === 'string') {
            data = JSON.parse(data);
        }
        let net = new NeuralNetwork(data.inputNodes, data.hiddenNodes, data.outputNodes);
        net.weights_ih = Matrix.deserialize(data.weights_ih);
        net.weights_ho = Matrix.deserialize(data.weights_ho);
        net.bias_h = Matrix.deserialize(data.bias_h);
        net.bias_o = Matrix.deserialize(data.bias_o);
        net.setLearningRate(data.learningRate);
        net.setActivationFunction(data.activation);
        return net;
    }

    // Takes any mutation function and maps it to every weight value
    mutate(callback) {
        this.weights_ih.map(callback);
        this.weights_ho.map(callback);
        this.bias_h.map(callback);
        this.bias_o.map(callback);
    }

    // Feeds the data through the network
    // Returns an output in a one dimensional array
    predict(input_array) {
        let inputs = Matrix.fromArray(input_array);

        // Generating hidden outputs
        let hidden = Matrix.multiply(this.weights_ih, inputs);
        hidden.add(this.bias_h);
        // Hidden layer activation function
        hidden.map(this.activation);

        // Generating final outputs
        let output = Matrix.multiply(this.weights_ho, hidden);
        output.add(this.bias_o);
        // Final activation function
        output.map(this.activation);

        // Convert to one dimensional array
        return output.toArray();
    }

    // Sets a new activation function
    setActivationFunction(callback) {
        this.activation = callback;
    }

    // Sets the learning rate
    setLearningRate(learningRate) {
        this.learningRate = learningRate;
    }

    // Returns the data of this network as a serialized string
    serialize() {
        let data = JSON.stringify(this);
        let w = mp.createWriter('network.txt');
        w.print(data);
        w.close();
        w.clear();
    }
}