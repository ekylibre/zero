# Add sprockets directives below:
#= require jquery
#= require jquery.mobile
#= require jquery.plugin
#= require jquery.countdown
#= require rei/application
# 

if navigator.splashscreen and navigator.splashscreen.show
  navigator.splashscreen.show()

jQuery.startApp = ->
  rei.debug "Start application..."
  jQuery.app = new rei.Application(1200)
  if jQuery.app.initialize()
    rei.debug("Hide splashscreen...")
    if navigator.splashscreen and navigator.splashscreen.hide
      navigator.splashscreen.hide()
  else      
    jQuery.app.quit()


document.addEventListener "deviceready", jQuery.startApp, false

if navigator.userAgent.toLowerCase().indexOf('chrome') > -1
  jQuery(document).ready jQuery.startApp

