
function fixdatetime(time){
    if(time<10)
        return '0'+time.toString();
    return time.toString();
}

function getMonth(month){
    let mts = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    return mts[month]
}

module.exports = {
    // Time Converter Client
    timeConverter: function timeConverter(time){
        var dt = new Date(time);
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
        return y+'-'+mo+'-'+d+'T'+h+':'+m+':00.000Z';
    },
    // Check Status
    checktasktimeStatus: function checktasktimeStatus(start_date, end_date){
        var startdate = new Date(start_date);
        var enddate = new Date(end_date);
        var currentdate = new Date();
        currentdate.setHours(currentdate.getHours() + 8);
        if(enddate<currentdate)
            return 'Missed'
        if(startdate>currentdate)
            return 'Soon'
        if(startdate<=currentdate && currentdate<=enddate)
            return 'Today'
    }
}
