# Add sprockets directives below:
#= require migration

jQuery.Database = class Database
  migrations: [
    # Initial migration
    new jQuery.Migration "0", (transaction) ->
      transaction.executeSql "CREATE TABLE IF NOT EXISTS crumbs (id INTEGER PRIMARY KEY AUTOINCREMENT, name VARCHAR, latitude FLOAT, longitude FLOAT, read_at DATE, accuracy NUMERIC, type TEXT, code TEXT, quantity NUMERIC, unit TEXT)"

    # new jQuery.Migration "1", (transaction) ->
    #   # Nothing
    # new jQuery.Migration "2", (transaction) ->
    #   # Nop
    # new jQuery.Migration "3", (transaction) ->
    #   # Nop
  ]

  constructor: (@name, @displayName, @estimatedSize)->
    @name ?= "rei"
    @displayName ?= "Rei database"
    @estimatedSize ?= 1024*1024
    @ready = false
    @version = ""
    that = this
    @connection = openDatabase @name, @version, @displayName, @estimatedSize
    that._migrate()
    # jQuery.debug("Connection: #{@connection}")

  # Execute a query like a SELECT (without parameters)
  execute: (query, callback) ->
    that = this
    success = that._defaultQuerySuccessCallback
    if $.isFunction(callback)
      success = (transaction, result) ->
        jQuery.debug('ES?')
        callback(result)
        jQuery.debug('ES!')
    unless @connection and @connection.transaction
      alert("No connection for query execution.")
    @connection.transaction ((tx) ->
        tx.executeSql query, [], success, that._defaultQueryErrorCallback
      ),
      that._defaultTransactionErrorCallback,
      that._defaultTransactionSuccessCallback

  # Show crumbs in console
  logCrumbs: ->
    execute "SELECT * FROM crumbs", (rs) ->
      i = 0
      while i < rs.rows.length
        row = rs.rows.item(i)
        console.log row["latitude"]
        i++
  
  # On efface la table Crumb
  dropTableCrumbs: ->
    execute "DROP TABLE IF EXISTS crumbs"

  # Specific INSERT for Crumbs
  insertCrumb: (crumb) ->
    jQuery.debug("Insert crumb")
    that = this
    @connection.transaction ((tx) ->
      tx.executeSql "INSERT INTO crumbs (name, latitude, longitude, read_at, accuracy, type, code, quantity, unit) VALUES (?,?,?,?,?,?,?,?,?)",
        [crumb.name, crumb.latitude, crumb.longitude, crumb.read_at, crumb.accuracy, crumb.type, crumb.code, crumb.quantity, crumb.unit],
        that._defaultQuerySuccessCallback,
        that._defaultQueryErrorCallback
    ), that._defaultTransactionErrorCallback, ->
      console.log "Store crumb success"
      $(document).trigger("crumbs:new:#{crumb.type}")

  # Generic INSERT call
  _insert: (table, data) ->
    that = this
    columns = []
    values = []
    parameters = for column, value of data
      columns.push column
      values.push value
      "?"
    @connection.transaction ((tx) ->
      tx.executeSql "INSERT INTO #{table} (#{columns.join(', ')}) VALUES (#{parameters.join(', ')})",
        values,
        that._defaultQuerySuccessCallback,
        that._defaultQueryErrorCallback
    ), that._defaultTransactionErrorCallback, that._defaultTransactionSuccessCallback

  _defaultQuerySuccessCallback: (transaction, result) ->
    $(window).trigger("query:success", result)
    console.log "Query succeded"
    return

  _defaultQueryErrorCallback: (transaction, error) ->
    alert "Query failed (#{error.code}): #{error.message}"
    console.log "Query failed (#{error.code}): #{error.message}"
    return

  _defaultTransactionSuccessCallback: () ->
    console.log "Transaction succeded"
    return

  _defaultTransactionErrorCallback: (error) ->
    alert "Transaction failed (#{error.code}): #{error.message}"
    console.log "Transaction failed (#{error.code}): #{error.message}"
    return

  _versionChangeError: (transaction, message) ->
    alert "Version Change failed (#{error.code}): #{error.message}"
    console.log "Version Change failed (#{error.code}): #{error.message}"
    return

  _migrate: (newVersion = 0) ->
    jQuery.debug("Migrate #{@connection} to #{newVersion}")
    that = this
    migration = that.migrations[newVersion]
    unless migration?
      alert("No migration: #{newVersion}")
      console.log("No migration: #{newVersion}")
      return false
    jQuery.debug("Migration: #{migration.commands}")
    @connection.changeVersion(
      @connection.version,
      migration.version,
      migration.commands,
      that._versionChangeError,
      () ->
        jQuery.debug("Migration #{migration.version} passed!")
        that.version = migration.version
        if that.migrations[newVersion + 1]
          return that._migrate(newVersion + 1)
        else
          that.ready = true
          $(window).trigger("db:ready")
    )
