const fs = require('fs');
const path = require('path');



module.exports = (newID) => {
    return new Promise((resolve, reject) => {


        const srcpath = path.resolve(process.cwd(), 'ios/');

        console.log("Searching for ios directory", srcpath);

        var folders;
        try {
            folders = fs.readdirSync(srcpath)
                .filter(file => fs.statSync(path.join(srcpath, file)).isDirectory())

        } catch (e) {
            reject(srcpath, 'directory not found, re you sure you are in a react native project?');
        }


        const folder = folders && folders.find((f)=>f.indexOf('.xcodeproj')>-1).replace('.xcodeproj', '');
        const plist = folders && path.resolve(process.cwd(), 'ios/' + folder + '/Info.plist');

        console.log('Reading', plist);
        if (!plist) {
            reject('Are you sure you are in a react native project?');
        }

        var changes = {};

        fs.readFile(plist, 'utf8', (err, markup) => {
            if (err == null) {
                const bundleId = markup.match(/<key>CFBundleIdentifier<\/key>[\s\S.]*?<string>(.*)<\/string>/);
                if (bundleId) {
                    console.log('Found iOS bundle ID', bundleId[1]);
                    changes[plist] = markup.replace(/(<key>CFBundleIdentifier<\/key>[\s\S.]*?<string>)(.*)(<\/string>)/, '\$1' + newID + '\$3');
                } else {
                    reject('Could not detect ios app id from plist')
                }
                resolve(changes);
            } else {
                reject('Are you sure you are in a react native project?');
            }
        });
    })
}