"use strict";

const { terser } = require("rollup-plugin-terser");

const pkg = require("./package.json");

const banner = `/*! ${pkg.name}@${pkg.version} !*/\n`;

const input = "./src/logger.js";

// ESM & CJS builds
module.exports = {
    input,

    output : [{
        file      : pkg.main,
        format    : "cjs",
        sourcemap : true,
        exports   : "default",
        banner,
    }, {
        file      : pkg.main.replace(".js", "-min.js"),
        format    : "cjs",
        sourcemap : true,
        exports   : "default",
        plugins   : [
            terser(),
        ],

        banner,
    }, {
        file      : pkg.module,
        format    : "es",
        sourcemap : true,
        banner,
    }, {
        file      : pkg.module.replace(".mjs", "-min.mjs"),
        format    : "es",
        sourcemap : true,
        plugins   : [
            terser(),
        ],
        banner,
    }],
};
