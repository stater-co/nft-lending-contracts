import { GeneratorConstructor } from '../../../typechain-types/Generator';
import { GeneratorZerocost } from '../../../typechain-types/GeneratorZerocost';
import { GeneratorMethods } from '../../../typechain-types/GeneratorMethods';

export interface GeneratorSystemController {
    generatorZerocost: GeneratorZerocost;
    generatorMethods: GeneratorMethods;
    constructor: GeneratorConstructor.StructStruct;
}