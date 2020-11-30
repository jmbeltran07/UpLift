
let tripInfo = {}
let onChangeCallBack = {}
let checkout = false
let container = "#up-pay-monthly-container"

const initializeUplift = () => {
    if (!window.UpLift) {
        ; (function (u, p, l, i, f, t, b, j) { u['UpLiftPlatformObject'] = f; u[f] = u[f] || function () { (u[f].q = u[f].q || []).push(arguments) }, u[f].l = 1 * new Date(); b = p.createElement(l), j = p.getElementsByTagName(l)[0]; b.async = 1; b.src = i + '?id=' + t; j.parentNode.insertBefore(b, j); var o = window.location.host.match(/[w-]+.w{2,3}(:d+)?$/); if (o) o = o[0]; u[f]('create', t, o) })(window, document, 'script', '//cdn.uplift-platform.com/a/up.js', 'up', 'UP-27021310-19')
    } else {
        window.upReady()
    }
    tripInfo = {}
    onChangeCallBack = {}
    checkout = false
}



const updateUpNodes = ({ buildTripInfo = null, newOnChangeCallBack = null, newCheckout = false, newContainer = "#up-pay-monthly-container" } = {}) => {
    // update tripInfo object
    if (buildTripInfo) {
        const newTripInfo = buildTripInfo()
        tripInfo = { ...tripInfo, ...newTripInfo }
    }

    // if user is providing new values we add them so when we load again, we have updated checkout values
    if (newCheckout && newOnChangeCallBack) {
        checkout = newCheckout
        onChangeCallBack = newOnChangeCallBack
    }
    // if there is a new container id, set it
    if (newContainer) {
        container = newContainer
    }

    // in case window.UpLift is not there, we load it, if there is, we call upReady()
    if (!window.UpLift) {
        ; (function (u, p, l, i, f, t, b, j) { u['UpLiftPlatformObject'] = f; u[f] = u[f] || function () { (u[f].q = u[f].q || []).push(arguments) }, u[f].l = 1 * new Date(); b = p.createElement(l), j = p.getElementsByTagName(l)[0]; b.async = 1; b.src = i + '?id=' + t; j.parentNode.insertBefore(b, j); var o = window.location.host.match(/[w-]+.w{2,3}(:d+)?$/); if (o) o = o[0]; u[f]('create', t, o) })(window, document, 'script', '//cdn.uplift-platform.com/a/up.js', 'up', 'UP-27021310-19')
    } else {
        window.upReady()
    }
}

window.upReady = function () {
    if (checkout && onChangeCallBack) {
        initPayMonthlyCheckout(onChangeCallBack, container)
    } else {
        initPayMonthly()
    }
    window.Uplift.Payments.load(tripInfo);
}

function initPayMonthly() {
    window.Uplift.Payments.init({
        apiKey: "saUHdlwUzG4ZZb4k2L4Yl1SSzI3OrUVZ35AdKRjl",
        locale: "en-US",
        currency: "USD"
    });
}

function initPayMonthlyCheckout(onChangeCallBack, container) {
    window.Uplift.Payments.init({
        apiKey: "saUHdlwUzG4ZZb4k2L4Yl1SSzI3OrUVZ35AdKRjl",
        locale: "en-US",
        currency: "USD",
        checkout: true,
        container: container,
        onChange: onChangeCallBack
    });
}

function sendErrorToUplift(errorMsg, errorType) {
    window.Uplift.Payments.error(errorMsg, errorType);
}

function confirm(confirmationId) {
    window.Uplift.Payments.confirm(confirmationId);
}

export { updateUpNodes, sendErrorToUplift, confirm }
export default initializeUplift