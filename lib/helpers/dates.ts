import moment from "moment"
import { dateConstants } from "../constants/date"



export const formatMillisecondsToDate = (milliseconds: number) => {
    const { formatDate } = dateConstants
    return moment(Number(milliseconds) * 1000).format(formatDate)
}