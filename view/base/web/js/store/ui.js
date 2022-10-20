
define([], function() {

    function Ui() {
        this.appLoaded = false;
    }

    Ui.prototype.setAppWasLoaded = function() {
        this.appLoaded = true;
    }

    Ui.prototype.isAppLoaded = function() {
        return this.appLoaded;
    }

    return new Ui();
});
