namespace Util {
    export class SdStatusData {
        constructor(
            public sdNumber?:number,
            public color?: string,
            public classNames ?: string[],
            public attrs ?: Attribute[]
        ) {
            if (attrs === null || attrs === undefined) {
                this.attrs = new Array<Attribute>();
            }
            if (classNames === null || classNames === undefined) {
                this.classNames = new Array<string>();
            }
            if (color === null || color === undefined) {
                this.color = "white";
            }
        }
    }
}