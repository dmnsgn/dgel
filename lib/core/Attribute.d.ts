import Variable from "./Variable.js";
declare class Attribute extends Variable {
    name: string;
    type: string;
    constructor(name: string, type: string);
}
export default Attribute;
