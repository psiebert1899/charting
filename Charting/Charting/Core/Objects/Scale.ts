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

        //getters and setters
        get rangeMax() {
            return this._rangeMax;
        }

        get rangeMin() {
            return this._rangeMin;
        }

        get domainMax() {
            return this._domainMax;
        }

        get domainMin() {
            return this._domainMin;
        }
        set domainMax(max: any) {
            this._domainMax = max;
            this.makeScale(this._scaleType);
        }
        set domainMin(min: any) {
            this._domainMin = min;
            this.makeScale(this._scaleType);
        }
        set rangeMax(max: any) {
            this._rangeMax = max;
            this.makeScale(this._scaleType);
        }
        set rangeMin(min: any) {
            this._rangeMin = min;
            this.makeScale(this._scaleType);
        }

        constructor(type: string) {
            this._scaleType = type;
        }

        getObject() {
            if (this._scale === null) {
                this.build()
            }
            return this._scale;
        }

        build() {
            this.makeScale(this._scaleType);
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

        makeLinearScale() {
            let obj = d3.scaleLinear().domain([this._domainMin, this._domainMax]).range([this._rangeMin, this._rangeMax]);
            this._scale = obj;
        }

        makeTimeScale() {
            let obj = d3.scaleTime().domain([this._domainMin, this._domainMax]).range([this._rangeMin, this._rangeMax]);
            this._scale = obj;
        }

        makeOrdinalScale() {
            throw new Error("Unimplemented");
        }

    }
}