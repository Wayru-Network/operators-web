import moment from "moment";
import Stripe from "stripe";

export const getNextPaymentAttempt = (props: Stripe.Invoice) => {
    // check if there is a current trial period
    if (moment().isBefore(moment(props.period_end * 1000).add(1, "day"))) {
        return moment(props.period_end * 1000).add(1, "day").format("MMM DD, YYYY");
    } else if (props.next_payment_attempt) {
        return moment(props.next_payment_attempt * 1000).format("MMM DD, YYYY");
    } else {
        return "N/A";
    }
};