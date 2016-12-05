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
        public maxData:number=50;
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
                console.log(this.statusMap)
            }
            let cc = new Control(this.xScale, this.yScale, this.xAccessor, this.yAccessor, this.data,this.statusMap);
            cc.max = this.maxData;
            return cc;
        }
        buildDefaultXScale() {
            let dMax = d3.max(this.data, (d) => { return this.xAccessor(d) });
            let dMin = d3.min(this.data, (d) => { return this.xAccessor(d) });
            let rMax = this.displayOptions.height;
            let rMin = 0;
            let obj = new Core.Objects.Scale('time');
            obj.domainMax = dMax;
            obj.domainMin = dMin;
            obj.rangeMax = rMax;
            obj.rangeMin = rMin;
            return obj;
        }
        buildDefaultYScale() {
            let dMax = d3.max(this.data, (d) => { return this.yAccessor(d) });
            let dMin = d3.min(this.data, (d) => { return this.yAccessor(d) });
            let rMin = 0;
            let rMax = this.displayOptions.width;
            let obj = new Core.Objects.Scale('linear');
            obj.domainMax = dMax;
            obj.domainMin = dMin;
            obj.rangeMax = rMin;
            obj.rangeMin = rMax;
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