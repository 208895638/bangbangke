import {store} from './store';

let LanguageNames = {
	cn: 'cn',
	en: 'en',
};

const LanguagePKey = 'lngPkg';
const defaultLanguagePackage = {
	en :{
		yes : 'yes',
		no : 'no' ,
		search : 'search ',
		list : 'list',
		add : 'add ',
		edit : 'edit ',
		del : 'delete ',
		save : 'save ',
		cancel : 'cancel',
		ok : 'OK',
		process : 'process',
		set : 'set',
		prevPage : 'prev ',
		nextPage : 'next ',
		please : 'please ',
		confirm : 'confirm',
		title : 'title',
	},
	cn:{
		yes : '是',
		no : '否' ,
		search : '查询',
		list: '列表',
		add : '新增',
		edit: '编辑',
		del : '删除',
		save : '保存',
		cancel : '取消',
		ok : '确定',
		process : '操作',
		set : '设置',
		prevPage : '上页',
		nextPage : '下页',
		please : '请',
		confirm : '确认',
		title : '标题',
	}
};
const Languages = {
	configKeyName: LanguagePKey,
	current: store.get(LanguagePKey) || LanguageNames.cn,
	init: function (packageSet: any, callback?: Function) {
		if (!packageSet[Languages.current]) {
			Languages.current = LanguageNames.cn;
		}
		Languages.package = $.extend({} , defaultLanguagePackage[Languages.current] , packageSet[Languages.current] );
		if (!Languages.package) {
			throw new Error(`no such language package: [${Languages.current}]`);
		}
		Languages.package['$current'] = Languages.current;
		if (typeof callback === 'function')
			callback(Languages.package);
	},
	names: LanguageNames,
	package: null,
};


export {Languages} ;
