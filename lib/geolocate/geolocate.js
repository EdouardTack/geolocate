/* ========================================================================
 * @author Edouard Tack <edouard@tackacoder.fr>
 * Geolocate main version 1.0.0
 * Licensed under MIT (https://github.com/EdouardTack/geolocate/blob/master/LICENSE)
 * ======================================================================== */

"use strict";

var GeolocateLang = {};

/**
 * Instance of Geolocate object
 *
 * @param element jQuery element
 * @param options
 * @return void
 */
var Geolocate = function (options) {

    if (typeof jQuery === 'undefined') {
        console.error('Geolocate needs jQuery');
    }

    /**
     * List of options for Geolocate object
     *
     * @param int
     * cookieTimeout Time of life for cookie
     * @param string
     * cookieName Name of cookie
     * @param object
     * Google key + url
     * @param string
     * Geolocate Pop-up template
     * @param object
     * callbacks functions
     * ** beforeSend
     * ** success
     * ** error
     * ** decline
     * ** displayBox
     * ** closeBox
     * ** loading
     * ** unLoading
     */
    var defaults = {
        lang: 'fr',
        cookie: {
            timeout: 33696000000, // 13 months in milliseconds
            name: {
                choice: "GeolocateChoice",
                latlng: "GeolocateLatLng"
            }
        },
        google: {
            key: "",
            url: "https://www.googleapis.com/geolocation/v1/geolocate" // https://developers.google.com/maps/documentation/geolocation/intro?hl=fr
        },
        box: {
            close: true,
            timeout: 550,
            template: '<div id="geolocate-wrapper">[[geolocate-close]]<div class="geolocate-host">[[geolocate-host]]</div><div class="geolocate-question">[[geolocate-localisation]]</div><div class="geolocate-buttons"><button class="geolocate-button geolocate-accept" id="geolocate-accept" type="button">[[geolocate-accept]]</button><button class="geolocate-button geolocate-decline" id="geolocate-decline" type="button">[[geolocate-decline]]</button></div></div>',
            legalTemplate: '<div id="geolocate-legal-wrapper"><div class="geolocate-message">[[geolocate-message]]</div><div class="geolocate-buttons"><button class="geolocate-button geolocate-accept" id="geolocate-message-accept" type="button">[[geolocate-accept]]</button><button class="geolocate-button geolocate-decline" id="geolocate-message-decline" type="button">[[geolocate-decline]]</button></div></div>'
        },
        callbacks: {
            beforeSend: function() {
                geolocate.loading();
            },
            success: function(coord) {
                setTimeout(function() {
                    geolocate.unLoading();
                    geolocate.closeBox();
                }, 1250);
            },
            error: function(jqXHR, textStatus, errorThrown, geolocate) {
                geolocate.unLoading();
                alert(GeolocateLang[geolocate.settings.lang]['error']);
            },
            decline: function() {
                geolocate.closeBox();
            }
            // ,displayBox: function(wrapper) {}
            // ,closeBox: function(wrapper) {}
            // ,loading: function() {}
            // ,unLoading: function() {}
        }
    };
    var googleUrl = defaults.google.url

    this.settings = $.extend(defaults, options);

    if (options.google.key) this.settings.google.url = googleUrl + "?key=" + options.google.key;

    this.initialize();
    this.buttonsAction();
};

