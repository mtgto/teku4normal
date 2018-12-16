declare module "*.json" {
    interface Oaza {
        readonly prefecture: string;
        readonly city: string;
        readonly name: string;
        readonly sphere: number[];
        color: string;
    }

    const oazas: Oaza[];
    export = oazas;
}
