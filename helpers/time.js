const production = true

const FixDateTypes = (time) => {
  if (time < 10) return "0" + time.toString()
  else return time.toString()
}

const GetMonth = (month) => {
  let mts = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"]
  return mts[month]
}

const GetDay = (day) => {
  let dyts = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"]
  return dyts[day]
}

const TimezoneOffset = () => {
  const timezoneoffset = new Date().getTimezoneOffset()
  const offset = (-(timezoneoffset / 60)).toString().split(".")
  const houroffset = parseInt(offset[0])
  const minoffset = typeof offset[1] === "undefined"? 0:60*parseFloat("."+offset[1])*(timezoneoffset>0? -1:1)
  return [houroffset, minoffset]
}

const UTCtoLocal = (time) => {
  const ctoffset = TimezoneOffset()
  const dt = new Date(time)
  dt.setHours(dt.getHours() + ctoffset[0])
  dt.setMinutes(dt.getMinutes() + ctoffset[1])
  return dt
}

const LocaltoUTC = (time) => {
  const ctoffset = TimezoneOffset()
  const dt = new Date(time)
  dt.setHours(dt.getHours() - ctoffset[0])
  dt.setMinutes(dt.getMinutes() - ctoffset[1])
  return dt
}

/////////////////////////////////////////////////////////////////////////////////////////
const UTCSQLtoLocal = (time) => {
  const dt = (new Date(time))
  const y = dt.getFullYear()
  const m = dt.getMonth()+1
  const dat = dt.getDate()
  const h = FixDateTypes(dt.getHours())
  const mi = FixDateTypes(dt.getMinutes())
  return m+"/"+dat+"/"+y+", "+h+":"+mi
}

const UTCSQLtoLocalHTML = (time) => {
  const ctoffset = TimezoneOffset()
  const dt = new Date(time)
  dt.setHours(dt.getHours()+ctoffset[0])
  dt.setMinutes(dt.getMinutes()+ctoffset[1])
  const ndt = dt.toJSON()
  return (typeof dt!=="undefined"?ndt.substring(0, ndt.length-8):"")
}
// Time Converter HTML to SQL (timeConverterHTMLtoSQL)
const LocalHTMLtoSQL = (time) => {
  const ctoffset = TimezoneOffset()
  const dt = new Date(time)
  if(!production){
    dt.setHours(dt.getHours()+ctoffset[0])
    dt.setMinutes(dt.getMinutes()+ctoffset[1])
  }
  return dt.toJSON()
}
// Check Status (checktasktimeStatus)
const CheckTimeStatus = (current_date, start_date, end_date) => {
  if (end_date < current_date) return "Missed"
  else if (start_date > current_date) return "Soon"
  else return "Ongoing"
}

module.exports = {
  UTCtoLocal,
  LocaltoUTC,
  UTCSQLtoLocal,
  UTCSQLtoLocalHTML,
  LocalHTMLtoSQL,
  CheckTimeStatus,
  TimezoneOffset,
}
