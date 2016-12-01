namespace Core.Objects {
    export class Scale {
        private _scaleType: string;
        get scaleType() {
            return this._scaleType;
        }
        private _domainMax: any;
        private _domainMin: any;
        private _rangeMax: any;
        private _rangeMin: any;
        private _scale: any;

        constructor(type: string) {
            this._scaleType = type;
        }
        getObject() {

        }
        build() {

        }
        makeScale(type: string) {
            switch (type) {
                case "linear":
                    this.makeLinearScale();
                    break;
                case "time":
                    this.makeTimeScale();
                    break;
                case "ordinal":
                    this.makeOrdinalScale();
                    break;
                default:
                    throw new Error("Unknown Scale Type");
            }
        }

    }