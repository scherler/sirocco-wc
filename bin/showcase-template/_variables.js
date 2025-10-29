const local = process.cwd().split('/');
const NAME = local[local.length-1]
const config = require('../config')

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
        default: 'Showcase hello world app for sirocco-wc'
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
        default: config.destDir || 'dist'
    },
    {
      name: 'SVersion',
      default: config.sversion
    },
    {
      name: 'Prefix',
      default: config.prefix
    },
    {
      name: 'SName',
      default: config.sname
    }
];
