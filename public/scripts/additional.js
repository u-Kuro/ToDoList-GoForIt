const db = require("../../db").db;
function fixdatetime(time){
    if(time<10)
        return '0'+time.toString();
    return time.toString();
}

function getMonth(month){
    let mts = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    return mts[month]
}

function getTimeOffset(){
    var offset = ((new Date().getTimezoneOffset())*-1)/60
    var houroffset = Math.floor(offset);
    var minoffset = 60*(offset - houroffset);
    return [houroffset, minoffset];
}

module.exports = {
    // Time Converter Client
    timeConverter: function timeConverter(time){
        var dt = new Date(time);
        var offsets = getTimeOffset();
        dt.setHours(dt.getHours()-offsets[0]+8);
        dt.setMinutes(dt.getMinutes()+offsets[1])//Change to PH timeoffset
        var y = dt.getFullYear().toString()
        var mo = getMonth(dt.getMonth());
        var d = fixdatetime(dt.getDate());
        var h = fixdatetime(dt.getHours());
        var m = fixdatetime(dt.getMinutes());
        return mo+' '+d+', '+y+' - '+h+':'+m;
    },
    // Time Converter SQL to HTML
    timeConverterSQLtoHTML: function timeConverterSQLtoHTML(time){   
        var dt = new Date(time);
        var offsets = getTimeOffset();
        dt.setHours(dt.getHours()-offsets[0]+8);
        dt.setMinutes(dt.getMinutes()+offsets[1])//Change to PH timeoffset
        var y = dt.getFullYear().toString();
        var mo = fixdatetime(dt.getMonth()+1);
        var d = fixdatetime(dt.getDate());
        var h = fixdatetime(dt.getHours());
        var m = fixdatetime(dt.getMinutes());
        return y+'-'+mo+'-'+d+'T'+h+':'+m;
    },
    // Time Converter HTML to SQL
    timeConverterHTMLtoSQL: function timeConverterHTMLtoSQL(time){
        var y = time.substring(0,4);
        var mo = time.substring(5,7);
        var d = time.substring(8,10);
        var h = time.substring(11,13);
        var m = time.substring(14,16);
        var localdate = y+'-'+mo+'-'+d+'T'+h+':'+m+':00.000Z';
        var utc = new Date(localdate);
        var offsets = getTimeOffset();
        utc.setHours(utc.getHours() - offsets[0] - (8-offsets[0])); //Change PH Local Time to UTC+0 
        return utc;
    },
    // Check Status
    checktasktimeStatus: function checktasktimeStatus(start_date, end_date){
        var current_date = new Date();
        console.log(getTimeOffset())
        console.log(current_date)
        console.log(start_date)
        console.log(end_date)
        if(end_date<current_date)
            return 'Missed'
        else if(start_date>current_date)
            return 'Soon'
        else (start_date<=current_date && current_date<=end_date)
            return 'Today'
    }
}
