function _0x26fb(_0x49e142, _0x5094cf) {
    const _0x1dfbad = _0x1dfb();
    return _0x26fb = function(_0x26fbbd, _0x1b2541) {
            _0x26fbbd = _0x26fbbd - 0xf6;
            let _0x2951c7 = _0x1dfbad[_0x26fbbd];
            return _0x2951c7;
    }, _0x26fb(_0x49e142, _0x5094cf);
}
const _0x33b4f1 = _0x26fb;

function _0x1dfb() {
    const _0x1c8b12 = ['4805vIozqV', 'shortenedUrl', '4AzwTxm', '2621848JDthNG', 'data',
            '6b7cc5685313a6751878a68b2eb71aea11bcfe49', 'get', 'exports', 'axios', '&url=', '5086840dOhklU',
            '2xjXqhP', '295645YPzeJs', '114zbublN', '1021758QAffjP', '684064nuiMnI',
            'https://link.imtaqin.id/api?api=', '3873636RmeALE'
    ];
    _0x1dfb = function() {
            return _0x1c8b12;
    };
    return _0x1dfb();
}(function(_0x23fa8f, _0x52057a) {
    const _0x4d289b = _0x26fb,
            _0x18fd3a = _0x23fa8f();
    while (!![]) {
            try {
                    const _0x1bcdd6 = parseInt(_0x4d289b(0x106)) / 0x1 * (parseInt(_0x4d289b(0xf8)) / 0x2) +
                            parseInt(_0x4d289b(0xf7)) / 0x3 * (parseInt(_0x4d289b(0xfd)) / 0x4) + -parseInt(
                                    _0x4d289b(0xfb)) / 0x5 * (parseInt(_0x4d289b(0xf6)) / 0x6) + -parseInt(
                                    _0x4d289b(0x107)) / 0x7 + parseInt(_0x4d289b(0xfe)) / 0x8 + -parseInt(
                                    _0x4d289b(0xfa)) / 0x9 + -parseInt(_0x4d289b(0x105)) / 0xa;
                    if (_0x1bcdd6 === _0x52057a) break;
                    else _0x18fd3a['push'](_0x18fd3a['shift']());
            }
            catch (_0x299e6f) {
                    _0x18fd3a['push'](_0x18fd3a['shift']());
            }
    }
}(_0x1dfb, 0x5621f));
const axios = require(_0x33b4f1(0x103));
async function shortenUrl(_0x13bcb9) {
    const _0x110f5d = _0x33b4f1,
            _0x5db5eb = _0x110f5d(0x100),
            _0x585682 = _0x110f5d(0xf9) + _0x5db5eb + _0x110f5d(0x104) + encodeURIComponent(_0x13bcb9);
    try {
            const _0x138c1f = await axios[_0x110f5d(0x101)](_0x585682),
                    _0x46c77c = _0x138c1f[_0x110f5d(0xff)][_0x110f5d(0xfc)];
            return _0x46c77c;
    }
    catch (_0x521a0a) {
            console['error'](_0x521a0a);
    }
}
module[_0x33b4f1(0x102)] = shortenUrl;
