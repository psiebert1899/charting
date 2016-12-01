﻿declare var d3: any;
namespace Core.Objects {
    export class Line extends Core.Models.ArrayedDataItem implements Patterns.Observers.IDataObserver, Patterns.Observers.IScaleObservable, Interfaces.IPlottable {
        private _scaleObserver: Patterns.Observers.IScaleObservable;
        private _dataObservable: Patterns.Observers.IDataObserver;
        private _scaleObservers: Patterns.Observers.IScaleObserver[];

        private _xScale: Core.Objects.Scale;
        private _yScale: Core.Objects.Scale;
        private _xAccess: (d) => any;
        private _yAccess: (d) => any;
        private _d3Object: any;

        constructor(xScale, yScale, xAccess, yAccess) {
            super();
            this._xScale = xScale;
            this._yScale = yScale;
            this._xAccess = xAccess;
            this._yAccess = yAccess;
            this.type = "path";
        }
        getObject() {
            if (this.check()) {
                return this.build();
            } else {
                throw new Error("Unable to Create Line Object");
            }
        }
        build() {
            if (this.selector === undefined || this.selector === null) {
                this.assignUniqueSelector();
            }
            this._d3Object = d3.line().x(
                (d) => {
                    return this._xScale.getObject()(this._xAccess(d));
                }
            ).y((d) => {
                return this._yScale.getObject()(this._yAccess(d));
            });
            return this._d3Object;
        }
        check() {
            if (this._xScale !== undefined && this._yScale !== undefined && this._xAccess !== undefined && this._yAccess !== undefined) {
                return true;
            } else {
                return false;
            }
        }
        public run(caller: any, data: any[]) {
            if (this._d3Object === undefined || this._d3Object === null) {
                this.build();
            }
            this.doCycle(caller, data);
        }

        updateScales(xScale: Core.Objects.Scale, yScale: Core.Objects.Scale) {
            this._xScale = xScale;
            this._yScale = yScale;
            this.build();
        }
        updateAccessors(xAccess: (d) => any, yAccess: (d) => any) {
            this._xAccess = xAccess;
            this._yAccess = yAccess;
            this.build();
        }
        assignUniqueSelector() {
            this.selectorLocked = true;
        }
    }
}