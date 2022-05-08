const FixDateTypes = (time) => {
  if (time < 10) return "0" + time.toString()
  else return time.toString()
}

const GetMonth = (month) => {
  let mts = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"]
  return mts[month]
}

const TimezoneOffset = () => {
  const timezoneoffset = new Date().getTimezoneOffset()
  const offset = (-(timezoneoffset / 60)).toString().split(".")
  const houroffset = parseInt(offset[0])
  const minoffset = typeof offset[1] === "undefined"? 0:60*parseFloat("."+offset[1])*(timezoneoffset>0? -1:1)
  return [houroffset, minoffset]
}

const FixUTCtoServertoClientTimezoneOffset = (time,chouroffset,cminoffset) => {
  var dt = new Date(time)
  // Change Server Time to UTC
  var stoffset = TimezoneOffset()
  dt.setHours(dt.getHours() - stoffset[0])
  dt.setMinutes(dt.getMinutes() - stoffset[1])
  // Change UTC to Client Time
  dt.setHours(dt.getHours() + chouroffset)
  dt.setMinutes(dt.getMinutes() + cminoffset)
  return dt
}

const FixUTCtoClientTimezoneOffset = (time) => {
  var dt = new Date(time)
  var ctoffset = TimezoneOffset()
  // Change UTC to Client Time
  dt.setHours(dt.getHours() + ctoffset[0])
  dt.setMinutes(dt.getMinutes() + ctoffset[1])
  return dt
}

/////////////////////////////////////////////////////////////////////////////////////////
const UTCSQLtoLocal = (time) => {
  var dt = new Date(time)
  const y = dt.getFullYear().toString()
  const mo = GetMonth(dt.getMonth())
  const d = FixDateTypes(dt.getDate())
  const h = FixDateTypes(dt.getHours())
  const m = FixDateTypes(dt.getMinutes())
  return mo + " " + d + ", " + y + " - " + h + ":" + m
}
const UTCSQLtoLocalHTML = (time) => {
  var dt = new Date(time)
  const y = dt.getFullYear().toString()
  const mo = FixDateTypes(dt.getMonth() + 1)
  const d = FixDateTypes(dt.getDate())
  const h = FixDateTypes(dt.getHours())
  const m = FixDateTypes(dt.getMinutes())
  return y + "-" + mo + "-" + d + "T" + h + ":" + m
}
// Time Converter HTML to SQL (timeConverterHTMLtoSQL)
const LocalHTMLtoServerUTCSQL = (time, chouroffset, cminoffset) => {
  const y = time.substring(0, 4)
  const mo = time.substring(5, 7)
  const d = time.substring(8, 10)
  const h = time.substring(11, 13)
  const m = time.substring(14, 16)
  const localdate = y + "-" + mo + "-" + d + "T" + h + ":" + m + ":00.000Z"
  var utc = new Date(localdate)
  // Local to UTC
  utc.setHours(utc.getHours() - parseInt(chouroffset))
  utc.setMinutes(utc.getMinutes() - parseInt(cminoffset))
  return utc
}
// Check Status (checktasktimeStatus)
const CheckTimeStatus = (current_date, start_date, end_date) => {
  if (end_date < current_date) return "Missed"
  else if (start_date > current_date) return "Soon"
  else return "Ongoing"
}

module.exports = {
  UTCSQLtoLocal,
  UTCSQLtoLocalHTML,
  LocalHTMLtoServerUTCSQL,
  CheckTimeStatus,
  TimezoneOffset,
}
