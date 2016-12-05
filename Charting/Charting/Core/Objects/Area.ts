namespace Core.Objects {
    export class Area extends Core.Models.ArrayedDataItem implements Patterns.Observers.IScaleObservable, Patterns.Observers.IDataObserver, Interfaces.IPlottable {

        private _xScale: Objects.Scale;
        private _yScale: Objects.Scale;
        private _xAccess: (d) => any;
        private _y0Access: (d) => any;
        private _y1Access: (d) => any;
        private _d3Object: any;
        constructor(xScale: Core.Objects.Scale, yScale: Core.Objects.Scale, xAccess: (d) => any, y0Access: (d) => any, y1Access: (d) => any,statusObj:Util.SdStatusData) {
            super();
            this._xScale = xScale;
            this._yScale = yScale;
            this._xAccess = xAccess;
            this._y0Access = y0Access;
            this._y1Access = y1Access;
            this.statusObj = statusObj;
            this.type = "path";
        }
        run(caller: any, data: any[]) {
            if (this._d3Object === undefined || this._d3Object === null) {
                this.build();
            }
            this.doCycle(caller, data,this._d3Object);
        }
        getObject() {
            if (this.check()) {

            } else {
                throw new Error("Unable to Create Area Object");
            }
        }
        build() {
            if (this.selector === undefined || this.selector === null) {
                this.assignUniqueSelector();
            }
            let obj = d3.area().x((d) => {
                return this._xScale.getObject()(this._xAccess(d));
            }).y0((d) => {
                return this._yScale.getObject()(this._y0Access(d));
            }).y1((d) => { return this._yScale.getObject()(this._y1Access(d)) });
            this._d3Object = obj;
            return obj;
        }
        check() {
            if (this._xScale !== undefined && this._yScale !== undefined && this._y0Access !== undefined && this._xAccess !== undefined && this._y1Access !== undefined) {
                return true;
            } else {
                return false;
            }
        }
        updateScales(xScale: Objects.Scale, yScale: Objects.Scale) {
            this._xScale = xScale;
            this._yScale = yScale;
            this.build();
        }
        updateAccessors(xAccess: (d) => any, yAccess: (d) => any, y1Access: (d) => any) {
            this._xAccess = xAccess;
            this._y0Access = yAccess;
            this._y1Access = y1Access;
            this.build();
        }
        assignUniqueSelector() {
            this.selector = "a" + (Math.floor(new Date().getTime() * Math.random()));
            this.selectorLocked = true;
        }
    }
}