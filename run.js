// Global dependencies
const fs = require('fs-extra');
const bs = require('browser-sync').create();
const glob = require('glob');
// Local dependencies
const pug = require('pug');
const postcss = require('postcss');
const postcssPlugins = ["precss","postcss-cssnext","postcss-utilities"].map(require); 

const generators = {
    templates: {
        src: 'src/*.pug',
        make: function(inpath) {
            var outpath = inpath.replace('src','dist').replace('pug','html');
            fs.outputFileSync(outpath, pug.renderFile(inpath));
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
                fs.outputFileSync(outpath, result.css);
                if ( result.map ) fs.outputFileSync(outpath + '.map', result.map);
                bs.reload(outpath.split('/').pop())
            });
        }

    }
}

const tasks = {
    build: function(){
        for (let gen in generators) {
            console.log(`[build:${gen}]`);
            glob.sync(generators[gen].src).forEach((f) => generators[gen].make(f));
        }
    },
    watch: function() {
        for (let gen in generators) {
            console.log(`[watch:${gen}]`);
            bs.watch(generators[gen].src).on('change', generators[gen].make);
        }
        tasks.serve();
    },
    serve: function() {
        console.log(`[serve]`);
        bs.init({
            server: "./dist"
        });
    }
}

// series task runner
process.argv.forEach((a) => { 
    if (tasks[a]) {
        console.log(`[${a}]`); 
        tasks[a]();
    }
});