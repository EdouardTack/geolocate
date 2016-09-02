# jQuery Geolocate (version 1.0.0)

This is a simple Geolocation box made with Javascript and jQuery. It can be use instead of the navigator.geolocation. It's a flexible custom library.

To geolocate you, it use the googleapis geolocation

[Demonstration of geolocate](http://www.tackacoder.fr/geolocate/)

Load the library and language file

```html
<link rel="stylesheet" href="dist/geolocate.min.css">
<script src="dist/geolocate.min.js" type="text/javascript"></script>
<script src="lib/geolocate/i18n/fr.js" type="text/javascript"></script>
```

and then use it

```javascript
var geolocate = new Geolocate({
    google: {
        key: "MY_GOOGLE_KEY",
    }
});
```

List of the different options and methods

```javascript
{
    /**
     * Use a lang. Load javascript file in i18n directory
     */
    lang: 'fr',
    /**
     * Cookie data
     * timeout: Time of life
     * Names of cookie
     * ** GeolocateChoice -> it's the choice, accept or decline
     * ** GeolocateLatLng -> it's the position
     */
    cookie: {
        timeout: 33696000000, // it's the time for the cookies
        name: {
            choice: "GeolocateChoice",
            latlng: "GeolocateLatLng"
        }
    },
    /**
     * Google Key and Google API geolocation
     */
    google: {
        key: "",
        url: "https://www.googleapis.com/geolocation/v1/geolocate"
    },
    /**
     * Geolocate html box
     * close: If we display the close choice
     * timeout: delay to display the box
     * template: The box html, with tokens for dynamic data
     */
    box: {
        close: true,
        timeout: 550,
        template: '<div id="geolocate-wrapper">[[geolocate-close]]<div class="geolocate-host">[[geolocate-host]]</div><div class="geolocate-question">[[geolocate-localisation]]</div><div class="geolocate-buttons"><button class="geolocate-button" id="geolocate-accept" type="button">[[geolocate-accept]]</button><button class="geolocate-button" id="geolocate-decline" type="button">[[geolocate-decline]]</button></div></div>',
        legalTemplate: '<div id="geolocate-legal-wrapper"><div class="geolocate-message">[[geolocate-message]]</div><div class="geolocate-buttons"><button class="geolocate-button geolocate-accept" id="geolocate-message-accept" type="button">[[geolocate-accept]]</button><button class="geolocate-button geolocate-decline" id="geolocate-message-decline" type="button">[[geolocate-decline]]</button></div></div>'
    },
    /**
     * List of callback functions
     */
    callbacks: {
        /**
         * beforeSend $.ajax method
         */
        beforeSend: function() {}
        /**
         * success $.ajax method
         *
         * @param coord latlng send by google
         */
        success: function(coord) {}
        /**
         * error $.ajax method
         */
        error: function(jqXHR, textStatus, errorThrown, geolocate) {}
        /**
         * If the user decline the geolocate position
         */
        decline: function() {}
        /**
         * If you want to stylish and overwrite the displayBox method
         *
         * @param $('#geolocate-wrapper')
         */
        displayBox: function(wrapper) {}
        /**
         * If you want to stylish and overwrite the closeBox method
         *
         * @param $('#geolocate-wrapper')
         */
        closeBox: function(wrapper) {}
        /**
         * If you want to stylish and overwrite the loading method
         */
        loading: function() {}
        /**
         * If you want to stylish and overwrite the unLoading method
         */
        unLoading: function() {}
    }
}
```

## Legal part

Add a box to always ask surfer if he want to change is mind

```html
<div id="geolocate-message"></div>
```

```javascript
geolocate.legal($('#geolocate-message'));
```

## Re-locate geoposition

Button to ask surfer to update his geolocation. Hide this if the surfer decline prealably.

```html
<div class="update">
    Mis à jour
</div>
```

```javascript
geolocate.update(
    /**
     * The html element to add click action
     */
    $('.update'),
    /**
     * Succes callback
     */
    function() {
        console.log('success');
    },
    /**
     * beforeSend callback
     * eg: to add loader
     */
    function() {
        console.log('beforeSend');
    },
    /**
     * error callback
     */
    function() {
        console.log('error');
    }
);
```

## Dependencies
* [jQuery framework](https://jquery.com/)

## Compatibility (to check)
* Browsers
    * Windows / Chrome
    * Windows / Opera
    * Windows / Firefox
    * Windows / Safari
    * Windows / IE
        * Edge
        * IE10 +
        * IE9
        * IE8
* Minimum jQuery version 1.9.1

## ToDo list
* Action to re-geolocate
* Box to display on content to change your mind
* Documentation for feature
* Check compatibilities
* Check responsive mode

# Development

Create new branch for helping development

## Update workflow

```
npm update
bower update
```

# CHANGELOG

[SEE CHANGELOG](https://github.com/EdouardTack/geolocate/blob/master/CHANGELOG.md)

# LICENCE

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
