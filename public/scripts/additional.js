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
    var shouroffset = Math.floor(offset);
    var sminoffset = 60*(offset - shouroffset);
    return [shouroffset, sminoffset];
}

module.exports = {
    // Time Converter Client
    timeConverter: function timeConverter(time,chouroffset,cminoffset){
        var dt = new Date(time);
        // Change Server Time to UTC
        var stoffset = getTimeOffset()
        dt.setHours(dt.getHours()-stoffset[0]);
        dt.setMinutes(dt.getMinutes()-stoffset[1]);
        // Change UTC to Client Time
        dt.setHours(dt.getHours()+chouroffset);
        dt.setMinutes(dt.getMinutes()+cminoffset);
        var y = dt.getFullYear().toString()
        var mo = getMonth(dt.getMonth());
        var d = fixdatetime(dt.getDate());
        var h = fixdatetime(dt.getHours());
        var m = fixdatetime(dt.getMinutes());
        return mo+' '+d+', '+y+' - '+h+':'+m;
    },
    // Time Converter SQL to HTML
    timeConverterSQLtoHTML: function timeConverterSQLtoHTML(time,chouroffset,cminoffset){   
        var dt = new Date(time);
        // Change Server Time to UTC
        var stoffset = getTimeOffset();
        dt.setHours(dt.getHours()-stoffset[0]);
        dt.setMinutes(dt.getMinutes()-stoffset[1]);
        // Change UTC to Client Time
        dt.setHours(dt.getHours()+chouroffset);
        dt.setMinutes(dt.getMinutes()+cminoffset);
        var y = dt.getFullYear().toString();
        var mo = fixdatetime(dt.getMonth()+1);
        var d = fixdatetime(dt.getDate());
        var h = fixdatetime(dt.getHours());
        var m = fixdatetime(dt.getMinutes());
        return y+'-'+mo+'-'+d+'T'+h+':'+m;
    },
    // Time Converter HTML to SQL
    timeConverterHTMLtoSQL: function timeConverterHTMLtoSQL(time,chouroffset,cminoffset){
        var y = time.substring(0,4);
        var mo = time.substring(5,7);
        var d = time.substring(8,10);
        var h = time.substring(11,13);
        var m = time.substring(14,16);
        var localdate = y+'-'+mo+'-'+d+'T'+h+':'+m+':00.000Z';
        var utc = new Date(localdate);
        //Change Local Time to UTC+0 
        utc.setHours(utc.getHours() - chouroffset); 
        utc.setMinutes(utc.getMinutes() - cminoffset);
        return utc;
    },
    // Check Status
    checktasktimeStatus: function checktasktimeStatus(start_date, end_date){
        var current_date = new Date();
        if(end_date<current_date)
            return 'Missed'
        else if(start_date>current_date)
            return 'Soon'
        else (start_date<=current_date && current_date<=end_date)
            return 'Today'
    }
}
