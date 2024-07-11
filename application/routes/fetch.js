const getAll = async (server, { hdbCore, logger }) => {
  server.route({
    url: '/',
    method: 'GET',
    handler: async (request) => {
      let offset = 0
      let limit = 50 // Default page limit

      // Parse the offset value passed
      if (request.query.offset) {
        try {
          offset = parseInt(request.query.offset, 10)
        } catch (e) {
          logger.error(`Unable to parse offset value ${request.query.offset}: ${e.toString()}`)
        }
      }

      // Parse the limit value passed
      if (request.query.limit) {
        try {
          limit = parseInt(request.query.limit, 10)
        } catch (e) {
          logger.error(`Unable to parse limit value ${request.query.limit}: ${e.toString()}`)
        }
      }

      // Fetch the entries from the database
      request.body = {
        operation: 'sql',
        sql: `SELECT * FROM data.Entry ORDER BY date DESC LIMIT ${limit} OFFSET ${offset}`
      }

      // Submit the request
      let entries
      try {
        entries = await hdbCore.requestWithoutAuthentication(request)
      } catch (e) {
        const error = `Error fetching entries: ${e.toString()}`
        logger.error(error)
        return { success: false, message: error }
      }

      // Fetch the total amount of records
      request.body = {
        operation: 'sql',
        sql: 'SELECT COUNT(*) AS `total` FROM data.Entry'
      }

      // Submit the request
      let totalRequest
      try {
        totalRequest = await hdbCore.requestWithoutAuthentication(request)
      } catch (e) {
        const error = `Error fetching total: ${e.toString()}`
        logger.error(error)
        return { success: false, message: error }
      }
      const total = totalRequest[0].total

      return {
        success: true,
        entries,
        total
      }
    }
  })
}

export default getAll
