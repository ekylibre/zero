# Add sprockets directives below:
#= require rei

class rei.Database

  constructor: (@name, @displayName, @migrations, @estimatedSize)->
    @name ?= "rei"
    @displayName ?= "Rei database"
    @migrations ?= []
    @estimatedSize ?= 1024*1024
    @ready = false
    @version = ""
    that = this
    @connection = openDatabase @name, @version, @displayName, @estimatedSize
    that._migrate()
    # rei.debug("Connection: #{@connection}")

  # Execute a query like a SELECT (without parameters)
  select: (query, successCallback) ->
    that = this
    successCallbackWrapper = that._defaultQuerySuccessCallback
    if jQuery.isFunction(successCallback)
      successCallbackWrapper = (transaction, resultSet) ->
        successCallback(resultSet)
    else
      successCallbackWrapper = (transaction, result) ->
        jQuery(document).trigger("#{table}:select")
    unless @connection and @connection.transaction
      alert("No connection for query execution.")
    @connection.transaction (tx) ->
      tx.executeSql query, [], successCallbackWrapper, that._defaultQueryErrorCallback
      #       ),
      # that._defaultTransactionErrorCallback,
      # that._defaultTransactionSuccessCallback


  # Generic INSERT call
  insert: (table, data, successCallback) ->
    that = this
    columns = []
    values = []
    parameters = for column, value of data
      columns.push column
      values.push value
      "?"
    if jQuery.isFunction(successCallback)
      successCallbackWrapper = (transaction, result) ->
        successCallback(result)
    else
      successCallbackWrapper = (transaction, result) ->
        jQuery(document).trigger("#{table}:insert")
    unless @connection and @connection.transaction
      alert("No connection for query execution.")     
    @connection.transaction ((tx) ->
      tx.executeSql "INSERT INTO #{table} (#{columns.join(', ')}) VALUES (#{parameters.join(', ')})", values, successCallbackWrapper, that._defaultQueryErrorCallback
    ), that._defaultTransactionErrorCallback, that._defaultTransactionSuccessCallback


  # Show crumbs in console
  logCrumbs: ->
    select "SELECT * FROM crumbs", (rs) ->
      i = 0
      while i < rs.rows.length
        row = rs.rows.item(i)
        console.log row["latitude"]
        i++
  
  # On efface la table Crumb
  dropTableCrumbs: ->
    execute "DROP TABLE IF EXISTS crumbs"

  # # Specific INSERT for Crumbs
  # insertCrumb: (crumb) ->
  #   rei.debug("Insert crumb")
  #   return this.insert "crumbs", crumb, ->
  #     console.log "Store crumb success"
  #     jQuery(document).trigger("crumbs:new:#{crumb.type}")      
  #   # rei.debug("Insert crumb")
  #   # that = this
  #   # @connection.transaction ((tx) ->
  #   #   rei.debug("Insert crumb ?")
  #   #   tx.executeSql "INSERT INTO crumbs (name, latitude, longitude, read_at, accuracy, type, code, quantity, unit) VALUES (?,?,?,?,?,?,?,?,?)",
  #   #     [crumb.name, crumb.latitude, crumb.longitude, crumb.read_at, crumb.accuracy, crumb.type, crumb.code, crumb.quantity, crumb.unit],
  #   #     that._defaultQuerySuccessCallback,
  #   #     that._defaultQueryErrorCallback
  #   # ), that._defaultTransactionErrorCallback, ->
  #   #   console.log "Store crumb success"
  #   #   jQuery(document).trigger("crumbs:new:#{crumb.type}")

  _defaultQuerySuccessCallback: (transaction, result) ->
    jQuery(document).trigger("query:success", result)
    console.log "Query succeded"
    return

  _defaultQueryErrorCallback: (transaction, error) ->
    alert "Query failed (#{error.code}): #{error.message}"
    console.log "Query failed (#{error.code}): #{error.message}"
    return false

  _defaultTransactionSuccessCallback: () ->
    console.log "Transaction succeded"
    return

  _defaultTransactionErrorCallback: (error) ->
    alert "Transaction failed (#{error.code}): #{error.message}"
    console.log "Transaction failed (#{error.code}): #{error.message}"
    return false

  _versionChangeError: (transaction, message) ->
    alert "Version Change failed (#{error.code}): #{error.message}"
    console.log "Version Change failed (#{error.code}): #{error.message}"
    return false

  _migrate: (newVersion = 0) ->
    rei.debug("Migrate #{@connection} to #{newVersion}")
    that = this
    migration = that.migrations[newVersion]
    unless migration?
      alert("No migration: #{newVersion}")
      console.log("No migration: #{newVersion}")
      return false
    rei.debug("Migration: #{migration.commands}")
    @connection.changeVersion(
      @connection.version,
      migration.version,
      migration.commands,
      that._versionChangeError,
      () ->
        rei.debug("Migration #{migration.version} passed!")
        that.version = migration.version
        if that.migrations[newVersion + 1]
          return that._migrate(newVersion + 1)
        else
          that.ready = true
          jQuery(document).trigger("db:ready")
    )
