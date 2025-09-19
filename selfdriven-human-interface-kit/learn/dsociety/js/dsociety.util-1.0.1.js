
function hex2buffer(str)
{
    return new Uint8Array(str.match(/../g).map(h=>parseInt(h,16))).buffer
}

function chars2Text(chars)
{
    var arrayChars = chars.split(',');
    var text = String.fromCharCode.apply(null, arrayChars);
    return text;
}