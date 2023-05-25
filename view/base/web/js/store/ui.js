
define([], function() {

    function Ui() {
        this.appLoaded = false;
        this.currentDesignId = null;
        this.currentDesignFormat = null;
    }

    Ui.prototype.setAppWasLoaded = function() {
        this.appLoaded = true;
    }

    Ui.prototype.isAppLoaded = function() {
        return this.appLoaded;
    }

    Ui.prototype.setCurrentDesignId = function(designId) {
        this.currentDesignId = designId;
    }

    Ui.prototype.getCurrentDesignId = function() {
        return this.currentDesignId;
    }

    Ui.prototype.setCurrentDesignFormat = function(designFormat) {
        this.currentDesignFormat = designFormat;
    }

    Ui.prototype.getCurrentDesignFormat = function() {
        return this.currentDesignFormat;
    }

    return new Ui();
});
