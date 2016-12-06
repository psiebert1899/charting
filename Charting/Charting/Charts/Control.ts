namespace Charts {
    export class Control {
        private _lines: Core.Objects.Line[];
        private _areas: Core.Objects.Area[];
        private _points: Core.Objects.Point[];
        private _xScale: Core.Objects.Scale;
        private _yScale: Core.Objects.Scale;
        private _xAccess: (d) => any;
        private _yAccess: (d) => any;
        private _data: any[];
        private _formattedData: any[];
        private numSds: number = 3;
        private _max: number;
        public statusMap: Util.SdStatusData[];
        public xAxis: any;
        public yAxis: any;
        public xAxisGroup: any;
        public yAxisGroup: any;
        public pointRadius:number;
        private _smoothCurves:boolean;
        set smoothCurves(smooth: boolean) {
            this._smoothCurves = smooth;
            for (let x = 0; x < this._lines.length; x++) {
                this._lines[x].smoothCurves = smooth;
                this._lines[x].build();
            }
        }
        get smoothCurves() {
            return this._smoothCurves;
        }
        get max() {
            return this._max;
        }
        set max(maxData: number) {
            this._max = maxData;
            this.trimToMaxData(maxData);
        }

        constructor(xScale: Core.Objects.Scale, yScale: Core.Objects.Scale, xAccess: (d) => any, yAccess: (d) => any, data: any[],statusMap ?: Util.SdStatusData[]) {
            this._lines = new Array<Core.Objects.Line>();
            this._areas = new Array<Core.Objects.Area>();
            this._points = new Array<Core.Objects.Point>();
            this._xScale = xScale;
            this._yScale = yScale;
            this._xAccess = xAccess;
            this._yAccess = yAccess;
            this.statusMap = statusMap;
            this.formatDataArray(data);

        }
        init(caller: any) {
            this.makePoints();
            this.makeLines();
            this.makeAreas();
            this.checkScaleUpdates();
            this.drawObjects(caller);
            //same process for trend lines and points
            //also initialize axes and labels
        }


        addDataPoint(caller:any,point: any) {
            this._data.push(point);
            let formattedPoint = this.formatDataPoint(point);
            this._formattedData.push(formattedPoint);
            this.trimToMaxData(this._max);
            this.checkScaleUpdates();
            this.drawObjects(caller);
            //when new point added to all display items, redraw the chart

        }
        private drawObjects(caller: any) {
            this.drawAreas(caller);
            this.drawLines(caller);
            this.drawPoints(caller);
            this.drawAxes(caller);

        }
        private drawAxes(caller: any) {
            if (this.xAxisGroup !== undefined) {
                this.xAxisGroup.call(this.xAxis);
            }
            if (this.yAxisGroup !== undefined) {
                this.yAxisGroup.call(this.yAxis);
            }
        }
        private drawLines(caller: any) {
            for (let x = 0; x < this._lines.length; x++) {
                this._lines[x].run(caller, this._formattedData);
            }
        }
        private drawAreas(caller: any) {

            for (let x = 0; x < this._areas.length; x++) {
                this._areas[x].run(caller, this._formattedData);
            }
        }
        private drawPoints(caller: any) {
            for (let x = 0; x < this._points.length; x++) {
                this._points[x].run(caller, this._formattedData);
            }
        }
        private formatDataArray(data: any[]) {
            this._formattedData = [];
            this._data = [];
            for (let x = 0; x < data.length; x++) {
            this._data.push(data[x]);
                this._formattedData.push(this.formatDataPoint(data[x]));
            }
            this.trimToMaxData(this._max);
        }
        private formatDataPoint(point) {
            let obj = {};
            obj['x'] = this._xAccess(point);
            obj['y'] = this._yAccess(point);
            let mean = this.calculateMean(this._data);
            let sd = this.calculateSd(this._data);
            for (let x = 0; x <= this.numSds; x++) {
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
            if (this._data.length < 2) {
                return this._yAccess(this._data[0]);
            } else {
                return d3.deviation(this._data, (d) => { return this._yAccess(d) });
            }
        }
        private makeLines() {
            for (let x = 1; x <= this.numSds; x++) {
                let posName = "sd" + x;
                let negName = "sdNeg" + x;
                this._lines.push(new Core.Objects.Line(this._xScale, this._yScale, (d) => { return d['x'] }, (d) => { return d[posName] }));
                this._lines.push(new Core.Objects.Line(this._xScale, this._yScale, (d) => { return d['x'] }, (d) => { return d[negName] }));
            }
            //make mean line
            this._lines.push(new Core.Objects.Line(this._xScale, this._yScale, (d) => { return d['x'] }, (d) => { return d['sd0'] }, ['meanLine']));
            //make trendline
            this._lines.push(new Core.Objects.Line(this._xScale, this._yScale, (d) => { return d['x'] }, (d) => { return d['y'] }));
        }

        private makeAreas() {
            for (let x = 0; x < this.numSds; x++) {
                
                //now we must create the negative area and the positive areas
                this._areas.push(new Core.Objects.Area(this._xScale, this._yScale, (d) => { return d['x'] }, (d) => { return d['sd'+x] }, (d) => { return d['sd'+(x+1)] },this.getStatusObj(x)));
                this._areas.push(new Core.Objects.Area(this._xScale, this._yScale, (d) => { return d['x'] }, (d) => { return d['sdNeg' + (x + 1)] }, (d) => { return d['sdNeg' + x] }, this.getStatusObj(-x)));

                //now make the terminal areas (areas for the ends of the chart
            }
            this._areas.push(new Core.Objects.Area(this._xScale, this._yScale, (d) => { return d['x'] }, (d) => { return d['sdNeg' + (this.numSds)] }, (d) => { return this._yScale.getObject().invert(this._yScale.rangeMin)}, this.getStatusObj(-this.numSds)));
            this._areas.push(new Core.Objects.Area(this._xScale, this._yScale, (d) => { return d['x'] }, (d) => { return d['sd' + this.numSds] }, (d) => { return this._yScale.getObject().invert(this._yScale.rangeMax) }, this.getStatusObj(this.numSds)));
        }
        

        private makePoints() {
            this._points.push(new Core.Objects.Point(this._xScale, this._yScale, (d) => { return d['x'] }, (d) => { return d['y'] }));
            this._points.forEach((p)=>{p.pointRadius=this.pointRadius})
        }
        private trimToMaxData(max: number) {
            this._formattedData = this._formattedData.slice(this._max * -1)

        }
        private checkScaleUpdates() {
            this._xScale.domainMin = d3.min(this._formattedData, (d) => { return this._xAccess(d) });
            this._xScale.domainMax = d3.max(this._formattedData, (d) => { return this._xAccess(d) });
            let minArray = [];
            let maxArray = [];
            for (let x = 0; x < this._lines.length; x++) {
                minArray.push(d3.min(this._formattedData, (d) => { return this._lines[x].yAccessor(d) }));
                maxArray.push(d3.max(this._formattedData, (d) => { return this._lines[x].yAccessor(d) }));
            }
            let minmin = d3.min(minArray);
            let maxmax = d3.max(maxArray);
            if (minmin < this, this._yScale.domainMin) {
                this._yScale.domainMin = minmin-500;
            }
            if (maxmax > this._yScale.domainMax) {
                this._yScale.domainMax = maxmax+500;
            }
            this.xAxis.scale(this._xScale.getObject());
            this.yAxis.scale(this._yScale.getObject());
        }
        getStatusObj(sdNum: number): Util.SdStatusData {
            if (this.statusMap === null || this.statusMap === undefined) {
                return new Util.SdStatusData();
            } else {
                for (let entry = 0; entry < this.statusMap.length; entry++) {
                    if (this.statusMap[entry].sdNumber === sdNum) {
                        return this.statusMap[entry];
                    }
                }
            }
            return new Util.SdStatusData();
        }
    }
}