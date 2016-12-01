namespace Core.Models {
    export abstract class ArrayedDataItem extends DataItem {
        constructor() {
            super();
        }
        doEnterPhase(caller: any, data: any[]) {
            let self = this;
            caller.selectAll("." + this.selector)
                .data([data])
                .enter()
                .append(this.type)
                .classed(this.selector, true);
            self.appendAdditionalClasses(caller);
            self.updateAttrs(caller);

        }
        doUpdatePhase(caller: any, d3Object: any) {
            caller.selectAll("." + this.selector).attr("d", (d) => {
                return d3Object(d);
            })
            if (this.attrs !== null && this.attrs !== undefined) {
                this.updateAttrs(caller);
            }
            if (this.styles !== undefined) {
                this.applyStyles(caller);
            }
            if (this.events !== null && this.events !== undefined) {
                this.updateEvents(caller);
            }
        }
        doExitPhase(caller: any, data: any[]) {
            caller.selectAll("." + this.selector)
                .data([data])
                .exit()
                .remove();
        }
        doCycle(caller: any, data: any[]) {
            this.doEnterPhase(caller, data);
            this.doUpdatePhase(caller, data);
            this.doExitPhase(caller, data);
        }

    }
}