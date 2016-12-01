namespace Charts {
    export class Control {
        private _lines: Core.Objects.Line[];
        private _areas: Core.Objects.Area[];
        private _xScale: Core.Objects.Scale;
        private _yScale: Core.Objects.Scale;
        private _xAccess: (d) => any;
        private _yAccess: (d) => any;
        private _y1Access: (d) => any;
        private _data: any[];
        private _formattedData: any[];
        private numSds: number;

        init(caller: any) {
            this.drawObjects(caller);
            //same process for trend lines and points
            //also initialize axes and labels
        }


        addDataPoint(point: any) {
            this._data.push(point);
            let formattedPoint = this.formatDataPoint(point);
            this._formattedData.push(formattedPoint);
            for (let x = 0; x < this._lines.length; x++) {
                this._lines[x].addDataPoint(formattedPoint);
            }
            for (let x = 0; x < this._areas.length; x++) {
                this._areas[x].addDataPoint(formattedPoint);
            }
            //when new point added to all display items, redraw the chart

        }
        private drawObjects(caller: any) {
            this.drawLines(caller);
            this.drawAreas(caller);
        }
        private drawLines(caller: any) {
            for (let x = 0; x < this._lines.length; x++) {
                this._lines[x].run(caller, this._data);
            }
        }
        private drawAreas(caller: any) {

            for (let x = 0; x < this._areas.length; x++) {
                this._areas[x].run(caller, this._data);
            }
        }
        private drawPoints(caller: any) {

        }
        private formatDataPoint(point) {
            let obj = {};
            obj['x'] = this._xAccess(point);
            obj['y'] = this._yAccess(point);
            obj['y1'] = this._y1Access(point);

            let mean = this.calculateMean(this._data);
            let sd = this.calculateSd(this._data);
            for (let x = 0; x <= this.numSds; x++) {
                //here we will need to add object data for both +x and -x
                let posName = "sd" + x;
                let negName = "sdNeg" + x;
                obj[posName] = mean + (sd * x);
                obj[negName] = mean - (sd * x);
            }
            return obj;
        }
        private calculateMean(data: any) {
            return d3.mean(this._data, (d) => { return this._yAccess(d) });
        }
        private calculateSd(data: any) {
            return d3.deviation(this._data, (d) => { return this._yAccess(d) });
        }
        private makeLines() {
            for (let x = 0; x < this.numSds; x++) {
                let posName = "sd" + x;
                let negName = "sdNeg" + x;
                this._lines.push(new Core.Objects.Line(this._xScale, this._yScale, (d) => { return d['x'] }, (d) => { return d['sd' + x] }));
                this._lines.push(new Core.Objects.Line(this._xScale, this._yScale, (d) => { return d['x'] }, (d) => { return d['sdNeg' + x] }));
            }
        }

        private makeAreas() {
            for (let x = 0; x < this.numSds; x++) {
                if (x + 1 >= this.numSds) {
                    this._areas.push(new Core.Objects.Area(this._xScale, this._yScale, (d) => { return d['x'] }, (d) => { return d['sd' + x] }, (d) => { return this._yScale.rangeTop }));
                } else {
                    if (Math.abs(x - 1) > this.numSds) {
                        this._areas.push(new Core.Objects.Area(this._xScale, this._yScale, (d) => { return d['x'] }, (d) => { return d['sd' + x] }, (d) => { return this._yScale.rangeBottom }));
                    } else {

                    }
                }
            }
        }

        private makePoints() {

        }
    }
}