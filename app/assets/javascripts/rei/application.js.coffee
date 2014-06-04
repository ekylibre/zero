# Add sprockets directives below:
#= require rei
#= require rei/debug
#= require rei/core_ext
#= require rei/migration
#= require rei/database
#= require rei/tracker

class rei.Application

  migrations: [
    # Initial migration
    new rei.Migration "0", (transaction) ->
      transaction.executeSql "CREATE TABLE IF NOT EXISTS crumbs (id INTEGER PRIMARY KEY AUTOINCREMENT, name VARCHAR, latitude FLOAT, longitude FLOAT, read_at DATE, accuracy NUMERIC, type TEXT, code TEXT, quantity NUMERIC, unit TEXT)"
    # new rei.Migration "1", (transaction) ->
    #   # Nothing
    # new rei.Migration "2", (transaction) ->
    #   # Nop
  ]

  constructor: (@refreshTime) ->
    @refreshTime ?= 1000
    @collectingCrumbs = false

  initialize: ->
    # Sets default parameters
    rei.debug("Set default preferences...")
    unless window.localStorage.getItem("interventionNameInputMethod")?
      window.localStorage.setItem("interventionNameInputMethod", "auto")

    # Bind events for interface and other
    rei.debug("Bind events...")
    this._bindAllEvents()

    # Initialize geolocation
    unless navigator.geolocation?
      alert("Veuillez activer la géolocalisation")
      return false

    unless window.openDatabase?
      alert("Pas d'utilisation de base de donnée possible")
      return false

    # Initialize database
    rei.debug("Initialize Database...")
    @database = new rei.Database("rei_db_26", "Rei database", @migrations)
     
    # Initialize tracker
    rei.debug("Initialize Tracker...")
    @tracker = new rei.Tracker(@database, @refreshTime)

    # Search token for to known on which page we need to go
    rei.debug("Move to appropriate page...")
    if window.localStorage.getItem("token")? and window.localStorage.getItem("instance")?
      this.recordCrumbs()
    else
      this.authenticate()

    rei.debug("App initialized.")
    return true

  # Go to authenticate page and ask for password
  # On validate _signIn() function is called.
  authenticate: ->
    jQuery('#authentication form input[name="instance"]').val window.localStorage.getItem("instance")
    jQuery('#authentication form input[name="email"]').val    window.localStorage.getItem("email")
    jQuery('#authentication form input[name="password"]').val ""
    jQuery.mobile.navigate("#authentication")

  # Go to interventions page and initialize buttons
  recordCrumbs: ->
    this._refreshInterventionsList()
    jQuery.mobile.navigate("#interventions")
    this.toggleActiveWork(false)
    jQuery("#intervention-stop").disable()
    jQuery("#intervention-pause").disable()
    jQuery("#intervention-resume").hide()
    jQuery("#intervention-actions").disable()

  editOptions: ->
    jQuery.mobile.navigate("#configuration")
    inputMethod = window.localStorage.getItem("interventionNameInputMethod")
    jQuery("input[name='intervention_name_input_method'][type='radio'][value='#{inputMethod}']").prop("checked", true)

  signOut: ->
    rei.debug("Sign out")
    window.localStorage.removeItem "token"
    this.authenticate()

  startIntervention: ->
    rei.debug('Start intervention')
    if @collectingCrumbs
      this.stopIntervention()
    # Ask for intervention name
    name = this._askForInterventionName()
    @collectingCrumbs = true
    jQuery("#intervention-stop").enable()
    jQuery("#intervention-pause").enable()
    jQuery("#intervention-resume").hide()
    jQuery("#intervention-actions").enable()
    jQuery("#edit-options").hide()
    jQuery("#quit").hide()
 	  jQuery('#clock').countdown
      since: new Date()
      format: 'HMS'
      description: ''
      compact: true
    @tracker.track("start", name: name)
    @tracker.watch()
    rei.debug('Intervention started')

  stopIntervention: ->
    rei.debug('stopIntervention')
    jQuery("#intervention-stop").disable()
    jQuery("#intervention-pause").disable()
    jQuery("#intervention-resume").hide()
    jQuery("#intervention-actions").disable()           
    jQuery("#edit-options").show()
    jQuery("#quit").show()
 	  jQuery('#clock').countdown("destroy")
    @collectingCrumbs = false
    @tracker.stopWatching()
    this.stopActiveWork() if @workingActively
    @tracker.track("stop")

  pauseIntervention: ->
    rei.debug('pauseIntervention')
    jQuery("#intervention-stop").disable()
    jQuery("#intervention-start").disable()
    jQuery("#intervention-pause").hide()
    jQuery("#intervention-resume").show()
    jQuery("#intervention-actions").disable()           
    jQuery('#active-work-clock').countdown("pause") if @workingActively
 	  jQuery('#clock').countdown("pause")
    @tracker.stopWatching()
    @tracker.track("pause")
    this._refreshInterventionsList()

  resumeIntervention: ->
    rei.debug('resumeIntervention')
    jQuery("#intervention-stop").enable()
    jQuery("#intervention-start").enable()
    jQuery("#intervention-pause").show()
    jQuery("#intervention-resume").hide()
    jQuery("#intervention-actions").enable()
    jQuery('#active-work-clock').countdown("resume") if @workingActively
 	  jQuery('#clock').countdown("resume")
    @tracker.track("resume")
    @tracker.watch()
    this._refreshInterventionsList()

  toggleActiveWork: (value) ->
    if value == true or value == false
      @workingActively = not value
    if @workingActively
      this.stopActiveWork()
    else
      this.startActiveWork()

  stopActiveWork: ->
    rei.debug('stopActiveWork')
    @workingActively = false
    jQuery('#active-work').removeClass('ui-btn-active')
 	  jQuery('#active-work-clock').countdown 'destroy'
    @tracker.track("work-stop")      
    
  startActiveWork: ->
    rei.debug('startActiveWork')
    @workingActively = true
    jQuery('#active-work').addClass('ui-btn-active')
 	  jQuery('#active-work-clock').countdown
      since: new Date()
      format: 'HMS'
      description: ''
      compact: true      
    @tracker.track("work-start")      

  scanBarcode: ->
	  alert('scanning');
	  scanner = cordova.require("cordova/plugin/BarcodeScanner")
	  scanner.scan ((result) ->
      alert("We got a barcode\nResult: #{result.text}\nFormat: #{result.format}\nCancelled: #{result.cancelled}")
      @tracker.track("scan", code: result.text, quantity: 1)
	  ), ((error) ->
      alert("Scanning failed: #{error}")
	  )

  quit: ->
    rei.debug('Quit')
    if navigator.app
      navigator.app.exitApp()
    else if navigator.device
      navigator.device.exitApp()

  _bindAllEvents: ->
    this._on "#authentication form #sign-in", "click", "_signIn"
    this._on "#sign-out", "click", "signOut"
    this._on "#edit-options", "click", "editOptions"
    this._on "#record-crumbs", "click", "recordCrumbs"
    this._on "#quit", "click", "quit"
    this._on "#intervention-stop", "click", "stopIntervention"
    this._on "#intervention-start", "click", "startIntervention"
    this._on "#intervention-pause", "click", "pauseIntervention"
    this._on "#intervention-resume", "click", "resumeIntervention"
    this._on "#active-work", "click", "toggleActiveWork"
    this._on "#barcode-scan", "click", "scanBarcode"
    this._on "input[name='intervention_name_input_method'][type='radio']", "change", (event) ->
      window.localStorage.setItem("interventionNameInputMethod", event.target.value)
    this._on document, "crumbs:new:start", "_refreshInterventionsList"
    this._on document, "crumbs:new:stop", "_refreshInterventionsList"
    rei.debug('Bind events!')

  # Permit to bind event with "this" as the actual object and not the event "target" element.
  # The event object is given as the second parameter
  _on: (scope, event, func) ->
    that = this
    if jQuery.isFunction(func)
      jQuery(scope).on event, (eventObject) ->
        func.call(that, eventObject)
    else
      jQuery(scope).on event, (eventObject) ->
        that[func].call(that, eventObject)
    

  _signIn: ->
    this.instance = jQuery('#authentication form input[name="instance"]').val()
    window.localStorage.setItem "instance", this.instance
    email = jQuery('#authentication form input[name="email"]').val()
    window.localStorage.setItem "email", email
    password = jQuery('#authentication form input[name="password"]').val()
    rei.debug("Send to: #{this.instance}/api/v1/tokens.json")
    jQuery.ajax
      type: "POST"
      url: "#{this.instance}/api/v1/tokens.json"
      data:
        email: email,
        password: password
      success: (data, status, request) ->
        window.localStorage.setItem "token", data.token
        this.recordCrumbs()
        return
      error: (request, status, error) ->
        alert("#{status}: #{error}")
        return

  _askForInterventionName: (name = "Nouvelle intervention") ->
    if window.localStorage.getItem("interventionNameInputMethod") == "write"
      # jQuery.mobile.navigate("#choose-intervention-name")
      name = prompt("Nom de l'intervention", name)
    return name

  # Send crumbs to Ekylibre server
  syncData: ->
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

        jQuery.ajax
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
    rei.debug("DB: #{@database.name} v#{@database.version}")
    rei.debug("Refresh list")
    @database.select "SELECT * FROM crumbs WHERE type IN ('start', 'stop')", (result) ->
      rei.debug("RIL: #{result.rows.length} rows")
      html = "<table><thead><tr><th data-priority='critical'>Title</th><th>Duration</th><th>Beginning</th></tr></thead><tbody>"
      i = 0
      interventionNumber = 1
      while i < result.rows.length - 1
        rei.debug("RIL?")
        started_row = result.rows.item(i)
        stopped_row = result.rows.item(i + 1)
        rei.debug("RIL.?")
        started_at = new Date(started_row.read_at)
        stopped_at = new Date(stopped_row.read_at)
        rei.debug("RIL..?")
        name = started_row.name
        name ?= "Intervention n°#{interventionNumber}"
        rei.debug("RIL...?")
        duration = new Date(stopped_at.getTime() - started_at.getTime())
        rei.debug("RIL....?")
        duration.setTime duration.getTime() + (duration.getTimezoneOffset() * 1000 * 60)
        rei.debug("RIL.....?")
        rei.debug(duration)
        rei.debug(started_at)
        rei.debug(jQuery.formattedTime)
        rei.debug(jQuery.formattedDate)
        rei.debug(jQuery.formattedTime(duration))
        rei.debug(jQuery.formattedDate(started_at))
        html += "<tr><th>#{name}</th><td>#{jQuery.formattedTime(duration)}</td><td>#{jQuery.formattedDate(started_at)}</td></tr>"
        rei.debug("RIL......?")
        if stopped_row.type == "stop"
          i += 2
        else
          i += 1
        interventionNumber += 1
      html += "</tbody></table>"
      jQuery("#interventions-list").html html
    return

