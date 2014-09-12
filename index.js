var path = require('path');
var transformTools = require('browserify-transform-tools');

var firstDir = null;

var transform = transformTools.makeRequireTransform(
    "requireTransform",
    {evaluateArguments: true},
    function(args, opts, cb) {
        if (args[0][0] !== '@') {
            return cb();
        }
        if (!firstDir && !opts.config) {
            firstDir = path.dirname(opts.file);
            console.error("No config, will use first file dir as a root", firstDir);
        }
        var relative = path.relative(firstDir, opts.file);
        var depth = relative.split(path.sep).length;
        var outward = '';
        if (depth === 1) {
            outward = './';
        } else {
            for (var i = 0; i < depth - 1; i++) {
                outward += '../';
            }
        }
        var argument = "require('" + args[0].replace('@', outward) + "')";
        return cb(null, argument);
    }
);

module.exports = transform;
