namespace Core.Models {
    export abstract class DataItem {
        protected selectorLocked: boolean = false;
        protected selector: string;
        protected dataSize: number;
        protected type: string;
        protected attrs: Util.Attribute[];
        protected classes: string[];
        protected events: Util.Event[];
        protected styles: Util.Attribute[];

        set Styles(styles: Util.Attribute[]) {
            this.styles = styles;
        }
        set Selector(selector: string) {
            if (!this.selectorLocked) {
                this.selector = selector;
                this.selectorLocked = true;
            } else {
                throw new Error("Selector Locked, unable to change selector name");
            }
        }
        set Events(events: Util.Event[]) {
            this.events = events;
        }
        set Classes(classes: string[]) {
            this.classes = classes;
        }
        set Attrs(attrs: Util.Attribute[]) {
            this.attrs = attrs;
        }
        set DataSize(size: number) {
            this.dataSize = size;
        }

        constructor() {
            this.attrs = new Array<Util.Attribute>();
            this.classes = new Array<string>();
            this.events = new Array<Util.Event>();
            this.styles = new Array<Util.Attribute>();

        }
        public addEvent(event: Util.Event) {
            this.events.push(event);
        }
        public addAttribute(attr: Util.Attribute) {
            this.attrs.push(attr);
        }
        public addStyle(style: Util.Attribute) {
            this.styles.push(style);
        }
        protected updateEvents(caller: any) {
            for (let i = 0; i < this.events.length; i++) {
                caller.selectAll("." + this.selector)
                    .on(this.events[i].on, this.events[i].event);
            }
        }

        protected updateAttrs(caller: any) {
            for (let i = 0; i < this.attrs.length; i++) {
                caller.selectAll("." + this.selector)
                    .attr(this.attrs[i].key, this.attrs[i].value);
            }
        }
        protected appendAdditionalClasses(caller: any) {
            for (let i = 0; i < this.classes.length; i++) {
                caller.selectAll("." + this.selector)
                    .classed(this.classes[i], true);
            }
        }
        protected applyStyles(caller: any) {
            for (let x = 0; x < this.styles.length; x++) {
                caller.selectAll("." + this.selector).style(this.styles[x].key, this.styles[x].value);
            }
        }
        abstract doEnterPhase(caller: any, data: any[]);
        abstract doUpdatePhase(caller: any, data: any[]);
        abstract doExitPhase(caller: any, data: any[]);

    }
}