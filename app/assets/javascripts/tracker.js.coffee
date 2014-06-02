# Add sprockets directives below:
#= require database
# 

geoloc = (position) ->
  jQuery.debug("Global geolocation... #{position}")

jQuery.tracking =

  # Function which permit to dispatch calls
  geolocationProxy: (that, type, position) ->
    jQuery.debug("GeoProxy#{type}: #{that}")
    that["_add#{type}Crumb"](position)
    return
    
  geolocationError: (error) ->
    alert "code: #{error.code}\nmessage: #{error.message}\n"
    jQuery.debug("Error: #{error.message}")    
    return

  Tracker: class Tracker
  
    constructor: (@databaseName, duration)->
      jQuery.debug("New tracker")
      @databaseName ?= "rei"
      @geolocationIntervalDuration = duration || 1000
      @geolocationInterval = null
      @interventionName = null
      @geolocationOptions =
        enableHighAccuracy: true
        maximumAge: 0
      if @database?
        console.log "Database already initialized"
        jQuery.debug("Initialized DB")
      else
        jQuery.debug("Initialize DB")
        @database = new jQuery.Database(@databaseName)
      @running = false
      @activeWork = false
      jQuery.debug("Tracker!")
      return
  
    # Begins to collect crumbs with regular interval
    start: ->
      jQuery.debug("Start auto collect")
      if @watcher?
        console.log "Tracking already started"
      else
        that = this
        @watcher = navigator.geolocation.watchPosition () ->
          that.markCrumb()
      return
  
    # Stops to collect crumbs with regular interval
    stop: ->
      jQuery.debug("Stop auto collect")
      navigator.geolocation.clearWatch @watcher
      @watcher = null
      return
  
    ############################################################################## 
    # Special crumbs
    # TODO?: Migrates special crumbs in app through a method wich permit to simply
    #        add crumbs per type. startIntervention, resumeIntervention etc. are
    #        too specific to app not to a Tracker.
  
    # Called every geolocationIntervalDuration
    markCrumb: ->
      jQuery.debug("Mark crumb")
      this._track "Simple"
      return
          
    startIntervention: (name) ->
      @interventionName = name
      this._track "Start"
      this.start()
      @running = true
      return
  
    resumeIntervention: ->
      this._track "Resume"
      this.start()
      return
  
    stopIntervention: ->
      this.stop()
      this._track "Stop"
      @running = false
      return
  
    pauseIntervention: ->
      this.stop()
      this._track "Pause"
      return
  
    startActiveWork: ->
      if @running
        @activeWork = true
        this._track "ActiveWorkStart"
      return
  
    stopActiveWork: ->
      if @running
        @activeWork = false
        this._track "ActiveWorkStop"
      return
  
    # PRIVATE METHODS
  
    # Generic method to add crumbs
    _addCrumb: (coords, type, attributes = {}) ->
      jQuery.debug("NEW CRUMB #{type}")
      crumb = jQuery.extend {}, attributes, 
        latitude:  coords.latitude
        longitude: coords.longitude
        accuracy:  coords.accuracy # accuracy in meters
        read_at: new Date()
        type: type
      @database.insertCrumb crumb
      return
    
    _addSimpleCrumb: (position) ->
      jQuery.debug("<b>_addSimpleCrumb</b>")
      this._addCrumb position.coords, "crumb"
      return
  
    _addStartCrumb: (position) ->
      this._addCrumb position.coords, "start", {name: interventionName}
      return
  
    _addStopCrumb: (position) ->
      this._addCrumb position.coords, "stop"
      return
  
    _addPauseCrumb: (position) ->
      this._addCrumb position.coords, "pause"
      return
  
    _addResumeCrumb: (position) ->
      this._addCrumb position.coords, "resume"
      return
  
    _addActiveWorkStartCrumb: (position) ->
      this._addCrumb position.coords, "start-active-work"
      return
  
    _addActiveWorkStopCrumb: (position) ->
      this._addCrumb position.coords, "stop-active-work"
      return
  
    _geolocationError: (error) ->
      alert "code: #{error.code}\nmessage: #{error.message}\n"
      return
  
    _track: (type = "Simple") ->
      jQuery.debug("Track #{type}")
      that = this
      success = (position) ->
        jQuery.debug("Geoloc ?")
        jQuery.tracking.geolocationProxy(that, type, position)
      navigator.geolocation.getCurrentPosition(success, jQuery.tracking.geolocationError, @geolocationOptions)
      return
