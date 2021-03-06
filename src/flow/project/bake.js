
var   path = require('path')
    , util = require('../util/util')

exports.bake = function bake(flow) {

    var project = flow.project.prepared;

    flow.log(3, 'bake - project %s\n', flow.project.parsed.project.name);

    flow.project.hxml = exports.hxml(flow, project );

    flow.log(3, flow.project.hxml);
    flow.log(3, '');

    flow.project.baked = true;

} //project

    //bakes defines into a usable form
exports.defines = function defines(flow, project, split) {

    split = split || '\n';

    var list = project.defines_list.map(function(a){
        return '-D ' + a;
    });

    return list.join(split) + split;

} //defines

    //bakes flags into a usable form
exports.flags = function flags(flow, project, split) {

    split = split || '\n';

    return project.flags.join(split) + split;

} //flags


exports.target = function(flow, project, split) {

    split = split || '\n';

    var haxe_files_path = path.join(flow.project.paths.build, 'haxe/');
        haxe_files_path = path.relative(flow.project.root, haxe_files_path);
        haxe_files_path = util.normalize(haxe_files_path);

    var values = '-cp ' + haxe_files_path;

    if(flow.target_cpp) {

        var cpp_files_path = path.join(flow.project.paths.build, 'cpp/');
            cpp_files_path = path.relative(flow.project.root, cpp_files_path);
            cpp_files_path = util.normalize(cpp_files_path);

        values += split + '-cpp ' + cpp_files_path;

    } else if(flow.target_js) {

            //js the file can go straight out to the dest path
        var out_file = path.join(flow.project.paths.output, project.source.project.app.name+'.js');
        out_file = path.relative(flow.project.root, out_file);

        values += split + '-js ' + out_file;

    } //web

    return values;

} //target

    //bakes the whole project into a usable complete hxml
exports.hxml = function(flow, project, with_compile, split) {

    split = split || '\n';

    var hxml_ = '-main ' + flow.config.build.boot + split;


        //since we want to manually invoke the builds
        //with custom configs we tell haxe only to generate
        //the files, not invoke the post generate compiler (i.e hxcpp for cpp, etc)
    if(!with_compile) {
        hxml_ += '-D no-compilation' + split;
    }

    hxml_ += exports.defines(flow, project, split);
    hxml_ += exports.flags(flow, project, split);
    hxml_ += exports.target(flow, project, split);


    return hxml_;

} //hxml