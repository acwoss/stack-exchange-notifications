/*
 * StackExchangeNotifications 0.0.9
 * Copyright (c) 2016 Guilherme Nascimento (brcontainer@yahoo.com.br)
 * Released under the MIT license
 *
 * https://github.com/brcontainer/stack-exchange-notification
 */


(function (doc) {
    var applyEvents = function () {
        var networkSE = doc.querySelector(".network-items");

        var observer = new MutationObserver(function (mutations) {
            mutations.forEach(function (mutation) {
                var type, el = mutation.target;

                if (/(^|\s)unread\-count($|\s)/.test(el.className)) {
                    if (/(^|\s)icon\-achievements($|\s)/.test(el.parentNode.className)) {
                        type = "achievements";
                    } else if (/(^|\s)icon\-inbox($|\s)/.test(el.parentNode.className)) {
                        type = "inbox";
                    }
                }

                if (type) {
                    chrome.runtime.sendMessage({
                        "data": parseInt(el.textContent),
                        "clear": type
                    }, function(response) {});
                }
            });
        });

        observer.observe(networkSE, {
            subtree: true,
            childList: true,
            attributes: true
        });
    };

    if (/interactive|complete/i.test(doc.readyState)) {
        applyEvents();
    } else {
        doc.addEventListener("DOMContentLoaded", applyEvents);
    }
})(document);
