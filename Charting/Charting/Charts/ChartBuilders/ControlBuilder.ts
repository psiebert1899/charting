namespace Charts.Builders {
    export class ControlChartBuilder {
        public xScale: Core.Objects.Scale;
        public yScale: Core.Objects.Scale;
        public yAccessor: (d) => any;
        public xAccessor: (d) => any;
        public y1Accessor: (d) => any;
        public displayOptions: any;
        public chartingAreaSelector: string;
        public statusMap:Util.SdStatusData[];
        public data: any[];
        public maxData: number = 50;
        public usingXAxis: boolean=true;
        public usingYAxis: boolean = true;
        public containingElement: any;
        public containingElementDisplay: Util.DisplayOptions;
        public pointRadius: number = 2;
        public getObject() {
            return this.build();
        }
        private build() {
            if (this.xScale == undefined) {
                this.xScale = this.buildDefaultXScale();
            }
            if (this.yScale === undefined) {
                this.yScale=this.buildDefaultYScale();
            }
            if (this.statusMap === undefined) {
                this.statusMap = this.buildDefaultStatusMap();
            }
            let cc = new Control(this.xScale, this.yScale, this.xAccessor, this.yAccessor, this.data, this.statusMap);
            if (this.usingXAxis) {
                cc.xAxisGroup=this.containingElement.append("g").classed("ccxAxis",true).attr("transform","translate("+this.displayOptions.marginLeft+","+(this.containingElementDisplay.height-this.displayOptions.marginTop)+")");
                cc.xAxis = d3.axisBottom(this.xScale.getObject());
            }
            if (this.usingYAxis) {
                cc.yAxisGroup = this.containingElement.append("g").classed("ccyAxis", true).attr("transform","translate("+this.displayOptions.marginLeft+","+this.displayOptions.marginTop+")");
                cc.yAxis = d3.axisLeft(this.yScale.getObject());
            }
            cc.max = this.maxData;
            cc.pointRadius = this.pointRadius;
            return cc;
        }
        buildDefaultXScale() {
            let dMax = d3.max(this.data, (d) => { return this.xAccessor(d) });
            let dMin = d3.min(this.data, (d) => { return this.xAccessor(d) });
            let rMax = this.containingElementDisplay.width-this.displayOptions.marginLeft;
            let rMin = 0;
            let obj = new Core.Objects.Scale('time');
            obj.domainMax = dMax;
            obj.domainMin = dMin;
            obj.rangeMax = rMax;
            obj.rangeMin = rMin;
            console.log("x:")
            console.log(obj)
            return obj;
        }
        buildDefaultYScale() {
            let dMax = d3.max(this.data, (d) => { return this.yAccessor(d) });
            let dMin = d3.min(this.data, (d) => { return this.yAccessor(d) });
            let rMin = 0;
            let rMax = this.containingElementDisplay.height-(this.displayOptions.marginTop*2);
            let obj = new Core.Objects.Scale('linear');
            obj.domainMax = dMax;
            obj.domainMin = dMin;
            obj.rangeMax = rMin;
            obj.rangeMin = rMax;
            console.log("y:");
            console.log(obj)
            return obj;
        }
        buildDefaultStatusMap() {
            let map = new Array<Util.SdStatusData>();
            map.push(new Util.SdStatusData(0, "green", ["within1sd"]));
            map.push(new Util.SdStatusData(1, "yellowgreen", ["within2sd"]));
            map.push(new Util.SdStatusData(-1, "yellowgreen", ["within2sd"]));
            map.push(new Util.SdStatusData(2, 'yellow', ["within3sd"]));
            map.push(new Util.SdStatusData(-2, 'yellow', ["within3sd"]));
            map.push(new Util.SdStatusData(3, 'red', ['outOfNormalRange']));
            map.push(new Util.SdStatusData(-3, 'red', ['outOfNormalRange']));
            return map;
        }
    }
}