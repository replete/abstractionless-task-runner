const fs = require('fs');
const bs = require('browser-sync').create();
const pug = require('pug');
const glob = require('glob');
const postcss = require('postcss');
const postcssPlugins = ["precss","postcss-cssnext","postcss-utilities"].map(require); 

let generators = {
    templates: {
        src: 'src/*.pug',
        make: function(inpath) {
            var outpath = inpath.replace('src','dist').replace('pug','html');
            fs.writeFileSync(outpath, pug.renderFile(inpath));
            bs.reload();
        }
    },
    styles: {
        src: 'src/styles/**/*.postcss',
        make: function(inpath) {
            var outpath = inpath.replace('src','dist').replace('postcss','css');
            postcss(postcssPlugins)
            .process(fs.readFileSync(inpath), { from: inpath, to: outpath })
            .then(function(result) {
                fs.writeFileSync(outpath, result.css);
                if ( result.map ) fs.writeFileSync(outpath + '.map', result.map);
                bs.reload(outpath.split('/').pop())
            });
        }

    }
};

for (let gen in generators) {
    gen = generators[gen];
    glob.sync(gen.src).forEach((f) => gen.make(f)); // Build all files
    bs.watch(gen.src).on('change', gen.make); // Register watcher
}

bs.init({
    server: "./dist"
});







