// create new _blank anchor and trigger ctrl-click event to open in background-tab
function open_in_new_tab(url) {
    const a = Object.assign(document.createElement('a'), { href: url })
    const evt = new MouseEvent("click", {
        ctrlKey: true
    })
    a.dispatchEvent(evt);
}

// get first tr parent of element
function get_tr(element) {
    while (element.nodeName !== 'TR') {
        element = element.parentNode
        if (element.nodeName === 'HTML') {
            return undefined
        }
    }
    return element
}

// save target of middle mouse down
let middleMouseTarget
document.addEventListener('mousedown', e => {
    if (e.button === 1) {
        middleMouseTarget = get_tr(e.target)
        if (middleMouseTarget !== undefined &&
            middleMouseTarget.nodeName === 'TR') {
            // prevent middle mouse click scrolling on table rows
            e.preventDefault()
        }
    }
})

// middle mouse click = open in new tab
document.addEventListener('mouseup', e => {
    if (e.button === 1) {
        const element = get_tr(e.target)
            // skip if user moved mouse/scrolled or element undefined
        if (element !== middleMouseTarget || element === undefined) {
            return
        }
        e.preventDefault()
        open_in_new_tab(element.dataset.href)
    }
})