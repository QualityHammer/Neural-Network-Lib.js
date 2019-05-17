class Matrix {
    constructor(rows, cols) {
        this.rows = rows;
        this.cols = cols;
        this.vals = [];

        // Matrix initialization
        for (let i = 0; i < this.rows; i++) {
            this.vals[i] = [];
            for (let j = 0; j < this.cols; j++) {
                this.vals[i][j] = 0;
            }
        }
    }

    // Static addition
    static add(a, b) {
        let result = new Matrix(a.rows, a.cols);
        if (b instanceof Matrix) {
            // Matrix hadamard
            try {
                if (a.rows !== b.rows) throw 'Rows do not match.(addition)';
                if (a.cols !== b.cols) throw 'Columns do not match.(addition)';
                for (let i = 0; i < result.rows; i++) {
                    for (let j = 0; j < result.cols; j++) {
                        result.vals[i][i] = a.vals[i][j] + b.vals[i][j];
                    }
                }
            } catch (err) {
                a.print();
                b.print();
                console.log('Error: ' + err);
            }
        } else {
            // Addition
            for (let i = 0; i < result.rows; i++) {
                for (let j = 0; j < result.cols; j++) {
                    result.vals[i][i] = a.vals[i][j] + b;
                }
            }
        }
        return result;
    }

    // Adds another matrix or a single number to every number in matrix
    add(other) {
        if (other instanceof Matrix) {
            // Matrix hadamard
            try {
                if (this.rows !== other.rows) throw 'Rows do not match.(addition)';
                if (this.cols !== other.cols) throw 'Columns do not match.(addition)';
                for (let i = 0; i < this.rows; i++) {
                    for (let j = 0; j < this.cols; j++) {
                        this.vals[i][j] += other.vals[i][j];
                    }
                }
            } catch (err) {
                this.print();
                other.print();
                console.log('Error: ' + err);
            }
        } else {
            // Addition
            for (let i = 0; i < this.rows; i++) {
                for (let j = 0; j < this.cols; j++) {
                    this.vals[i][j] += other;
                }
            }
        }
    }

    // Returns a copy of this matrix
    copy() {
        let matrix = new Matrix(this.rows, this.cols);
        for (let i = 0; i < this.rows; i++) {
            for (let j = 0; j < this.cols; j++) {
                matrix.vals[i][j] = this.vals[i][j];
            }
        }
        return matrix;
    }

    // Takes this matrix and another one and returns one with some of the values of each
    crossover(other) {
        let m = new Matrix(this.rows, this.cols);

        // Picks a random point on this matrix to separate the crossover
        let randRow = Math.floor(mp.random(this.rows));
        let randCol = Math.floor(mp.random(this.cols));
        for (let i = 0; i < this.rows; i++) {
            for (let j = 0; j < this.cols; j++) {
                if (i < randRow || (i === randRow && j <= randCol)) {
                    m.vals[i][j] = this.vals[i][j];
                } else {
                    m.vals[i][j] = other.vals[i][j]
                }
            }
        }
        return m;
    }

    // Takes a serialized matrix string and returns a matrix with those values
    static deserialize(data) {
        if (typeof data === 'string') {
            data = JSON.parse(data);
        }
        let matrix = new Matrix(data.rows, data.cols);
        matrix.vals = data.vals;
        return matrix;
    }

    // Forms a one dimensional matrix from an array
    static fromArray(arr) {
        let m = new Matrix(arr.length, 1);
        for (let i = 0; i < arr.length; i++) {
            m.vals[i][0] = arr[i];
        }
        return m;
    }

    // Static map
    static map(matrix, callback) {
        let result = new Matrix(matrix.rows, matrix.cols);
        for (let i = 0; i < matrix.rows; i++) {
            for (let j = 0; j < matrix.cols; j++) {
                let val = matrix.vals[i][j];
                result.vals[i][j] = callback(val);
            }
        }
        return result;
    }

    // Applies a custom function to every number in this matrix
    map(callback) {
        for (let i = 0; i < this.rows; i++) {
            for (let j = 0; j < this.cols; j++) {
                let val = this.vals[i][j];
                this.vals[i][j] = callback(val);
            }
        }
    }

    // Static matrix multiplication
    // A and B are both matricies
    static multiply(a, b) {
        try {
            if (a.cols !== b.rows) throw 'The columns of A do not match the rows of B.(multiplication)';
            let result = new Matrix(a.rows, b.cols);
            for (let i = 0; i < result.rows; i++) {
                for (let j = 0; j < result.cols; j++) {
                    // Dot product of values in column
                    let sum = 0;
                    for (let k = 0; k < a.cols; k++) {
                        sum += a.vals[i][k] * b.vals[k][j];
                    }
                    result.vals[i][j] = sum;
                }
            }
            return result;
        } catch (err) {
            a.print();
            b.print();
            console.log('Error: ' + err);
        }
    }

    // Columns of this matrix has to equal the rows of the other matrix
    // Dimensions of result matrix will be the rows of this matrix and the columns of the other matrix
    // Matrix multiplication
    multiply(other) {
        try {
            if (this.cols !== other.rows) throw 'The columns of A do not match the rows of B.(multiplication)';
            let result = new Matrix(this.rows, other.cols);
            let a = this.vals;
            let b = other.vals;
            for (let i = 0; i < result.rows; i++) {
                for (let j = 0; j < result.cols; j++) {
                    // Dot product of values in column
                    let sum = 0;
                    for (let k = 0; k < this.cols; k++) {
                        sum += a[i][k] * b[k][j];
                    }
                    result.vals[i][j] = sum;
                }
            }
            this.vals = result.vals;
        } catch (err) {
            this.print();
            other.print();
            console.log('Error: ' + err);
        }
    }

    // Displays the matrix as a table
    print() {
        console.table(this.vals);
    }

    // Randomizes the matrix between -1 and 1
    randomize() {
        for (let i = 0; i < this.rows; i++) {
            for (let j = 0; j < this.cols; j++) {
                this.vals[i][j] = Math.random() * 2 - 1;
            }
        }
    }

    // Static scalars
    static scale(a, b) {
        let result = new Matrix(a.rows, a.cols);
        if (b instanceof Matrix) {
            // Matrix hadamard
            try {
                if (a.rows !== b.rows) throw 'Rows do not match.(hadamard multiplication)';
                if (a.cols !== b.cols) throw 'Columns do not match.(hadamard multiplication)';
                for (let i = 0; i < result.rows; i++) {
                    for (let j = 0; j < result.cols; j++) {
                        result.vals[i][j] = a.vals[i][j] * b.vals[i][j];
                    }
                }

            } catch (err) {
                a.print();
                b.print();
                console.table('Error: ' + err);
            }
        } else {
            // Scalar
            for (let i = 0; i < result.rows; i++) {
                for (let j = 0; j < result.cols; j++) {
                    result.vals[i][j] = a.vals[i][j] * b;
                }
            }
        }
        return result;
    }

    // Multiplies another matrix or a single number to every number in matrix
    scale(other) {
        if (other instanceof Matrix) {
            // Matrix hadamard
            try {
                if (this.rows !== other.rows) throw 'Rows do not match.(hadamard multiplication)';
                if (this.cols !== other.cols) throw 'Columns do not match.(hadamard multiplication)';
                for (let i = 0; i < this.rows; i++) {
                    for (let j = 0; j < this.cols; j++) {
                        this.vals[i][j] *= other.vals[i][j];
                    }
                }
            } catch (err) {
                this.print();
                other.print();
                console.table('Error: ' + err);
            }
        } else {
            // Scalar
            for (let i = 0; i < this.rows; i++) {
                for (let j = 0; j < this.cols; j++) {
                    this.vals[i][j] *= other;
                }
            }
        }
    }

    // Returns the data of this matrix as a serialized string
    serialize() {
        return JSON.stringify(this);
    }

    // Static subtraction
    static subtract(a, b) {
        let result = new Matrix(a.rows, a.cols);
        if (b instanceof Matrix) {
            // Matrix hadamard
            try {
                if (a.rows !== b.rows) throw 'Rows do not match.(subtraction)';
                if (a.cols !== b.cols) throw 'Columns do not match.(subtraction)';
                for (let i = 0; i < result.rows; i++) {
                    for (let j = 0; j < result.cols; j++) {
                        result.vals[i][j] = a.vals[i][j] - b.vals[i][j];
                    }
                }
            } catch(err) {
                a.print();
                b.print();
                console.log('Error: ' + err);
            }
        } else {
            // Subtraction
            for (let i = 0; i < result.rows; i++) {
                for (let j = 0; j < result.cols; j++) {
                    result.vals[i][j] = a.vals[i][j] - b;
                }
            }
        }
        return result;
    }

    // Subtracts another matrix or a single number to every number in matrix
    subtract(other) {
        if (other instanceof Matrix) {
            // Matrix hadamard
            try {
                if (this.rows !== other.rows) throw 'Rows do not match.(subtraction)';
                if (this.cols !== other.cols) throw 'Columns do not match.(subtraction)';
                    for (let i = 0; i < this.rows; i++) {
                        for (let j = 0; j < this.cols; j++) {
                            this.vals[i][j] -= other.vals[i][j];
                        }
                    }
                } catch(err) {
                    this.print();
                    other.print();
                    console.log('Error: ' + err);
                }
        } else {
            // Subtraction
            for (let i = 0; i < this.rows; i++) {
                for (let j = 0; j < this.cols; j++) {
                    this.vals[i][j] -= other;
                }
            }
        }
    }

    // Returns this matrix in an array
    toArray() {
        let arr = [];
        for (let i = 0; i < this.rows; i++) {
            for (let j = 0; j < this.cols; j++) {
                arr.push(this.vals[i][j]);
            }
        }
        return arr;
    }

    // Static matrix transposing
    static transpose(a) {
        let result = new Matrix(a.cols, a.rows);

        for (let i = 0; i < a.rows; i++) {
            for (let j = 0; j < a.cols; j++) {
                result.vals[j][i] = a.vals[i][j];
            }
        }
        return result;
    }

    // The rows become the columns and the columns become the rows
    // Matrix transposing
    transpose() {
        let result = new Matrix(this.cols, this.rows);

        for (let i = 0; i < this.rows; i++) {
            for (let j = 0; j < this.cols; j++) {
                result.vals[j][i] = this.vals[i][j];
            }
        }
        this.rows = result.rows;
        this.cols = result.cols;
        this.vals = [];
        for (let i = 0; i < result.rows; i++) {
            this.vals[i] = [];
            for (let j = 0; j < result.cols; j++) {
                this.vals[i][j] = result.vals[i][j];
            }
        }
    }
}