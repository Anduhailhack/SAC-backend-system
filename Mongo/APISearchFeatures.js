class APISearchFeatures {
    constructor(query, queryString){
        this.query = query
        this.queryString = queryString
    }
     
    filter(){
        //Exclude sort, filter, limit, page...
        // change gte, lt, gt, lte to $gte, $lt, $gt, $lte  => mongo syntax not included in the coming query
        
        let queryObj = {...this.queryString}
        const exclude = ['sort', 'filter', 'limit', 'page']
        exclude.forEach(el => delete queryObj[el])

        let queryStr = JSON.stringify(queryObj)
        queryStr = queryStr.replace(/\b(gt|gte|lt|lte)\b/g, match => `$${match}`)
        queryObj = JSON.parse(queryStr)

        this.query = this.query.find(queryObj)

        return this
    }

    sort(){
        //filter the query by changing ',' to ' '  => MongoDb syntax for sorting for second level
        if(this.queryString.sort){
            const sortBy = this.queryString.sort.split(',').join(' ')
            this.query = this.query.sort(sortBy)
        } 
        else {
            this.query = this.query.sort({"_id": 1})                    //default sort type
        } 
        return this
    }

    fields(){                                           // search fields returned to the req
        if(this.queryString.fields){
            const fields = this.queryString.fields.split(',').join(' ')
            this.query = this.query.select(fields)
            return this
        } else {
            this.query = this.query.select('-__v')             //default feilds
            return this
        }
    }

    page(){                                         // Which page and how many data to return 
        const limit = this.queryString.limit * 1
        const page = this.queryString.page * 1
        const skip = (page-1)*limit
        if(this.queryString.page){
            this.query = this.query.skip(skip).limit(limit)
        } else {
            this.query = this.query.limit(15)           // The first 15 Documents
        }
        return this
    }
}

module.exports = {APISearchFeatures}