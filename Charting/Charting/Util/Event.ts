namespace Util {
    export class Event {
        constructor(public on: string, public event: (d) => any) { }
    }
}