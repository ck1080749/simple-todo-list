const elNow = document.querySelector('.now-time')
const elAlarm = document.querySelector('.alarm-time')
elAlarm.addEventListener('change', onAlarmTextChange)

let time = moment()
let nowTime
let alarmTime

/** Set Time */
const now = moment(time).format('HH:mm:ss')
nowTime = now
elNow.innerText = now

const alarm = moment(time).add(5, 'seconds').format('HH:mm:ss')
alarmTime = alarm
elAlarm.value = alarm
document.getElementById("ABC").innerHTML = "456"
timer()

/** Now Time */
function timer() {
    time = moment().format('HH:mm:ss')

    /** Set Now */
    nowTime = time
    elNow.innerText = time

    setTimeout(() => {
        timer()
    }, 1000)
}

/**
 * Save To Global Variable,
 * Can't Read Dom In Minimize Status.
 * @param {event} event
 */
function onAlarmTextChange(event) {
    alarmTime = event.target.value
}