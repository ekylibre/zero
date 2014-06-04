# Add sprockets directives below:
#= require rei

class rei.Tracker

  constructor: (@database, @geolocationIntervalDuration) ->
    @geolocationIntervalDuration ?= 1000
    @geolocationOptions =
      enableHighAccuracy: true
      maximumAge: 0
    return

  # Begins to collect crumbs with regular interval
  watch: (type = "crumb") ->
    rei.debug("Start watching")
    if @watcher?
      console.log "Tracking already started"
    else
      that = this
      @watcher = navigator.geolocation.watchPosition () ->
        that.track(type)
    return

  # Stops to collect crumbs with regular interval
  stopWatching: ->
    rei.debug("Stop watching")
    navigator.geolocation.clearWatch @watcher
    @watcher = null
    return

  # Geolocate position and adds a crumb
  track: (type = "crumb", attributes = {}) ->
    rei.debug("Track #{type}")
    that = this
    successCallback = (position) ->
      that._addCrumb(position, type, attributes)
    navigator.geolocation.getCurrentPosition(successCallback, that._geolocationError, @geolocationOptions)
    return

  # PRIVATE METHODS

  # Generic method to add crumbs
  _addCrumb: (position, type, attributes = {}) ->
    rei.debug("Add #{type} crumb (#{position.coords.latitude}, #{position.coords.longitude})")
    crumb = jQuery.extend {}, attributes, 
      latitude:  position.coords.latitude
      longitude: position.coords.longitude
      accuracy:  position.coords.accuracy # accuracy in meters
      read_at: new Date()
      type: type
    @database.insert "crumbs", crumb, ->
      rei.debug "Trigger: crumbs:new:#{crumb.type} event"
      jQuery(document).trigger("crumbs:new:#{crumb.type}")
    return

  _geolocationError: (error) ->
    alert "Geolocation error (#{error.code}): #{error.message}\n"
    return

