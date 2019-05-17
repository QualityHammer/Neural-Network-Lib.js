class Graph {
    constructor() {
        this.data = [0];
        this.medianData = [0];
        this.generation = 0;
    }

    addPoint(data) {
        this.data.push(data);
        this.generation++;
    }

    addMedianPoint(data) {
        this.medianData.push(data);
    }

    getTopPoint() {
        let top = 0;
        for (let data of this.data) {
            if (data > top) {
                top = data;
            }
        }
        return top;
    }

    getMedianPoint() {
        let sum = 0;
        for (let data of this.data) {
            if (data > top) {
                sum += data;
            }
        }
        return sum / this.data.length;
    }

    show() {
        let top = this.getTopPoint();
        // Graph
        secondary.noFill();
        secondary.stroke(255);
        secondary.beginShape();
        for (let i = 0; i < this.data.length; i++) {
            let y = secondary.map(this.data[i], 0, top, secondary.height - 24, 10);
            let x = secondary.map(i, 0, this.data.length - 1, 40, secondary.width - 40);
            secondary.vertex(x, y);
        }
        secondary.endShape();
        // Median graph
        secondary.stroke(180, 0, 0);
        secondary.beginShape();
        for (let i = 0; i < this.medianData.length; i++) {
            let y = secondary.map(this.medianData[i], 0, top, secondary.height - 24, 10);
            let x = secondary.map(i, 0, this.medianData.length - 1, 40, secondary.width - 40);
            secondary.vertex(x, y);
        }
        secondary.endShape();
        // Boundry lines
        secondary.stroke(255, 0, 0);
        secondary.line(0, 8, secondary.width, 8);
        secondary.line(0, secondary.height - 22, secondary.width, secondary.height - 22);
        // Side rects
        secondary.stroke(51);
        secondary.fill(0);
        secondary.rect(0, 0, 40, secondary.height);
        secondary.rect(secondary.width - 40, 0, secondary.width, secondary.height);
        if (this.data.length > 200) {
            this.data.splice(0, true);
        }
        if (this.medianData.length > 200) {
            this.medianData.splice(0, true);
        }
        // Text
        secondary.stroke(255);
        secondary.fill(255);
        secondary.textSize(15);
        // Low
        secondary.text('0', 5, secondary.height - 28);
        // Mid
        secondary.text((top / 2).toString(), 5, secondary.height / 2);
        // Top
        secondary.text(top.toString(), 5, 20);
        // Gen 0
        secondary.text('0', 45, secondary.height - 6);
        // Current gen
        let gText = this.generation.toString();
        secondary.text(gText, secondary.width - gText.length * 10 - 40, secondary.height - 6);
    }
}