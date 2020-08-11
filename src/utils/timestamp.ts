type TimeStamp = { seconds: number, nanos: number }

export const blockTime = (later:TimeStamp, earlier: TimeStamp): number => {
    const SECOND = 1000000000
    let seconds = later.seconds - earlier.seconds
    let nanos = later.nanos - earlier.nanos

    if (nanos < 0){
        seconds--
        nanos = SECOND + nanos
    }

    return parseFloat(`${seconds.toString()}.${nanos.toString()}`)
}