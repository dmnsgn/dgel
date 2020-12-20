/// <reference types="@webgpu/types" />
export declare const GPUIndexFormat: {
    [key: string]: GPUIndexFormat;
};
export declare const GPUPrimitiveTopology: {
    [key: string]: GPUPrimitiveTopology;
};
export declare const GPUBufferUsage: {
    MAP_READ: number;
    MAP_WRITE: number;
    COPY_SRC: number;
    COPY_DST: number;
    INDEX: number;
    VERTEX: number;
    UNIFORM: number;
    STORAGE: number;
    INDIRECT: number;
};
export declare const GPUTextureUsage: {
    COPY_SRC: number;
    COPY_DST: number;
    SAMPLED: number;
    STORAGE: number;
    OUTPUT_ATTACHMENT: number;
};
export declare const GPUShaderStage: {
    VERTEX: number;
    FRAGMENT: number;
    COMPUTE: number;
};
