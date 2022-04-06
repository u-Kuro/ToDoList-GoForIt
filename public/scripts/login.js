// Send Client's Timezone
var offset = ((new Date().getTimezoneOffset())*-1)/60
var houroffset = Math.floor(offset);
var minoffset = 60*(offset - houroffset);
document.getElementById('ctoh').value = houroffset;
document.getElementById('ctom').value = minoffset;