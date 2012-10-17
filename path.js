

define(function(require, exports, module) {

    // Return the a string path produced by composing an existing path string, 
    // new path fragment string, resolving '..' as well as removing redundant 
    // slashes (i.e. 'a//b')

        exports.composePath = function(old_path, new_path)
        {
            if (new_path[0] == '/')
                old_path = "";

            var parts = old_path == "" ? [] : old_path.split('/');
            parts.push.apply(parts, new_path.split('/'));

            for (var i = parts.length - 1; i >= 0; --i) {
                if (parts[i] == '..') {
                    parts.splice(i-1,2);
                }
                else if (parts[i] == "") {
                    parts.splice(i,1);
                }
            }

            return "/" + parts.join("/");
        }
});

//console.log(composePath("/users/armen//src", "../downloads/foo"));
