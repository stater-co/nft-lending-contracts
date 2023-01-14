import { GeneratorMethods } from '../../../typechain-types/GeneratorMethods';
import { GeneratorZerocost } from '../../../typechain-types/GeneratorZerocost';
import { Generator } from '../../../typechain-types/Generator';

export interface GeneratorSystem {
    generatorMethods: GeneratorMethods;
    generatorZerocost: GeneratorZerocost;
    generator: Generator;
}