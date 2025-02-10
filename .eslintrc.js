"use strict";

module.exports = {
    extends : [
        "@tivac",
    ],

    parser : "@babel/eslint-parser",

    env : {
        node : true,
        es6  : true,
    },

    rules : {
        "max-statements" : [ "warn", 25 ],
        
        "newline-after-var" : "off",

        // Block some features
        "no-restricted-syntax" : [
            "error",

            // with() is so dangerous
            "WithStatement",
        ],
    },
};
