
jQuery.fn.extend
  # Disable an input ou contained inputs
  disable: ->
    jQuery(this).find(":input").andSelf().prop("disabled", true).attr("disabled", "true").addClass("ui-state-disabled")

  # Enable an input ou contained inputs
  enable: ->
    jQuery(this).find(":input").andSelf().removeProp("disabled").removeAttr("disabled").removeClass("ui-state-disabled")

String.prototype.lpad = (pattern, length) ->
  str = this
  while str.length < length
    str = pattern + str
  return str.slice(-1 * length)

jQuery.extend
  formattedDate: (date) ->
    year  = jQuery.lpad date.getFullYear(), 4
    month = jQuery.lpad date.getMonth() + 1
    day   = jQuery.lpad date.getDate()
    return "#{day}/#{month}/#{year}"
    
  formattedTime: (date) ->
    hour   = jQuery.lpad date.getHours()
    minute = jQuery.lpad date.getMinutes()
    second = jQuery.lpad date.getSeconds()
    return "#{hour}:#{minute}:#{second}"
    
  lpad: (text, length = 2, pattern = "0") ->
    return String(text).lpad(pattern, length)
