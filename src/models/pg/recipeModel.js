import { dbConnectionPg } from "../../config/config.js";


const connection = await dbConnectionPg()

export class recipe {
  /**
   * Devuelve la nueva receta (recipe) correspondiente a un usuario de la base de datos.
   * @param {number} user_id - Del usuario que registra el dato.
   * @returns {Promise<recipe|null|{error:string}} Una promesa que resuelve en un objeto con los datos de la receta, o un error si ocurrió algún problema.
   */
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

      if (rows.length === 0) return null

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
      return { error: error.message }
    }
  }

  /**
   * Crea una nueva receta (recipe) en la base de datos.
   * @param {Object} options - Opciones para crear la receta (recipe).
   * @param {number} options.user_id - El ID del usuario que creará la receta (recipe).
   * @param {Object} options.data - El objeto que contandrá los datos para la receta (recipe).
   * @param {string} options.data.start_date - La fecha de inicio de la receta (recipe).
   * @param {string} options.data.end_date - La fecha de fin la receta (recipe).
   * @returns {Promise<boolean>|{error:string}} Una promesa que resuelve en verdadero si la receta se creó exitosamente, o un error si ocurrió algún problema.
   */
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
        return { error: error.message }
      }
  }

  /**
   * Crea una nueva receta (recipe) en la base de datos.
   * @param {number} user_id - El id del usuario que obtiene el id de la receta.
   * @returns {Promise<number>|{error:string}} Una promesa que resuelve un id encontrado, o un error si ocurrió algún problema.
   */
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
      return { error: error.message }
    }
  }

  /**
   * Crea un nuevo medicamento para la receta (recipe) en la base de datos.
   * @param {Object} options - Opciones para crear el medicamento.
   * @param {number} options.recipe_id - El ID de la receta en la cual se almacenará el medicamento.
   * @param {string} options.medicine_name - El nombre del nuevo medicamento (recipe).
   * @param {string} options.amount - La cantidad de tomas del medicamento.
   * @param {string} options.hours - El intervalo de horas en el cual consumir el medicamento.
   * @returns {Promise<boolean>|{error:string}} Una promesa que resuelve en verdadero si el medicamento se creó exitosamente, o un error si ocurrió algún problema.
   */
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
        return { error: error.message }
      }
  }

  /**
   * Elimina un medicamento de la base de datos.
   * @param {Object} options - Las opciones para eliminar el medicamento.
   * @param {number} options.recipe_id - El ID de la receta de la cual se removerá.
   * @param {number} options.medicine_id - El ID del medicamento que se eliminará.
   * @returns {Promise<boolean|{error:string}>} Una promesa que resuelve en verdadero si el medicamento se elimina exitosamente, o un objeto de error si ocurre algún problema.
   */
  static async deleteMedicine({ recipe_id, medicine_id }) {
    try {
      const { rows } = await connection.query(`
      DELETE FROM medicines
      WHERE recipe_id=$1 AND id=$2;`,
      [recipe_id, medicine_id])
      return true
    }
    catch(error) {
      console.error(`\x1b[31man error occurred ${error}\x1b[0m`)
      return { error: error.message }
    }
  }

  /**
   * Elimina un post de la base de datos.
   * @param {number} user_id - El ID del usuario que a quien le pertenece la receta.
   * @returns {Promise<boolean|{error:string}>} Una promesa que resuelve en verdadero si la receta se elimina exitosamente, o un objeto de error si ocurre algún problema.
   */
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
      return { error: error.message }
    }
}    
}