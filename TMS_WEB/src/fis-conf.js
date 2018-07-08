fis.set('project.fileType.text', 'ts');

/*
// 启用插件
is.hook('relative');

// 让所有文件，都使用相对路径。
fis.match('**', {
	relative: true
});
*/


var currentMedia = fis.project.currentMedia();
// 需要：完整协议+ url +‘/’ 结尾
// 如： https://54.223.126.249:8080/api/
var apiServer = 'http://211.144.95.51/api/';

if (currentMedia === 'dev') {
     //apiServer = 'http://192.168.1.149:801/api/';
    apiServer = 'http://211.144.95.51/api/';
}


fis.match('**/*.ts', {
    parser: fis.plugin('typescript', {
        sourceMap: true,
        strictNullChecks: true,
        module: 1,
        target: 1,
        //showNotices : true ,
        noImplicitAny: true
    }),
    rExt: '.js'
});


fis.match('{/@types/**.*,/comm/**.*}', {
    release: false
});


// 开启模块化
fis.hook('commonjs', {
    baseUrl: '.',
    extList: ['.ts']
});


// 设置成是模块化 js, 编译后会被 define 包裹。
fis.match('**/*.ts', {
    //wrap : false,
    //useSameNameRequire: true,// 开启同名依赖
    isMod: true
});


fis.match('::package', {
    postpackager: fis.plugin('loader'),
    useSourceMap: true // 合并后开启 SourceMap 功能。
});


//SCSS Compile
fis.match('*.scss', {
    parser: fis.plugin('node-sass', {
        outputStyle: 'expanded',
        sourceMap: true
    }),
    rExt: '.css'
});


// query
var queryPlaceholder = '?__=';
fis.match('*', {
    query: queryPlaceholder //占位符
}).match('::package', {
    postpackager: [
        fis.plugin('query', {
            placeholder: queryPlaceholder // 这里传入占位符
        }),
        fis.plugin('loader', {
            processor: {
                '.html': 'html'
            }
        })
    ]
});


fis.match('**/*.html', {
    parser: fis.plugin('art-template4', {
        define: {
            bodyType: '',
            apiServer: apiServer,
            'views/': {}
        }
    }),
    rExt: '.html'
});


var outPath, url, ignore;
if (currentMedia === 'prod') {
    // fis.set('project.ignore', ['mock/**']);
    outPath = '/$0';
    url = '/pages$0';
    ignore = '{/@types/*.*,/comm/*.*,/mock/**,/*.md,/*.log,package.json}';
}
else {
    outPath = '/$0';
    ignore = '{/@types/*.*,/comm/*.*,/*.md,/*.log,package.json}';
}


fis.match('**/*.*', {
    release: outPath,
    url: url
}).match(ignore, {
    release: false
});


console.log((new Date).toLocaleString());

// 产品发布，进行合并
/*fis.media('prod')
	.match('**.{html:js,js,ts}', {
		optimizer: fis.plugin('uglify-js', {
			compress: {
				drop_console: true,
				drop_debugger: true
			}
		})
	})
	.match('*.{html:css,css,scss}', {
		useSprite: true,
		optimizer: fis.plugin('clean-css', {
			keepBreaks: true
		})
	});*/


// fis3 server start --root ../dist
// fis3 release prod -d ../web_root/admin
