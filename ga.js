// Mutation function
function mutation(val) {
    if (Math.random() < 0.01) {
        return Math.random() * 2 - 1;
    } else {
        return val;
    }
}

// Mutation
function gaussianMutation(val) {
    if (Math.random() < 0.01) {
        let v = val += mp.randomGaussian() / 5;
        if (v > 1) v = 1;
        else if (v < -1) v = -1;
        return v;
    } else {
        return val;
    }
}