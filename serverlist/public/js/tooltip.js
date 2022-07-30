// https://github.com/wwwebbify/JS-Simple-Tooltip

'use strict';

/*
 *
 *
 * Configurable options
 * Yoffset (number) = The offset in px you want from your mouse (measured from top of screen, so -10 is 10px above your mouse)
 *bindToScreen (boolean) = sets the global 'bindToScreen' feature, forces tooltip to stay on screen when mouse is too close to the edge.
 *
 * HTML Usage
 * data-tooltip="tooltip content"
 * data-bindToScreen="true" (sets element specific 'bindToScreen' feature (only turns on when global is false, will not turn off when global is true)
 *
 *
 * */

(function Tooltips() {
    var Yoffset = -7;
    var bindToScreen = false;

    //Calculates the style for the tooltip
    function tooltipLocation(e) {
        var style = {
            'position': 'fixed',
            'top': this.parentNode.bindToScreen ? e.clientY - this.scrollHeight + Yoffset <= 0 ? 0 : e.clientY - this.scrollHeight + Yoffset + 'px' : e.clientY - this.scrollHeight + Yoffset + 'px',
            'left': this.parentNode.bindToScreen ? e.clientX - this.scrollWidth / 2 <= 0 ? this.scrollWidth / 2 + 'px' : e.clientX + this.scrollWidth / 2 >= window.innerWidth ? window.innerWidth - this.scrollWidth / 2 + 'px' : e.clientX + 'px' : e.clientX + 'px',
            'transform': 'translate(-50%, 0)',
            'z-index': 1000000
        };
        var str = '';

        for (var item in style) {
            str += item + ':' + style[item] + ';';
        }

        return str;
    }

    //Calculates the style for the pointer
    function pointerLocation() {
        var style = {
            'background': 'inherit',
            'padding': '0',
            'position': 'absolute',
            'bottom': '0',
            'left': '0',
            'right': '0',
            'margin': '-5px auto',
            'border': 'inherit',
            'border-width': '5px',
            'border-top-color': 'transparent',
            'border-left-color': 'transparent',
            'height': '0',
            'width': '0',
            'transform': 'rotateZ(45deg)',
            'z-index': '-1'
        };
        var str = '';

        for (var item in style) {
            str += item + ':' + style[item] + ';';
        }

        return str;
    }

    //Creates new tooltip and attaches it to the DOM, adds event listener 'mousemove'
    function makeTooltip(e) {

        if (this.hasTooltip === false) {
            //Check for hasTooltip control

            //create main tool tip
            var tip = this.tip = document.createElement('tooltip');
            this.appendChild(tip);

            tip.className = 'tooltip';
            tip.innerText = this.getAttribute('data-tooltip');
            tip.setAttribute('style', tooltipLocation.call(this.tip, e));

            //create pointer
            var pointer = tip.pointer = document.createElement('pointer');

            pointer.setAttribute('style', pointerLocation.call(this.pointer));

            tip.appendChild(pointer);
        }
        this.addEventListener('mousemove', moveTooltip);
        this.hasTooltip = true; //Deactivates makeTooltip()
    }

    //Deletes the tooltip, removes event listener 'mousemove'
    function deleteTooltip() {
        var tip = this.querySelector('.tooltip');
        tip.parentNode.removeChild(tip);
        this.removeEventListener('mousemove', moveTooltip);

        this.hasTooltip = false; //Activates makeTooltip()
    }

    function moveTooltip(e) {
        this.tip.setAttribute('style', tooltipLocation.call(this.tip, e));
    }

    //Find all elements with the data-tooltip attribute
    var tooltipable = document.querySelectorAll('[data-tooltip]');

    //Loop through the tooltipable elements, determine bindToScreen option, add event listeners, and set hasTooltip control
    tooltipable.forEach(function(el) {
        el.bindToScreen = bindToScreen ? true : el.getAttribute('data-bindToScreen') === 'true';
        el.addEventListener('mouseover', makeTooltip);
        el.addEventListener('mouseleave', deleteTooltip);
        el.hasTooltip = false; //Activates makeTooltip()
    });
})();