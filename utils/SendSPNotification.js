const {db} = require('./../db/Mongo/Mongo')


const SPNotifier = function()
{
      
}

/** 
 * TODO: get each service provider's avilable hours and compare it with current time
 */
SPNotifier.prototype._getWorkingHours = function(callback) { 
    this.db.getSPWorkingHours(callback)
}
 
/**
 * TODO: fetch everything that is suppose to be sent to service providers and call
 * the hooks for each service provider available and ready to serve 
 */

/**
 * TODO: while calling hooks is one thing, there should also be a column in a database 
 * where a service provider can fetch these requests from
 */

