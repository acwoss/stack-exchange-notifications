/*
 * StackExchangeNotifications 1.0.0
 * Copyright (c) 2016 Guilherme Nascimento (brcontainer@yahoo.com.br)
 * Released under the MIT license
 *
 * https://github.com/brcontainer/stack-exchange-notification
 */

(function(doc, browser) {
    "use strict";

    var running = false;

    function isHide(elem)
    {
        var prop = window.getComputedStyle(elem, null);

        return prop.getPropertyValue("display") === "none" ||
                prop.getPropertyValue("visibility") === "hidden";
    }

    function updateStates(mutations)
    {
        mutations.forEach(function (mutation) {
            var type, checkTab, el = mutation.target;

            if (/(^|\s)unread\-count($|\s)/.test(el.className)) {
                if (/(^|\s)icon\-achievements($|\s)/.test(el.parentNode.className)) {
                    type = "achievements";
                } else if (/(^|\s)icon\-inbox($|\s)/.test(el.parentNode.className)) {
                    type = "inbox";
                }

                var data = isHide(el) ? 0 : parseInt(el.textContent);

                if (type && browser && browser.runtime && browser.runtime.sendMessage) {
                    browser.runtime.sendMessage({
                        "data": data,
                        "clear": type
                    }, function(response) {});
                }
            }
        });
    }

    function applyEvents()
    {
        if (running) {
            return;
        }

        var networkSE = doc.querySelector(".network-items");

        if (!networkSE) {
            return;
        }

        running = true;

        var observer = new MutationObserver(updateStates);

        observer.observe(networkSE, {
            "subtree": true,
            "childList": true,
            "attributes": true
        });
    }

    if (/interactive|complete/i.test(doc.readyState)) {
        applyEvents();
    } else {
        doc.addEventListener("DOMContentLoaded", applyEvents);
        window.addEventListener("onload", applyEvents);
    }
})(document, chrome||browser);
