import { dbConnectionPg } from "../../config/config.js";

const connection = await dbConnectionPg()


export class recipe {
  static async findMedicines(user_id) {
    try {
      const { rows } = await connection.query(`
      SELECT recipes.id AS recipe_id, 
              users.username, 
              medicines.id AS medicine_id, 
              medicines.medicine_name, 
              medicines.amount, 
              medicines.hours,
              recipes.start_date,
              recipes.end_date
      FROM recipes 
      JOIN medicines 
      ON recipes.id=medicines.recipe_id 
      JOIN users ON recipes.user_id=users.id 
      WHERE user_id=$1;`,
      [user_id])
      // if (rows.length === 0) return null
      const data = {
        recipe_id: rows[0].recipe_id,
        username: rows[0].username,
        start_date: rows[0].start_date,
        end_date: rows[0].end_date,
        medicines: rows.map(({ start_date, end_date, recipe_id, username, ...rest }) => rest)
      }
      return data
    }
    catch(error) {
      console.error(`\x1b[31man error occurred ${error}\x1b[0m`)
      return {error: error.message}
    }
  }

  static async createRecipe({ user_id, data }) {
      try {
        const { rows } = await connection.query(`
        INSERT INTO recipes(user_id, start_date, end_date)
        VALUES
        ($1, $2, $3);`,
        [user_id, data.start_date, data.end_date])
        return true
      }
      catch(error) {
        console.error(`\x1b[31man error occurred ${error}\x1b[0m`)
        return {error: error.message}
      }
  }

  static async getId(user_id) {
    try {
      const { rows } = await connection.query(`
      SELECT id
      FROM recipes 
      WHERE user_id=$1;`,
      [user_id])
      if (rows.length === 0) return null
      return rows[0]
    }
    catch(error) {
      console.error(`\x1b[31man error occurred ${error}\x1b[0m`)
      return {error: error.message}
    }
  }

  static async createMedicine({ recipe_id, data }) {
      try {
        const { rows } = await connection.query(`
        INSERT INTO medicines(recipe_id, medicine_name, amount, hours)
        VALUES
        ($1, $2, $3, $4);`,
        [recipe_id, data.medicine_name, data.amount, data.hours])
        return true
      }
      catch(error) {
        console.error(`\x1b[31man error occurred ${error}\x1b[0m`)
        return {error: error.message}
      }
  }

  static async deleteRecipe(user_id) {
    try {
      const { rows } = await connection.query(`
      DELETE FROM recipes 
      WHERE user_id=$1;`,
      [user_id])
      return true
    }
    catch(error) {
      console.error(`\x1b[31man error occurred ${error}\x1b[0m`)
      return {error: error.message}
    }
}    
}