import yaml from 'js-yaml';
import fs from 'fs';
import path from 'path';
const { flatten,unflatten } = require('flat');
// import { flatten }diff from 'flat';
import { exit } from 'process';

const __INCOMING_DIRECTORY_PATH__  =  path.join       (process.cwd(),  '.incoming/');
const __CURRENT_DIRECTORY_PATH__   =  path.join       (process.cwd(),  '.current/' );
const __OUT_DIRECTORY_PATH__       =  path.join       (process.cwd(),  '.out/'     );

const __INCOMING_DIRECTORY__       =  fs.readdirSync  (__INCOMING_DIRECTORY_PATH__ );
const __CURRENT_DIRECTORY__        =  fs.readdirSync  (__CURRENT_DIRECTORY_PATH__  );

function __TARGET_FILTER__(){
const __TARGET_FILE_ARR__          =  [];
for(let __INCOMING_INDEX__ = 0;__INCOMING_INDEX__ < __INCOMING_DIRECTORY__.length;__INCOMING_INDEX__++){
for(let __CURRENT_INDEX__ = 0;__CURRENT_INDEX__  < __CURRENT_DIRECTORY__.length;__CURRENT_INDEX__++){
if(
typeof __INCOMING_DIRECTORY__ [__INCOMING_INDEX__] != 'string' ||
typeof __CURRENT_DIRECTORY__  [__CURRENT_INDEX__]  != 'string'
) exit(-1);	
if(__INCOMING_DIRECTORY__[__CURRENT_INDEX__]  == __CURRENT_DIRECTORY__[__CURRENT_INDEX__]) (
__TARGET_FILE_ARR__.push(__CURRENT_DIRECTORY__[__CURRENT_INDEX__])
);
}
}
return __TARGET_FILE_ARR__.filter((__FILE_NAME__)=>(__FILE_NAME__.endsWith(".yml")));
}

function safe_assign(
incoming_yaml_string:string,
current_yaml_string:string
){
const incoming_yaml:any = yaml.load(incoming_yaml_string);
const current_yaml:any = yaml.load(current_yaml_string);
const incoming_yaml_flatten = flatten(incoming_yaml);
const current_yaml_flatten = flatten(current_yaml);
let result_yaml_flatten = JSON.parse(JSON.stringify(current_yaml));
Object.entries(incoming_yaml_flatten).forEach(([incoming_key,incoming_value])=>{
Object.entries(current_yaml_flatten).forEach(([current_key,current_value])=>{
if(incoming_key == current_key){
if(incoming_value != current_value){
console.warn({incoming_key,incoming_value,current_key,current_value});
}
result_yaml_flatten[incoming_key] = incoming_value;
}
});
});
const result_yaml = unflatten(result_yaml_flatten);
return result_yaml;
}

function test(){
const __TARGET_FILE_ARR__:Array<string> = __TARGET_FILTER__();
__TARGET_FILE_ARR__.forEach((__FILE_NAME__:string)=>{
const __INCOMING_YAML_PATH__ = path.join(__INCOMING_DIRECTORY_PATH__,__FILE_NAME__);
const __CURRENT_YAML_PATH__ = path.join(__CURRENT_DIRECTORY_PATH__,__FILE_NAME__);
const __INCOMING_YAML_STRING__ = fs.readFileSync(__INCOMING_YAML_PATH__).toString();
const __CURRENT_YAML_STRING__ = fs.readFileSync(__CURRENT_YAML_PATH__).toString();
const __RESULT_YAML__ = safe_assign(__INCOMING_YAML_STRING__,__CURRENT_YAML_STRING__);
const __INCOMING_YAML__ = yaml.load(__INCOMING_YAML_STRING__);
const __CURRENT_YMAL__ = yaml.load(__CURRENT_YAML_STRING__);
console.log({__RESULT_YAML__});
})
}

test();