Geolocate.prototype = {

    /**
     * This is the initialize object
     * Create the Pop-up and display it
     * Condition if we didn't store the Cookie this.cookieName
     */
    initialize: function() {
        if (!this.hasConfirmChoice()) {
            var find = [
                '[[geolocate-host]]',
                '[[geolocate-localisation]]',
                '[[geolocate-accept]]',
                '[[geolocate-decline]]',
                '[[geolocate-close]]'
            ];
            var replace = [
                window.location.host,
                GeolocateLang[this.settings.lang]['localisation'],
                GeolocateLang[this.settings.lang]['accept'],
                GeolocateLang[this.settings.lang]['decline'],
                ((this.settings.box.close) ? '<div id="geolocate-close">&times;</div>' : '')
            ];

            $('body').append(this.assignTemplate(this.settings.box.template, find, replace));
            this.settings.box.wrapper = $('#geolocate-wrapper');
            this.displayBox();
        }
    },

    /**
     * Animate the Pop-up for display it
     *
     * @return void
     */
    displayBox: function() {
        var geolocate = this;

        if ((typeof geolocate.settings.callbacks.displayBox) === 'function') {
            geolocate.settings.callbacks.displayBox(geolocate.settings.box.wrapper);
        }
        else {
            setTimeout(function() {
                geolocate.settings.box.wrapper.animate(
                    {
                        top: '15px',
                        opacity: 1
                    },
                    {
                        duration: 750
                    }
                );
            }, geolocate.settings.box.timeout);
        }
    },

    /**
     * Animate the Pop-up for close it
     *
     * @return void
     */
    closeBox: function() {
        if ((typeof this.settings.callbacks.closeBox) === 'function') {
            this.settings.callbacks.closeBox(this.settings.box.wrapper);
        }
        else {
            if (typeof this.settings.box.wrapper !== 'undefined') {
                this.settings.box.wrapper.animate(
                    {
                        top: '-250px',
                        opacity: 0
                    },
                    {
                        duration: 350,
                        complete: function() {
                            this.settings.box.wrapper.remove();
                        }
                    }
                );
            }
        }
    },

    /**
     * show the loader effect
     *
     * @return void
     */
    loading: function() {
        if ((typeof this.settings.callbacks.loading) === 'function') {
            this.settings.callbacks.loading();
        }
        else {
            $('#geolocate-accept, #geolocate-message-accept, #geolocate-decline, #geolocate-message-decline').prop('disabled', true).addClass('geolocate-loader');
        }
    },

    /**
     * Hide the loader effect
     *
     * @return void
     */
    unLoading: function() {
        if ((typeof this.settings.callbacks.unLoading) === 'function') {
            this.settings.callbacks.unLoading();
        }
        else {
            $('#geolocate-accept, #geolocate-message-accept, #geolocate-decline, #geolocate-message-decline').prop('disabled', false).removeClass('geolocate-loader');
        }
    },

    /**
     * Store the different actions
     * Accept button
     * **
     * decline button
     * **
     *
     * @return void
     */
    buttonsAction: function() {
        this.settings.google.coord = {};
        var geolocate = this;

        $('body').on('click', '#geolocate-accept', function() {
            geolocate._accept();
        });

        $('body').on('click', '#geolocate-decline', function() {
            geolocate._decline();
        });

        $('body').on('click', '#geolocate-close', function() {
            geolocate.closeBox();
        });
    },

    /**
     * The accept method
     *
     * @return void
     */
    _accept: function() {
        var geolocate = this;

        $.ajax({
            url: geolocate.settings.google.url,
            method: 'POST',
            dataType: 'json',
            beforeSend: function() {
                geolocate.settings.callbacks.beforeSend();
            },
            success: function(data) {
                geolocate.deleteCookie(geolocate.settings.cookie.name.choice);
                // We write that the user accept the geolocation
                geolocate.setCookie(geolocate.settings.cookie.name.choice, 'accept');

                // Store the location to the object
                geolocate.settings.google.coord.accuracy = data.accuracy;
                geolocate.settings.google.coord.lat = data.location.lat;
                geolocate.settings.google.coord.lng = data.location.lng;

                geolocate.deleteCookie(geolocate.settings.cookie.name.latlng);
                // Store the latlng that google send us
                geolocate.setCookie(geolocate.settings.cookie.name.latlng, geolocate.settings.google.coord.lat + ',' + geolocate.settings.google.coord.lng);

                // Callback the success function
                geolocate.settings.callbacks.success(geolocate.settings.google.coord);
            },
            error: function(jqXHR, textStatus, errorThrown) {
                geolocate.settings.callbacks.error(jqXHR, textStatus, errorThrown, geolocate);
            }
        });
    },

    /**
     * The decline method
     *
     * @return void
     */
    _decline: function() {
        var geolocate = this;

        geolocate.deleteCookie(geolocate.settings.cookie.name.choice);
        // We write that the user decline the geolocation
        geolocate.setCookie(geolocate.settings.cookie.name.choice, 'decline');

        // Callback the decline function
        geolocate.settings.callbacks.decline();
    },

    /**
     * To update the latlng position
     *
     * @param jQuery element
     * @param function success
     * @param function beforeSend
     *
     * @return void
     */
    update: function(element, success, beforeSend, error) {
        var geolocate = this;

        if (geolocate.getCookie('GeolocateChoice') == 'accept') {
            element.on('click', function() {
                $.ajax({
                    url: geolocate.settings.google.url,
                    method: 'POST',
                    dataType: 'json',
                    beforeSend: function() {
                        if ((typeof beforeSend) == 'function') {
                            beforeSend(geolocate);
                        }
                    },
                    success: function(data) {
                        // Store the location to the object
                        geolocate.settings.google.coord.accuracy = data.accuracy;
                        geolocate.settings.google.coord.lat = data.location.lat;
                        geolocate.settings.google.coord.lng = data.location.lng;

                        geolocate.deleteCookie(geolocate.settings.cookie.name.latlng);
                        // Store the latlng that google send us
                        geolocate.setCookie(geolocate.settings.cookie.name.latlng, geolocate.settings.google.coord.lat + ',' + geolocate.settings.google.coord.lng);

                        // Callback the success function
                        if ((typeof success) == 'function') {
                            success(geolocate);
                        }
                    },
                    error: function(jqXHR, textStatus, errorThrown) {
                        if ((typeof error) == 'function') {
                            error(jqXHR, textStatus, errorThrown, geolocate);
                        }
                        else {
                            geolocate.settings.callbacks.error(jqXHR, textStatus, errorThrown, geolocate);
                        }
                    }
                });
            });
        }
        else {
            element.hide();
        }
    },

    /**
     * return true if the user confirm or decline the geolocate option
     * return false else
     *
     * @return bool
     */
    hasConfirmChoice: function() {
        if (document.cookie.indexOf(this.settings.cookie.name.choice + "=accept") > -1) {
            return true;
        }
        else if(document.cookie.indexOf(this.settings.cookie.name.choice + "=decline") > -1) {
            return true;
        }

        return false;
    },

    /**
     * Get a cookie
     *
     * @param string name of cookie
     *
     * @return string cookie value
     */
    getCookie: function(name) {
        var name = name + "=";
        var ca = document.cookie.split(';');
        var i = 0;
        for(i;i < ca.length;i++) {
            var c = ca[i];
            while (c.charAt(0) == ' ') {
                c = c.substring(1);
            }
            if (c.indexOf(name) == 0) {
                return c.substring(name.length, c.length);
            }
        }

        return "";
    },

    /**
     * Store a cookie
     *
     * @param string name of cookie
     * @param string value of cookie
     *
     * @return void
     */
    setCookie: function(name, value) {
        var date = new Date();
        date.setTime(date.getTime() + this.settings.cookie.timeout);

        document.cookie = name + "=" + value + ";expires=" + date.toGMTString() + ";path=/";
    },


    /**
     * Delete a cookie
     *
     * @param string name of cookie
     *
     * @return void
     */
    deleteCookie: function(name) {
        document.cookie = name + "=; expires=Thu, 01-Jan-1970 00:00:01 GMT; path=/";
    },

    /**
     * Create the template geoloc box with assigning tokens [[]] with values
     *
     * @param array
     * @param array
     *
     * @return string
     */
    assignTemplate: function(replaceString, find, replace) {
        for (var i = 0; i < find.length; i++) {
            replaceString = replaceString.replace(find[i], replace[i]);
        }

        return replaceString;
    },

    /**
     * Display a box message to ask if the user wants to change his choice
     *
     * @param jQuery wrapper
     *
     * @return string HTML
     */
    legal: function(element) {
        if (element.length > 0) {
            var geolocate = this;

            var GeolocateChoiceString = ((this.getCookie('GeolocateChoice') == 'accept') ? GeolocateLang[this.settings.lang]['legal-accept-message'] : (this.getCookie('GeolocateChoice') == 'decline') ? GeolocateLang[this.settings.lang]['legal-decline-message'] : '');
            var GeolocateLegalString = ((this.getCookie('GeolocateChoice')) ? GeolocateLang[this.settings.lang]['legal-message'] : GeolocateLang[this.settings.lang]['localisation']);
            var find = [
                '[[geolocate-message]]',
                '[[geolocate-accept]]',
                '[[geolocate-decline]]'
            ];

            var replace = [
                '<div id="geolocate-cookie-choice">' + GeolocateChoiceString + '</div>' + '<div id="geolocate-legal-message">' + GeolocateLegalString + '</div>' ,
                GeolocateLang[this.settings.lang]['legal-accept'],
                GeolocateLang[this.settings.lang]['legal-decline']
            ];

            element.append(this.assignTemplate(this.settings.box.legalTemplate, find, replace));

            element.on('click', '#geolocate-message-accept', function() {
                geolocate._accept();
                $('#geolocate-cookie-choice').html(GeolocateLang[geolocate.settings.lang]['legal-accept-message']);
            });

            element.on('click', '#geolocate-message-decline', function() {
                geolocate.loading();
                geolocate._decline();
                setTimeout(function() {
                    geolocate.unLoading();

                    $('#geolocate-cookie-choice').html(GeolocateLang[geolocate.settings.lang]['legal-decline-message']);
                }, 850);
            });

        }
    }

};
