# Add sprockets directives below:
#= require rei

rei.debug = (message) ->
  console.log message
  jQuery("#debug").prepend("<p>#{message}</p>")
