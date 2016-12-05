namespace Core.Objects {
    export class Point extends Core.Models.NonArrayedDataItem {
        private _xScale: any;
        private _yScale: any;
        private _xAccess: (d) => any;
        private _yAccess: (d) => any;
        private _d3Object: any;
        constructor(xScale: Core.Objects.Scale, yScale: Core.Objects.Scale, xAccess: (d) => any, yAccess: (d) => any) {
            super();
            this._xScale = xScale;
            this._yScale = yScale;
            this._xAccess = xAccess;
            this._yAccess = yAccess;
            this.type = "circle";
            this.attrs = [new Util.Attribute("r", (d) => { return 4; }), new Util.Attribute("cx", (d) => { return this._xScale.getObject()(this._xAccess(d)) }), new Util.Attribute("cy", (d) => { return this._yScale.getObject()(this._yAccess(d)) })];
            this.classes = ["ccPoint"];
        }
        run(caller: any, data: any[]) {
            this.doCycle(caller,data);
        }
        updateScales(xScale: Objects.Scale, yScale: Objects.Scale) {
            this._xScale = xScale;
            this._yScale = yScale;
        }
        assignUniqueSelector() {
            this.selector = "p" + (Math.floor(new Date().getTime() * Math.random()));
            this.selectorLocked = true;
        }
        //override update phase, point objects are not modeled in d3
        doUpdatePhase(caller: any, data: any[]) {
            let callerObj = caller.selectAll("." + this.selector);
            this.appendAdditionalClasses(callerObj);
            this.updateAttrs(callerObj);
        }
        doCycle(caller: any, data: any[]) {
            this.doEnterPhase(caller, data);
            this.doUpdatePhase(caller, data);
            this.doExitPhase(caller,data);
        }
    }
}