# Add sprockets directives below:
#= require jquery
#= require jquery.mobile  
#= require jquery.plugin
#= require jquery.countdown
# 


(($) ->
  "use strict"
  
  $.app = 
    database: null
    refreshTime: 1000
    storage: window.localStorage

    initialize: ->
      # Hide hidden things
    
      # Bind events
      this._bindEvents()
        
      # Search token. If no token, ask for authentication
      if this.storage.getItem("token")?
        this.record()
      else
        this.authenticate()
      alert "Initialized!"

    authenticate: ->
      $('#authentication form input[name="instance"]').val this.storage.getItem("instance")
      $('#authentication form input[name="email"]').val this.storage.getItem("email")
      this._goToPage("authentication")

    record: ->
      this._goToPage("interventions")

    _goToPage: (pageName) -> 
      $(":mobile-pagecontainer").pagecontainer("change", "##{pageName}")

    _bindEvents: ->
      # authentication
      $('#authentication form #sign-in').click ->
        
        alert('Authenticating')
      # interventions
 
) jQuery

app = jQuery.app

document.addEventListener "deviceready", (->
  console.log "Device ready!"
  app.initialize()
  return
), false

console.log app
