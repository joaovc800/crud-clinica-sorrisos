import pkg from 'pg';
const { Pool } = pkg;

class Database {
  constructor() {
    this.pool = new Pool({
      host: 'localhost',
      port: 5432,
      user: 'postgres',
      password: 'pabd',
      database: 'ProjetoFinal',
      //connectionString: 'postgres://postgres:pabd@localhost:5432/ProjetoFinal'
    });
  }

  async query(sql, params = []) {
    const client = await this.pool.connect();
    try {
      const result = await client.query(sql, params);
      return result.rows;
    } catch (error) {
      console.error('Erro na query:', error);
      throw error;
    } finally {
      client.release();
    }
  }

}

export default Database;
