import moment from "moment-timezone"

//https://stackoverflow.com/a/8016205
function dateFromUnix(seconds)
{
    var d = new Date(0);
    d.setUTCSeconds(seconds);
    return d;
}

function formatHour(hour24)
{
    var ampm = " AM";

    var hourNum = hour24;

    if (hourNum >= 12)
    {
        hourNum -= 12;
        ampm = " PM";
    }

    if (hourNum === 0)
    {
        hourNum = 12;
    }

    return hourNum + ampm;
} 

function momentFromUnix(utcSeconds, timezone)
{
    if (timezone == undefined)
    {
        return moment(dateFromUnix(utcSeconds)); 
    }

    return moment(dateFromUnix(utcSeconds)).tz(timezone);
}

export default
{
    formatHour: formatHour,
    dateFromUnix: dateFromUnix,
    momentFromUnix: momentFromUnix
}