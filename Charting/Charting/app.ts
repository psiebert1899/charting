class example {
    constructor() { }
    public data: any[];
    public generator: any;
    public times: any[];
    public timeIndex:number;
    public interval: any;
    public cc: any;
    public chart:any;
    init(selector: string) {
        this.times = d3.timeDay.range(new Date(2015, 1, 1), new Date(2050, 1, 1));
        this.timeIndex = 0;
        this.generator = d3.randomNormal(3000, 500);
        let data: any[] = [];
        for (let z = 0; z < 500; z++) {
            let obj = {
                y: this.generator(),
                x: this.times[z]
            }
            data.push(obj);
            this.timeIndex++;
        }
        this.data = data;
        let svgDisplay = new Util.DisplayOptions(500, 500, 0, 0);
        let chartDispaly = new Util.DisplayOptions(450, 450, 50, 50);
        let svg = d3.select("#" + selector).append("svg").attr("width", 500).attr("height", 500);
        let chart = svg.append("g").classed("test", true).attr("transform", "translate(" + chartDispaly.marginLeft + "," + chartDispaly.marginTop + ")");
        this.chart = chart;
        let builder = new Charts.Builders.ControlChartBuilder();
        builder.xAccessor = ((d) => { return d['x'] });
        builder.yAccessor = ((d) => { return d['y'] });
        builder.displayOptions = chartDispaly;
        builder.chartingAreaSelector = "test";
        builder.data = data;
        this.cc = builder.getObject();
        this.cc.init(chart);
    }
    automate(rate: number) {
        this.interval = setInterval(() => {
            let obj = {
                x: this.times[this.timeIndex],
                y: this.generator()
            }
            this.cc.addDataPoint(this.chart,obj);
            this.timeIndex++;
        }, rate);
    }
}