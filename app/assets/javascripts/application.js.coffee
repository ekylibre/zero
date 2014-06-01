# Add sprockets directives below:
#= require jquery
#= require jquery.mobile  
#= require jquery.plugin
#= require jquery.countdown
#= require tracker
# 

(($) ->
  "use strict"

  $.debug = (html) ->
    $("#debug").prepend("<p>#{html}</p>")

  $.fn.extend
    disable: ->
      $(this).find(":input").andSelf().prop("disabled", true).attr("disabled", "true").addClass("ui-state-disabled")
    enable: ->
      $(this).find(":input").andSelf().removeProp("disabled").removeAttr("disabled").removeClass("ui-state-disabled")
  
  $.app = 
    refreshTime: 1000

    initialize: ->
      # Sets default parameters
      unless window.localStorage.getItem("interventionNameInputMethod")?
        window.localStorage.setItem("interventionNameInputMethod", "auto")

      # Bind events for interface and other
      this._bindEvents()

      # Initialize geolocation
      unless navigator.geolocation?
        alert("Veuillez activer la géolocalisation")
        return false
        
      # Initialize tracker
      @tracker = new jQuery.tracking.Tracker("rei_db_23", this.refreshTime)

      # Search token. If no token, ask for authentication
      if window.localStorage.getItem("token")? and window.localStorage.getItem("instance")?
        this.recordCrumbs()
      else
        this.authenticate()

      # Ensure list is shown
      this._refreshInterventionsList()
      
      jQuery.debug("App initialized")
      return true

    # Go to authenticate page and ask for password
    # On validate _signIn() function is called.
    authenticate: ->
      $('#authentication form input[name="instance"]').val window.localStorage.getItem("instance")
      $('#authentication form input[name="email"]').val    window.localStorage.getItem("email")
      $('#authentication form input[name="password"]').val ""
      $.mobile.navigate("#authentication")

    # Go to interventions page and initialize buttons
    recordCrumbs: ->
      $.mobile.navigate("#interventions")
      this.toggleActiveWork(false)
      $("#intervention-stop").disable()
      $("#intervention-pause").disable()
      $("#intervention-resume").hide()
      $("#intervention-actions").disable()

    editOptions: ->
      $.mobile.navigate("#configuration")
      inputMethod = window.localStorage.getItem("interventionNameInputMethod")
      $("input[name='intervention_name_input_method'][type='radio'][value='#{inputMethod}']").prop("checked", true)

    signOut: ->
      jQuery.debug("Sign out")
      window.localStorage.removeItem "token"
      $.app.authenticate()

    startIntervention: ->
      if $.app.collectingCrumbs
        $.app.stopIntervention()
      # Ask for intervention name
      name = $.app._askForCurrentInterventionName()
      $.app.collectingCrumbs = true
      $("#intervention-stop").enable()
      $("#intervention-pause").enable()
      $("#intervention-resume").hide()
      $("#intervention-actions").enable()
      $("#edit-options").hide()
      $("#quit").hide()
   	  $('#clock').countdown
        since: new Date()
        format: 'HMS'
        description: ''
        compact: true
      jQuery.debug('start?')
      $.app.tracker.startIntervention(name)
      jQuery.debug('started')

    stopIntervention: ->
      $("#intervention-stop").disable()
      $("#intervention-pause").disable()
      $("#intervention-resume").hide()
      $("#intervention-actions").disable()           
      $("#edit-options").show()
      $("#quit").show()
      if $.app.workingActively
        $.app.stopActiveWork()
   	  $('#clock').countdown 'destroy'
      $.app.collectingCrumbs = false
      $.app.tracker.stopIntervention()

    pauseIntervention: ->
      $("#intervention-stop").disable()
      $("#intervention-start").disable()
      $("#intervention-pause").hide()
      $("#intervention-resume").show()
      $("#intervention-actions").disable()           
      if $.app.workingActively
        $('#active-work-clock').countdown 'pause'
   	  $('#clock').countdown 'pause'
      # $.app.tracker.pause()
      $.app._refreshInterventionsList()

    resumeIntervention: ->
      $("#intervention-stop").enable()
      $("#intervention-start").enable()
      $("#intervention-pause").show()
      $("#intervention-resume").hide()
      $("#intervention-actions").enable()
      if $.app.workingActively
        $('#active-work-clock').countdown 'resume'
   	  $('#clock').countdown 'resume'
      # $.app.tracker.resume()
      $.app._refreshInterventionsList()

    toggleActiveWork: (value) ->
      if value == true or value == false
        $.app.workingActively = not value
      if $.app.workingActively
        $.app.stopActiveWork()
      else
        $.app.startActiveWork()

    stopActiveWork: ->
      $.app.workingActively = false
      $('#active-work').removeClass('ui-btn-active')
   	  $('#active-work-clock').countdown 'destroy'
      
    startActiveWork: ->
      $.app.workingActively = true
      $('#active-work').addClass('ui-btn-active')
   	  $('#active-work-clock').countdown
        since: new Date()
        format: 'HMS'
        description: ''
        compact: true      

    scanBarcode: ->
	    alert('scanning');
	    scanner = cordova.require("cordova/plugin/BarcodeScanner")
	    scanner.scan ((result) ->
        alert("We got a barcode\nResult: #{result.text}\nFormat: #{result.format}\nCancelled: #{result.cancelled}")
	    ), ((error) ->
        alert("Scanning failed: #{error}")
	    )

    quit: ->
      if navigator.app
        navigator.app.exitApp()
      else if navigator.device
        navigator.device.exitApp()

    _bindEvents: ->
      $('#authentication form #sign-in').click this._signIn
      $('#sign-out').click this.signOut
      $('#edit-options').click this.editOptions
      $('#record-crumbs').click this.recordCrumbs
      $('#quit').click this.quit
      $('#intervention-stop').click this.stopIntervention
      $('#intervention-start').click this.startIntervention
      $('#intervention-pause').click this.pauseIntervention
      $('#intervention-resume').click this.resumeIntervention
      $('#active-work').click this.toggleActiveWork
      $('#barcode-scan').click this.scanBarcode
      $("input[name='intervention_name_input_method'][type='radio']").change ->
        window.localStorage.setItem("interventionNameInputMethod", this.value)
      $(document).on("crumbs:new:start", this._refreshInterventionsList)
      $(document).on("crumbs:new:stop", this._refreshInterventionsList)

    _signIn: ->
      this.instance = $('#authentication form input[name="instance"]').val()
      window.localStorage.setItem "instance", this.instance
      email = $('#authentication form input[name="email"]').val()
      window.localStorage.setItem "email", email
      password = $('#authentication form input[name="password"]').val()
      jQuery.debug("Send to: #{this.instance}/api/v1/tokens.json")
      $.ajax
        type: "POST"
        url: "#{this.instance}/api/v1/tokens.json"
        data:
          email: email,
          password: password
        success: (data, status, request) ->
          window.localStorage.setItem "token", data.token
          $.app.recordCrumbs()
          return
        error: (request, status, error) ->
          alert("#{status}: #{error}")
          return

    _askForCurrentInterventionName: (defaultName = "Nouvelle intervention")->
      if window.localStorage.getItem("interventionNameInputMethod") == "write"
        # $.mobile.navigate("#choose-intervention-name")
        $.app.currentInterventionName = prompt("Nom de l'intervention", defaultName)
      $.app.currentInterventionName ?= defaultName
      return $.app.currentInterventionName

    # Send crumbs to Ekylibre server
    send: ->
      crumbs = new Array()
      query = "SELECT * from crumbs;"
      @connection.transaction (tx) ->
        tx.executeSql query, [], ((tx, rs) ->
          i = 0
          while i < rs.rows.length
            row = rs.rows.item(i)
            crumb =
              name: row["name"]
              latitude: row["latitude"]
              longitude: row["longitude"]
              read_at: row["read_at"]
              accuracy: row["accuracy"]
              type: row["type"]
              code: row["code"]
              quantity: row["quantity"]
              unit: row["unit"]

            crumbs.push crumb
            i++
          obj =
            id: window.localStorage.getItem("user")
            passwrd: window.localStorage.getItem("pwd")
            crumbs: @crumbs

          $.ajax
            type: "POST"
            url: my_url
            data: obj
            dataType: "json"
            success: (data) ->
              console.log "send success"
            error: (data) ->
              console.log "send error"
              console.log data
        ), (error) ->
          console.log "Transaction Error: " + error.message

    _refreshInterventionsList: ->
      jQuery.debug("DB: #{@tracker.database.name} v#{@tracker.database.version}")
      jQuery.debug("Refresh list")
      @tracker.database.execute "SELECT * FROM crumbs WHERE type IN ('start', 'stop')", (result) ->
        jQuery.debug("RIL")
        html = "<thead><tr><th data-priority='critical'>Title</th><th>Duration</th><th>Beginning</th></tr></thead><tbody>"
        i = 0
        interventionNumber = 1
        while i < result.rows.length - 1
          jQuery.debug("RIL?")
          row1 = result.rows.item(i)
          row2 = result.rows.item(i + 1)
          started_at = new Date(row1.read_at)
          stopped_at = new Date(row2.read_at)
          name = row1.name || "Intervention n°#{interventionNumber}"
          duration = new Date(stopped_at.getTime() - started_at.getTime())
          duration.setTime duration.getTime() + (duration.getTimezoneOffset() * 1000 * 60)
          html += "<tr><th>#{name}</th><td>#{_timeFormat(duration)}</td><td>#{_formattedDate(started_at)}</td></tr>"
          if row2.type == "stop"
            i += 2
          else
            row1 = row2
            i++
          interventionNumber++
        html += "</tbody>"
        $("#interventions-list").html html
        return

    _formattedDate: (date) ->
      now = new Date(date or Date.now())
      day   = now.getDate()
      day   = "0#{day}" if day < 10
      month = now.getMonth() + 1
      month = "0#{month}" if month < 10
      year  = now.getFullYear()
      return "#{day}/#{month}/#{year}"
      
    _timeFormat: (d) ->
      hours   = _formatTwoDigits d.getHours()
      minutes = _formatTwoDigits d.getMinutes()
      seconds = _formatTwoDigits d.getSeconds()
      return "#{hours}:#{minutes}:#{seconds}"
      
    _formatTwoDigits: (n) ->
      (if n < 10 then "0" + n else n)
      
 
) jQuery

app = jQuery.app

document.addEventListener "deviceReady", (->
  console.log "Device ready!"
  unless app.initialize()
    app.quit()
), false

console.log app
