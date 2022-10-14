const local = process.cwd().split('/');
const NAME = local[local.length-1]
const config = require('../config')
const sversion = require('../../package.json').version
const sname = require('../../package.json').name

module.exports = [
    {
        name: 'Name',
        default: NAME
    },
    {
        name: 'Version',
        default: '1.0.0'
    },
    {
        name: 'Description',
    },
    {
        name: 'Author',
    },
    {
        name: 'License',
        default: 'MIT'
    },
    {
        name: 'Main',
        default: config.srcDir
    },
    {
        name: 'Index',
        default: config.index
    },
    {
        name: 'Dest',
        default: config.destDir
    },
    {
      name: 'SVersion',
      default: sversion
    },
    {
      name: 'SName',
      default: sname
    }
];
