const fs = require('fs');
const zlib = require('zlib');

function parseTexMesh(str) {
    const arr = str.split('\n').map((a) => a.split(' '));
    let i=0, j;
    let nverts, ntris;
    let p = [];
    let t = [];

    nverts = parseInt(arr[0][0]);
    ntris = parseInt(arr[0][1]);
    i++;
    for(j=0;j<nverts;j++) {
        p.push(arr[i].map((o) => parseFloat(o)));
        i++;
    }
    for(j=0;j<ntris;j++) {
        t.push(arr[i].map((o) => parseInt(o)).slice(1,4));
        i++;
    }

    console.log(nverts, ntris);
    console.log(p.slice(0,10));
    console.log(t.slice(0,10));

    return {p: p, t: t};
}

function parseTexData(str) {
    const arr = str.split('\n').map((a) => a.split(' '));
    let i=0, j;
    let nverts, ndim;
    let d = [];

    nverts = parseInt(arr[0][0]);
    ndim = parseInt(arr[0][1])|1;
    i++;
    for(j=0;j<nverts;j++) {
        d.push(arr[i].map((o) => parseFloat(o)));
        i++;
    }

    console.log(nverts, ndim);
    console.log(d.slice(0,10));

    return d;
}

function encodeTexMesh(mesh) {
    let txstr = `${mesh.p.length} ${mesh.t.length}\n`;
    txstr += mesh.p.map((o) => o.join(' ')).join('\n');
    txstr += mesh.t.map((o) => o.join(' ')).join('\n');

    return txstr;
}

function encodeTexData(data) {
    let txstr = `${data.length} ${data[0].length|1}\n`;
    txstr += data.map((o) => o.join(' ')).join('\n');

    return txstr;
}

exports.loadTexMesh = function loadTexMesh(path) {
    const tx = fs.readFileSync(path).toString();
    const mesh = parseTexMesh(tx);

    return mesh;
}

exports.loadTexData = function loadTexData(path) {
    const tx = fs.readFileSync(path).toString();
    const data = parseTexData(tx);

    return data;
}

exports.loadTexDataGz = function loadTexDataGz(path) {
    const txgz = fs.readFileSync(path);

    var pr = new Promise((resolve, reject) => {
        zlib.gunzip(txgz, (err, tx) => {
            if(err) {
                reject(err);

                return;
            }
            const data = parseTexData(tx.toString());
            resolve(data);
        });
    });

    return pr;
}

exports.saveTexMesh = function saveTexMesh(mesh, path) {
    const txstr = encodeTexMesh(mesh);
    fs.writeFileSync(path, txstr);
}

exports.saveTexData = function saveTexData(data, path) {
    const txstr = encodeTexData(data);
    fs.writeFileSync(path, txstr);
}

exports.saveTexMeshGz = function saveTexMeshGz(mesh, path) {
    const txstr = encodeTexMesh(mesh);
    const pr = new Promise((resolve, reject) => {
        zlib.gzip(txstr, (err, txgz) => {
            if(err) {
                reject(err);

                return;
            }
            fs.writeFileSync(path, txgz);
            resolve("txt.gz mesh file saved");
        });
    });

    return pr;
}

exports.saveTexDataGz = function saveTexDataGz(data, path) {
    const txstr = encodeTexData(data);
    const pr = new Promise((resolve, reject) => {
        zlib.gzip(txstr, (err, txgz) => {
            if(err) {
                reject(err);

                return;
            }
            fs.writeFileSync(path, txgz);
            resolve("txt.gz data file saved");
        });
    });

    return pr;
}
